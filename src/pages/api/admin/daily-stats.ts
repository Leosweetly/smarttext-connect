// API endpoint for admin dashboard daily statistics
// Returns total calls, missed calls, SMS sent/failed, OpenAI tokens, owner alerts, and subscriber metrics

import { supabaseAdmin } from '@/lib/supabaseClient';

// Define response type
type ResponseData = {
  success: boolean;
  lastUpdated: string; // ISO timestamp of when the data was refreshed
  allTime?: {
    totalCalls: number;
    missedCalls: number;
    smsSent: number;
    smsFailed: number;
    openaiTokensUsed: number;
    ownerAlertsSent: number;
  };
  today?: {
    totalCalls: number;
    missedCalls: number;
    smsSent: number;
    smsFailed: number;
    openaiTokensUsed: number;
    ownerAlertsSent: number;
  };
  subscriberMetrics?: {
    totalBusinesses: number;
    activeBusinesses: number;
    planBreakdown: {
      free: number;
      pro: number;
      enterprise: number;
    };
    totalMRR: number;
  };
  error?: string;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/admin/daily-stats');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get today's date at midnight (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISOString = today.toISOString();

    // Fetch all-time stats
    const allTimeStats = await fetchAllTimeStats();
    
    // Fetch today's stats
    const todayStats = await fetchTodayStats(todayISOString);
    
    // Fetch subscriber metrics
    const subscriberMetrics = await fetchSubscriberMetrics();
    
    // Get current timestamp for lastUpdated
    const lastUpdated = new Date().toISOString();
    
    // Return success with stats
    return res.status(200).json({
      success: true,
      lastUpdated,
      allTime: allTimeStats,
      today: todayStats,
      subscriberMetrics,
    });
  } catch (error: any) {
    console.error('Error fetching daily stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to fetch daily stats: ${error.message || 'Unknown error'}`
    });
  }
}

async function fetchAllTimeStats() {
  // Get total calls
  const { count: totalCalls } = await supabaseAdmin
    .from('call_events')
    .select('*', { count: 'exact', head: true });

  // Get missed calls
  const { count: missedCalls } = await supabaseAdmin
    .from('call_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'missed');

  // Get SMS sent
  const { count: smsSent } = await supabaseAdmin
    .from('sms_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent');

  // Get SMS failed
  const { count: smsFailed } = await supabaseAdmin
    .from('sms_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  // Get OpenAI tokens used
  const { data: openaiData } = await supabaseAdmin
    .from('openai_usage')
    .select('tokens_used');
  
  const openaiTokensUsed = openaiData?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0;

  // Get owner alerts sent
  const { count: ownerAlertsSent } = await supabaseAdmin
    .from('owner_alert_logs')
    .select('*', { count: 'exact', head: true });

  return {
    totalCalls: totalCalls || 0,
    missedCalls: missedCalls || 0,
    smsSent: smsSent || 0,
    smsFailed: smsFailed || 0,
    openaiTokensUsed,
    ownerAlertsSent: ownerAlertsSent || 0,
  };
}

async function fetchTodayStats(todayISOString: string) {
  // Get today's calls
  const { count: totalCalls } = await supabaseAdmin
    .from('call_events')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISOString);

  // Get today's missed calls
  const { count: missedCalls } = await supabaseAdmin
    .from('call_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'missed')
    .gte('created_at', todayISOString);

  // Get today's SMS sent
  const { count: smsSent } = await supabaseAdmin
    .from('sms_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'sent')
    .gte('created_at', todayISOString);

  // Get today's SMS failed
  const { count: smsFailed } = await supabaseAdmin
    .from('sms_events')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed')
    .gte('created_at', todayISOString);

  // Get today's OpenAI tokens used
  const { data: openaiData } = await supabaseAdmin
    .from('openai_usage')
    .select('tokens_used')
    .gte('created_at', todayISOString);
  
  const openaiTokensUsed = openaiData?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0;

  // Get today's owner alerts sent
  const { count: ownerAlertsSent } = await supabaseAdmin
    .from('owner_alert_logs')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', todayISOString);

  return {
    totalCalls: totalCalls || 0,
    missedCalls: missedCalls || 0,
    smsSent: smsSent || 0,
    smsFailed: smsFailed || 0,
    openaiTokensUsed,
    ownerAlertsSent: ownerAlertsSent || 0,
  };
}

async function fetchSubscriberMetrics() {
  // Get total number of businesses
  const { count: totalBusinesses } = await supabaseAdmin
    .from('businesses')
    .select('*', { count: 'exact', head: true });

  // Get number of active businesses
  const { count: activeBusinesses } = await supabaseAdmin
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Get plan breakdown
  // Since we can't use group by directly, we'll fetch all plans and count them
  const { data: plansData } = await supabaseAdmin
    .from('businesses')
    .select('plan');
  
  // Calculate plan breakdown
  let planBreakdown = {
    free: 0,
    pro: 0,
    enterprise: 0
  };

  if (plansData) {
    plansData.forEach(item => {
      if (item.plan && item.plan in planBreakdown) {
        planBreakdown[item.plan]++;
      }
    });
  }

  // Get total MRR
  const { data: mrrData } = await supabaseAdmin
    .from('businesses')
    .select('mrr');

  const totalMRR = mrrData?.reduce((sum, item) => sum + (item.mrr || 0), 0) || 0;

  return {
    totalBusinesses: totalBusinesses || 0,
    activeBusinesses: activeBusinesses || 0,
    planBreakdown,
    totalMRR
  };
}

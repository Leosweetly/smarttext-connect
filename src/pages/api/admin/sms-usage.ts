// API endpoint for admin dashboard SMS usage
// Returns SMS sent and failed counts for today

import { supabaseAdmin } from '@/lib/supabaseClient';

// Define response type
type ResponseData = {
  success: boolean;
  sent?: number;
  failed?: number;
  date?: string;
  error?: string;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/admin/sms-usage');
  
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

    // Get today's SMS sent count
    const { count: sent, error: sentError } = await supabaseAdmin
      .from('sms_events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('created_at', todayISOString);

    if (sentError) {
      throw sentError;
    }

    // Get today's SMS failed count
    const { count: failed, error: failedError } = await supabaseAdmin
      .from('sms_events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', todayISOString);

    if (failedError) {
      throw failedError;
    }
    
    // Return success with SMS counts
    return res.status(200).json({
      success: true,
      sent: sent || 0,
      failed: failed || 0,
      date: today.toISOString().split('T')[0], // Return date in YYYY-MM-DD format
    });
  } catch (error: any) {
    console.error('Error fetching SMS usage:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to fetch SMS usage: ${error.message || 'Unknown error'}`
    });
  }
}

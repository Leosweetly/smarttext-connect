// API endpoint for admin dashboard OpenAI usage
// Returns total OpenAI tokens used today

import { supabaseAdmin } from '@/lib/supabaseClient';

// Define response type
type ResponseData = {
  success: boolean;
  tokensUsed?: number;
  error?: string;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/admin/openai-usage');
  
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

    // Get today's OpenAI tokens used
    const { data: openaiData, error } = await supabaseAdmin
      .from('openai_usage')
      .select('tokens_used')
      .gte('created_at', todayISOString);

    if (error) {
      throw error;
    }
    
    // Calculate total tokens used
    const tokensUsed = openaiData?.reduce((sum, item) => sum + (item.tokens_used || 0), 0) || 0;
    
    // Return success with tokens used
    return res.status(200).json({
      success: true,
      tokensUsed,
      date: today.toISOString().split('T')[0], // Return date in YYYY-MM-DD format
    });
  } catch (error: any) {
    console.error('Error fetching OpenAI usage:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to fetch OpenAI usage: ${error.message || 'Unknown error'}`
    });
  }
}

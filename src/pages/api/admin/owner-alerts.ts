// API endpoint for admin dashboard owner alerts
// Returns the last 20 owner alerts with timestamp, content, and status

import { supabaseAdmin } from '@/lib/supabaseClient';

// Define response type
type ResponseData = {
  success: boolean;
  alerts?: {
    id: string;
    timestamp: string;
    message: string;
    deliveryStatus: string;
  }[];
  error?: string;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/admin/owner-alerts');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get the last 20 owner alerts
    const { data: alerts, error } = await supabaseAdmin
      .from('owner_alert_logs')
      .select('id, created_at, message, delivery_status')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    // Format the alerts for the response
    const formattedAlerts = alerts.map(alert => ({
      id: alert.id,
      timestamp: alert.created_at,
      message: alert.message,
      deliveryStatus: alert.delivery_status
    }));
    
    // Return success with alerts
    return res.status(200).json({
      success: true,
      alerts: formattedAlerts,
    });
  } catch (error: any) {
    console.error('Error fetching owner alerts:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to fetch owner alerts: ${error.message || 'Unknown error'}`
    });
  }
}


// This is a serverless function for Vercel API routes
// It handles saving business information to the database

// Define response type
type ResponseData = {
  success: boolean;
  id?: string;
  error?: string;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/update-business-info');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, industry, size, website } = req.body;
    console.log('Request body:', { name, industry, size, website });

    // Validate required fields
    if (!name || !industry || !size) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // In a real implementation, this would save to a database
    // For now, just return success with a mock ID
    const mockId = `business-${Date.now()}`;
    
    return res.status(200).json({
      success: true,
      id: mockId,
    });
  } catch (error: any) {
    console.error('Error updating business info:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to update business info: ${error.message || 'Unknown error'}`
    });
  }
}

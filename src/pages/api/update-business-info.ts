// This is a serverless function for Vercel API routes
// It handles saving business information to Airtable

import Airtable from 'airtable';

// Define response type
type ResponseData = {
  success: boolean;
  id?: string;
  error?: string;
  debug?: any;
};

export default async function handler(req: any, res: any) {
  console.log('API route called: /api/update-business-info');
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, industry, size, website, recordId } = req.body;
    console.log('Request body:', { name, industry, size, website, recordId: recordId ? 'exists' : 'not provided' });

    // Validate required fields
    if (!name || !industry || !size) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Initialize Airtable
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID;
    
    console.log('Environment variables check:', { 
      apiKeyExists: !!apiKey, 
      baseIdExists: !!baseId 
    });

    // Ensure environment variables are set
    if (!apiKey || !baseId) {
      console.error('Missing Airtable environment variables');
      return res.status(500).json({ 
        success: false, 
        error: 'Server configuration error: Missing Airtable credentials',
        debug: { apiKeyExists: !!apiKey, baseIdExists: !!baseId }
      });
    }

    // Prepare record data
    const recordData = {
      Name: name,
      Industry: industry,
      Size: size,
      Website: website || '',
      LastUpdated: new Date().toISOString(),
    };
    
    console.log('Prepared record data:', recordData);

    try {
      // Initialize Airtable base and table
      console.log('Initializing Airtable connection');
      const base = new Airtable({ apiKey }).base(baseId);
      const table = base('Businesses');
      
      let record;
      
      // Update existing record or create new one
      if (recordId) {
        console.log(`Updating existing record: ${recordId}`);
        record = await table.update(recordId, recordData);
        console.log('Record updated successfully');
      } else {
        console.log('Creating new record');
        record = await table.create(recordData);
        console.log('Record created successfully:', record.id);
      }

      // Return success with record ID
      return res.status(200).json({
        success: true,
        id: record.id,
      });
    } catch (airtableError: any) {
      console.error('Airtable API error:', airtableError);
      return res.status(500).json({ 
        success: false, 
        error: `Airtable API error: ${airtableError.message || 'Unknown error'}`,
        debug: airtableError
      });
    }
  } catch (error: any) {
    console.error('Error updating business info:', error);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to update business info: ${error.message || 'Unknown error'}`,
      debug: error
    });
  }
}

// Gebruik moderne ES modules syntax
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    // Dynamic imports voor Netlify
    const fetch = (await import('node-fetch')).default;
    const pdf = (await import('pdf-parse')).default;

    // Parse body
    const body = req.body;
    const url = body.pdf_url || body.pdfUrl;

    if (!url) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Please provide pdf_url in the request body'
      });
    }

    console.log('Fetching PDF from:', url);

    // Fetch PDF
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    }

    // Parse PDF
    const pdfBuffer = await response.buffer();
    const data = await pdf(pdfBuffer);

    // Return result
    return res.status(200).json({
      pages: data.numpages,
      pageCount: data.numpages,
      success: true,
      pdf_url: url
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to process PDF',
      message: error.message,
      success: false
    });
  }
} 
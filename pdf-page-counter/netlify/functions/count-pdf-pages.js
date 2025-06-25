const fetch = require('node-fetch');
const pdf = require('pdf-parse');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        error: 'Method not allowed',
        message: 'This endpoint only accepts POST requests'
      })
    };
  }

  try {
    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          message: e.message 
        })
      };
    }

    const { pdf_url, pdfUrl } = body;
    
    // Support both pdf_url and pdfUrl for flexibility
    const url = pdf_url || pdfUrl;
    
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameter',
          message: 'Please provide pdf_url in the request body'
        })
      };
    }

    console.log('Fetching PDF from:', url);

    // Fetch the PDF from the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    // Get PDF as buffer
    const pdfBuffer = await response.buffer();
    console.log('PDF downloaded, size:', pdfBuffer.length, 'bytes');

    // Parse PDF to get page count
    const data = await pdf(pdfBuffer);
    console.log('PDF parsed successfully, pages:', data.numpages);
    
    // Return the page count
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        pages: data.numpages,
        pageCount: data.numpages,
        success: true,
        pdf_url: url
      })
    };

  } catch (error) {
    console.error('Error processing PDF:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process PDF',
        message: error.message,
        success: false
      })
    };
  }
}; 
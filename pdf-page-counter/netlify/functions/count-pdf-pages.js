const fetch = require('node-fetch');
const pdf = require('pdf-parse');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { pdf_url, pdfUrl } = body;
    
    // Support both pdf_url and pdfUrl for flexibility
    const url = pdf_url || pdfUrl;
    
    if (!url) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing pdf_url parameter' })
      };
    }

    // Fetch the PDF from the URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Get PDF as buffer
    const pdfBuffer = await response.buffer();

    // Parse PDF to get page count
    const data = await pdf(pdfBuffer);
    
    // Return the page count
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        pages: data.numpages,
        pageCount: data.numpages, // Alternative property name
        success: true
      })
    };

  } catch (error) {
    console.error('Error processing PDF:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process PDF',
        message: error.message
      })
    };
  }
}; 
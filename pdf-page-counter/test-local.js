// Test script om lokaal te testen
const handler = require('./netlify/functions/count-pdf-pages').handler;

const testEvent = {
  httpMethod: 'POST',
  headers: {
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  })
};

handler(testEvent, {})
  .then(response => {
    console.log('Response:', response);
    console.log('Body:', JSON.parse(response.body));
  })
  .catch(error => {
    console.error('Error:', error);
  }); 
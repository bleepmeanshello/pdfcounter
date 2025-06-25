import fetch from 'node-fetch';

const testUrl = 'http://localhost:8888/api/count-pdf-pages';
const pdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

console.log('Testing PDF counter API...');

try {
  const response = await fetch(testUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pdf_url: pdfUrl
    })
  });

  const data = await response.json();
  console.log('Response:', data);
} catch (error) {
  console.error('Test failed:', error.message);
  console.log('\nMake sure to run: npx netlify dev');
} 
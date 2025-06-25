# PDF Page Counter API

Een simpele Netlify Function die het aantal pagina's in een PDF telt. Vervangt de betaalde PDF.co service.

## Lokaal testen

```bash
netlify dev
```

Test endpoint: `http://localhost:8888/.netlify/functions/count-pdf-pages`

## Deploy naar Netlify

1. Push naar GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/jouw-username/pdf-page-counter.git
   git push -u origin main
   ```

2. In Netlify:
   - New site from Git
   - Connect GitHub
   - Deploy site

## Gebruik in Zapier

1. Webhook by Zapier → Custom Request
2. Method: POST
3. URL: `https://jouw-site.netlify.app/.netlify/functions/count-pdf-pages`
4. Data: `{"pdf_url": "{{pdf_url_van_vorige_stap}}"}`
5. Headers: Content-Type: `application/json`

## Response

```json
{
  "pages": 4,
  "pageCount": 4,
  "success": true
}
```

## 3. GitHub en Netlify Setup

1. **GitHub Repository maken:**
   ```bash
   # Commit alle bestanden
   git add .
   git commit -m "Initial commit - PDF page counter function"
   
   # Maak een nieuwe repository op GitHub via de website
   # Dan:
   git branch -M main
   git remote add origin https://github.com/jouw-username/pdf-page-counter.git
   git push -u origin main
   ```

2. **Netlify deployment:**
   - Ga naar https://app.netlify.com
   - "New site from Git"
   - Kies GitHub en selecteer je repository
   - Deploy settings zijn al goed (netlify.toml regelt alles)
   - "Deploy site"

3. **Live endpoint:**
   Je endpoint is dan beschikbaar op:
   `https://jouw-site-naam.netlify.app/.netlify/functions/count-pdf-pages`

## Zapier Webhook Configuratie

In Zapier, vervang de PDF.co stap met een Webhook:

1. **Action:** Webhooks by Zapier → Custom Request
2. **Method:** POST
3. **URL:** `https://jouw-site-naam.netlify.app/.netlify/functions/count-pdf-pages`
4. **Data:**
   ```json
   {
     "pdf_url": "{{stap_met_pdf_url}}"
   }
   ```
5. **Headers:**
   - Content-Type: `application/json`

## Response Format

De API geeft een JSON response:
```json
{
  "pages": 4,
  "pageCount": 4,
  "success": true
}
```

Bij een error:
```json
{
  "error": "Failed to process PDF",
  "message": "Details about the error"
}
```

## Test met cURL

```bash
curl -X POST https://jouw-site-naam.netlify.app/.netlify/functions/count-pdf-pages \
  -H "Content-Type: application/json" \
  -d '{"pdf_url": "https://example.com/sample.pdf"}'
```

## Extra Features (Optioneel)

Als je later meer functionaliteit wilt toevoegen:

```javascript
// In count-pdf-pages.js, na de page count:

// Extra metadata
return {
  statusCode: 200,
  headers,
  body: JSON.stringify({
    pages: data.numpages,
    pageCount: data.numpages,
    info: {
      title: data.info?.Title || null,
      author: data.info?.Author || null,
      subject: data.info?.Subject || null,
      creator: data.info?.Creator || null
    },
    success: true
  })
};
```

## Kosten

- **Netlify Free Tier:** 125k function invocations per maand
- **PDF.co:** Betaald per API call
- **Besparing:** 100% van PDF.co kosten voor deze functie

## Troubleshooting

1. **"Module not found" error:** Run `npm install` in de project root
2. **CORS errors:** Check dat de headers correct zijn ingesteld
3. **Timeout errors:** Grote PDF's kunnen langer duren, overweeg de timeout te verhogen in netlify.toml:
   ```toml
   [functions]
     timeout = 20
   ``` 
# Meri Zimmedari URL Shortener Frontend

A minimal, fast redirect service for the Meri Zimmedari platform's URL shortener.
hi.
## Purpose

This frontend resolves short URLs (e.g., `https://mzno.in/abc12345`) and redirects users to the full platform URLs. It's designed to work with DLT SMS templates which have a 30-character URL limit.

## URL Flow

```
User clicks: https://mzno.in/abc12345
       |
       v
Frontend extracts token: abc12345
       |
       v
API call: GET /api/public/r/abc12345/
       |
       v
Response: { "url": "https://meri-jimmedari.srashtasoft.in/verify/..." }
       |
       v
Redirect to full URL
```

## Technology Stack

- **Vite** - Fast build tool
- **TypeScript** - Type-safe JavaScript
- **Vanilla JS** - No framework overhead (~10KB bundle)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Backend API URL
VITE_API_BASE_URL=https://api.meri-jimmedari.srashtasoft.in
```

### Deployment

Recommended: **Cloudflare Pages**

1. Connect GitHub repository to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Set environment variables in Cloudflare dashboard
5. Configure custom domain: `mzno.in`

### License

MIT

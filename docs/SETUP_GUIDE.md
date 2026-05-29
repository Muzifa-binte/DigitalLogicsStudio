# Frontend Setup Guide

This guide explains how to run the Boolforge frontend locally.

## Prerequisites

- Node.js 18 or newer recommended.
- npm 9 or newer recommended.
- A running backend API for auth and progress features.

## Install

```bash
cd frontend
npm install
```

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Supported variables:

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `REACT_APP_API_URL` | Yes | `http://localhost:5000/api` | Backend API base URL. |
| `REACT_APP_SITE_URL` | Yes for production SEO | `https://circuits.quantumlogicslimited.com` | Canonical site origin. |
| `REACT_APP_GA_MEASUREMENT_ID` | No | `G-XXXXXXXXXX` | GA4 page tracking. |
| `REACT_APP_GOOGLE_SITE_VERIFICATION` | No | token | Google Search Console verification. |
| `REACT_APP_BING_SITE_VERIFICATION` | No | token | Bing Webmaster Tools verification. |

Create React App only exposes variables prefixed with `REACT_APP_`.

## Run Locally

```bash
npm start
```

The app runs at `http://localhost:3000`.

## Backend Dependency

Authentication and progress require the backend:

```bash
cd ../backend
npm run dev
```

Recommended local pairing:

```env
# frontend/.env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_URL=http://localhost:3000

# backend/.env
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Tests

```bash
npm test
```

The project uses Create React App and Testing Library.

## Production Build

```bash
npm run build
```

The build pipeline runs:

1. `prebuild`: generates SEO assets.
2. `react-scripts build`: creates static assets.
3. `postbuild`: runs the custom prerender flow through `react-snap`.

## Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Login succeeds but refresh logs out | Cookie not sent to backend | Ensure backend CORS and frontend `REACT_APP_API_URL` use matching deployed origins. |
| API requests hit localhost in production | Missing production env var | Set `REACT_APP_API_URL` in hosting dashboard. |
| Build fails during prerender | Route or browser rendering error | Check the route listed in the build output and run locally. |
| SEO URLs point to wrong domain | Missing `REACT_APP_SITE_URL` | Set canonical production URL. |


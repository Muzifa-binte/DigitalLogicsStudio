const LOCAL_API_URL = "http://localhost:5000/api";
const SAME_ORIGIN_API_URL = "/api";
const PRODUCTION_API_URL =
  "https://digital-logics-studio-backend.vercel.app/api";
// The -three deployment is not ours and is stale (missing the newer auth routes).
const LEGACY_PRODUCTION_API_URL =
  "https://digital-logics-studio-backend-three.vercel.app/api";

function normalizeUrl(url) {
  return url.trim().replace(/\/+$/, "");
}

function shouldUseSameOriginProxy(url) {
  const normalized = normalizeUrl(url);
  return (
    normalized === SAME_ORIGIN_API_URL ||
    normalized === normalizeUrl(PRODUCTION_API_URL) ||
    normalized === normalizeUrl(LEGACY_PRODUCTION_API_URL)
  );
}

export function resolveApiBaseUrl() {
  const configured = process.env.REACT_APP_API_URL?.trim();
  if (configured) {
    if (shouldUseSameOriginProxy(configured)) {
      return SAME_ORIGIN_API_URL;
    }
    return normalizeUrl(configured);
  }
  return process.env.NODE_ENV === "production"
    ? SAME_ORIGIN_API_URL
    : LOCAL_API_URL;
}

export function resolveAiBaseUrl() {
  const configuredAi = process.env.REACT_APP_AI_URL?.trim();
  if (configuredAi) {
    return configuredAi.replace(/\/+$/, "");
  }
  return `${resolveApiBaseUrl()}/ai`;
}

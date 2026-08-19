// Cloudflare Pages Function: same-origin proxy for Typesense.
//
// Browser → https://word.lovejade.cn/typesense/<path>
//        → this Function → https://typesense.yuxuanda.cn/<path>
//
// The browser only ever sees a placeholder API key; the real
// search-only key (TYPESENSE_SEARCH_API_KEY) is injected here.

const DEFAULT_ALLOWED_ORIGINS = [
  "https://word.lovejade.cn",
  "http://localhost:6969",
  "http://127.0.0.1:6969",
];

const ALLOWED_METHODS = new Set(["GET", "POST", "OPTIONS"]);

const ALLOWED_PATH_PATTERNS = [
  /^health$/,
  /^multi_search$/,
  /^collections\/[^/]+\/documents\/search$/,
];

export const onRequest = async ({ request, env, params }) => {
  const corsHeaders = buildCorsHeaders(request, env);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!ALLOWED_METHODS.has(request.method)) {
    return jsonResponse(
      { error: "Method not allowed" },
      { status: 405, headers: corsHeaders, allow: "GET, POST, OPTIONS" }
    );
  }

  const path = resolvePath(params);
  if (!isAllowedPath(path)) {
    return jsonResponse(
      { error: "Typesense proxy path not allowed", path },
      { status: 403, headers: corsHeaders }
    );
  }

  const typesenseOrigin = env.TYPESENSE_ORIGIN || env.TYPESENSE_NODE_URL;
  const typesenseSearchApiKey = env.TYPESENSE_SEARCH_API_KEY;

  if (!typesenseOrigin || !typesenseSearchApiKey) {
    return jsonResponse(
      {
        error:
          "Typesense proxy is missing required env vars (TYPESENSE_ORIGIN, TYPESENSE_SEARCH_API_KEY).",
      },
      { status: 500, headers: corsHeaders }
    );
  }

  const targetUrl = new URL(`/${path}`, typesenseOrigin);
  const incomingUrl = new URL(request.url);
  for (const [key, value] of incomingUrl.searchParams) {
    // Strip any client-supplied API key; the server-side key wins.
    if (key.toLowerCase() !== "x-typesense-api-key") {
      targetUrl.searchParams.append(key, value);
    }
  }

  const upstreamHeaders = new Headers();
  upstreamHeaders.set("X-TYPESENSE-API-KEY", typesenseSearchApiKey);
  const contentType = request.headers.get("Content-Type");
  if (contentType) upstreamHeaders.set("Content-Type", contentType);
  const accept = request.headers.get("Accept");
  if (accept) upstreamHeaders.set("Accept", accept);

  const init = {
    method: request.method,
    headers: upstreamHeaders,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    // Required by Workers runtime when forwarding a streaming body.
    init.duplex = "half";
  }

  let upstream;
  try {
    upstream = await fetch(targetUrl.toString(), init);
  } catch (error) {
    return jsonResponse(
      { error: "Typesense upstream fetch failed", detail: String(error) },
      { status: 502, headers: corsHeaders }
    );
  }

  const responseHeaders = new Headers(upstream.headers);
  for (const [key, value] of corsHeaders) {
    responseHeaders.set(key, value);
  }
  responseHeaders.set("Cache-Control", "no-store");
  responseHeaders.set("X-Typesense-Proxy", "cf-pages");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
};

const resolvePath = (params) => {
  const path = params?.path;
  if (Array.isArray(path)) return path.join("/");
  if (typeof path === "string") return path;
  return "health";
};

const isAllowedPath = (path) =>
  ALLOWED_PATH_PATTERNS.some((pattern) => pattern.test(path));

const getAllowedOrigins = (env) => {
  const raw = env.TYPESENSE_PROXY_ALLOWED_ORIGINS;
  if (!raw) return DEFAULT_ALLOWED_ORIGINS;
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const buildCorsHeaders = (request, env) => {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-TYPESENSE-API-KEY, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });

  const origin = request.headers.get("Origin");
  const allowed = getAllowedOrigins(env);

  if (allowed.includes("*")) {
    headers.set("Access-Control-Allow-Origin", "*");
  } else if (origin && allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  // If the request is same-origin, the browser never reads ACAO,
  // so omitting it on no/unknown origin is fine and safer.

  return headers;
};

const jsonResponse = (body, { status, headers, allow } = {}) => {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Content-Type", "application/json; charset=utf-8");
  if (allow) responseHeaders.set("Allow", allow);
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
};

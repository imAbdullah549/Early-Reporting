export const config = { runtime: "edge" };

const TARGET = process.env.EARLY_API_BASE ?? "https://api.early.app"; // <-- prod by default
const SPOOF_ORIGIN =
  process.env.EARLY_SPOOF_ORIGIN ?? "https://product-testing.early.app";

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const after = url.pathname.split("/api/proxy/")[1] ?? "";
  const path = after.startsWith("/") ? after.slice(1) : after;

  // Health check
  if (path === "__health") {
    return new Response(JSON.stringify({ ok: true, target: TARGET }), {
      status: 200,
      headers: { "content-type": "application/json", "x-edge-proxy": "1" },
    });
  }

  const target = new URL(`${TARGET}/${path}`);
  target.search = url.search;

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": "authorization,content-type,accept",
        "x-edge-proxy": "1",
      },
    });
  }

  const headers = new Headers(req.headers);
  headers.set("origin", SPOOF_ORIGIN);
  headers.set("accept", "application/json"); // sometimes required
  headers.delete("host");
  headers.delete("content-length");

  const method = req.method;
  const bodyAllowed = !(method === "GET" || method === "HEAD");

  console.log("EDGE PROXY", { method, path, forwardTo: target.toString() });

  const resp = await fetch(target, {
    method,
    headers,
    body: bodyAllowed ? req.body : undefined,
  });

  const out = new Headers(resp.headers);
  out.delete("content-encoding");
  out.set("x-edge-proxy", "1");
  return new Response(resp.body, { status: resp.status, headers: out });
}

// api/proxy/[...path].ts
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const incoming = new URL(req.url);

  // remove "/api/proxy/" prefix
  const path = incoming.pathname.replace(/^\/api\/proxy\//, "");

  // target Early API + keep original query string
  const target = new URL(`https://api-testing.early.app/${path}`);
  target.search = incoming.search;

  // clone headers and set the Origin your backend expects
  const headers = new Headers(req.headers);
  headers.set("origin", "https://product-testing.early.app");
  headers.delete("host");

  const method = req.method.toUpperCase();
  const bodyAllowed = !(method === "GET" || method === "HEAD");

  const resp = await fetch(target, {
    method,
    headers,
    body: bodyAllowed ? req.body : undefined,
  });

  // pass-through response
  const outHeaders = new Headers(resp.headers);
  outHeaders.delete("content-encoding"); // avoid double compression issues

  return new Response(resp.body, { status: resp.status, headers: outHeaders });
}

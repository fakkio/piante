// Server statico per il sito costruito, per il webServer di Playwright. Serve
// la cartella sotto il percorso base, come fa GitHub Pages: un link che lo
// dimentica dà 404 anche nei test.
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {extname, join, normalize, resolve} from "node:path";

const root = resolve(process.env.DIST_DIR ?? "dist-prova");
const base = process.env.BASE_PATH ?? "/piante";
const port = Number(process.env.PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === base || path.startsWith(`${base}/`)) {
    const inner = path.slice(base.length) || "/";
    const candidates = inner.endsWith("/")
      ? [join(inner, "index.html")]
      : [inner, join(inner, "index.html")];
    for (const candidate of candidates) {
      const file = normalize(join(root, candidate));
      if (!file.startsWith(root)) break;
      try {
        const body = await readFile(file);
        res.writeHead(200, {
          "content-type": TYPES[extname(file)] ?? "application/octet-stream",
        });
        res.end(body);
        return;
      } catch {
        // prova il candidato successivo
      }
    }
  }
  res.writeHead(404, {"content-type": "text/plain"});
  res.end("Not found");
}).listen(port, () =>
  console.log(`serving ${root} on http://localhost:${port}${base}/`),
);

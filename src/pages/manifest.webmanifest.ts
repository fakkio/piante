import type {APIRoute} from "astro";
import {sitePath} from "../paths";

// A minimal manifest for adding the site to the Home screen. No offline
// support: there is no service worker.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: "Piante",
      short_name: "Piante",
      description: "Schedario di consultazione delle piante coltivate.",
      lang: "it",
      start_url: sitePath(),
      scope: sitePath(),
      display: "standalone",
      background_color: "#f6f5ef",
      theme_color: "#2f6b3c",
      icons: [
        {src: sitePath("icon-192.png"), sizes: "192x192", type: "image/png"},
        {src: sitePath("icon-512.png"), sizes: "512x512", type: "image/png"},
        {
          src: sitePath("icon-maskable-512.png"),
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    }),
    {headers: {"content-type": "application/manifest+json"}},
  );

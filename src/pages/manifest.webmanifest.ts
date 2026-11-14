import type {APIRoute} from "astro";
import {percorso} from "../percorsi";

// Manifest minimo per l'aggiunta alla schermata Home. Nessun funzionamento
// offline: non c'è un service worker.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: "Piante",
      short_name: "Piante",
      description: "Schedario di consultazione delle piante coltivate.",
      lang: "it",
      start_url: percorso(),
      scope: percorso(),
      display: "standalone",
      background_color: "#f6f5ef",
      theme_color: "#2f6b3c",
      icons: [
        {src: percorso("icona-192.png"), sizes: "192x192", type: "image/png"},
        {src: percorso("icona-512.png"), sizes: "512x512", type: "image/png"},
        {
          src: percorso("icona-maschera-512.png"),
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    }),
    {headers: {"content-type": "application/manifest+json"}},
  );

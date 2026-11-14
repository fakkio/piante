// Il sito vive sotto il percorso base di GitHub Pages: ogni link e risorsa
// interna si costruisce da qui, mai con un percorso assoluto scritto a mano.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const percorso = (relativo = ""): string =>
  `${base}/${relativo.replace(/^\//, "")}`;

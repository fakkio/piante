---
name: add-info
description: Aggiungere un'Informazione a tutto lo schedario ("aggiungi l'Informazione Y", "aggiungi un campo/dato su tutte le Piante"): estende lo schema, la ricerca una volta per tutte le Piante interessate, scrive le Schede, valida, pubblica.
---

Procedura per aggiungere una nuova **Informazione** a ogni Scheda a cui si applica. Il vocabolario è in `GLOSSARY.md`; il catalogo delle Informazioni coincide con `src/infos.ts`. Se la richiesta riguarda una sola Pianta nuova, non è questa skill.

Ogni passo si chiude solo quando il suo criterio è soddisfatto.

## 1. Definire l'Informazione nello schema

Chiuso quando l'Informazione è in `src/infos.ts` con tutte e quattro le scelte sotto, e la build segnala le Schede che le mancano.

- **Nome**: la chiave inglese del glossario (camelCase); l'etichetta italiana mostrata sul sito sta accanto alla chiave. Un termine nuovo va prima nel `GLOSSARY.md`, mai inventato nel codice.
- **Tipo di valore**: il più stretto che regge la risposta, in quest'ordine: insieme di mesi (se è un periodo), numero in °C, livello su scala fissa (i valori fissi hanno l'etichetta italiana in `src/vocabulary.ts`), testo breve. Il testo è il ripiego: se la risposta si può filtrare o confrontare, serve un tipo strutturato. Ogni Informazione ha anche la nota di una o due frasi.
- **Categorie applicabili**: le Categorie per cui la domanda ha senso (rinvaso non vale per le zucchine). Le altre non la mostrano e non la richiedono. Per ciò che non è deciso a priori, la Scheda marca l'Informazione come non applicabile con la nota che spiega perché (vedi passo 3).
- **Gruppo**: uno dei temi di `THEME_LABELS` nella Scheda (terreno e rinvaso, acqua e concime, luce e temperatura, cure, problemi), quello in cui il proprietario la cercherebbe. Un tema nuovo solo se nessuno regge.

Se lo schema non dichiara ancora le Categorie applicabili, estendilo nel modo che il resto di `src/infos.ts` già usa; non introdurre un secondo meccanismo.

## 2. Ricerca unica

Chiusa quando ogni Pianta interessata ha un valore, una nota e almeno una Fonte letta davvero.

1. Leggi `contesto.local.md` (fuori da git) prima di ricercare.
2. Fai **una sola ricerca** per l'Informazione, su tutte le Piante interessate (elenco: Schede in `cards/` la cui Categoria è tra quelle applicabili), non una per Scheda. Per le Piante in numero, delega a ricerche in parallelo con la stessa domanda.
3. Gerarchia delle Fonti: istituzionali prima (società orticole, divulgazione universitaria, orti botanici, enti agrari regionali italiani per orto e agrumi); il resto solo di ripiego, segnato `fallback`. Come leggere le Fonti: `docs/agents/research.md`.
4. Adatta i periodi alla pianura del Nord Italia, in mesi.
5. Quando le Fonti discordano, la nota lo dice.

## 3. Scrivere le Schede

Chiuso quando ogni Scheda interessata contiene l'Informazione e nessun'altra parte è cambiata.

- Scrivi solo nel **frontmatter**: valore e nota dell'Informazione, e le Fonti nuove aggiunte all'elenco `sources` (senza duplicati, tipo corretto). Aggiorna `researchedOn` alla data della ricerca.
- La **Nota personale** (il corpo Markdown) resta intatta, byte per byte.
- Piante a cui l'Informazione non si applica: se la Categoria la esclude, non scrivere nulla; se la Categoria la prevede ma la Pianta no, marca l'Informazione come non applicabile con una nota che dice perché. Mai un campo vuoto.
- Nei testi versionati non vanno i dettagli personali del Contesto di coltivazione (località esatta, stanze, dimensioni o età degli esemplari): al massimo "pianura del Nord Italia" e "casa poco luminosa".

## 4. Vista "questo mese", filtri, confronto

Chiuso quando per ciascuna delle tre superfici hai deciso sì o no, e il sì è fatto.

- **Confronto** (`src/pages/compare.astro`): ogni Informazione compare come colonna scelta dalla pagina; verifica che il valore breve si legga bene in una cella e che l'etichetta sia quella giusta.
- **Questo mese** (`src/activities.ts`, `ACTIVITY_LABELS` in `src/vocabulary.ts`): entra solo se il valore è un insieme di mesi che indica un'attività da fare. Una riga in `ACTIVITIES` più l'etichetta; altrimenti non entra.
- **Filtri** (`FILTER_GROUP_LABELS` e relativi in `src/vocabulary.ts`, `src/pages/index.astro`): entra solo se il valore è un livello o un'enumerazione con pochi valori che rispondono a una domanda ("cosa metto in una stanza buia"). Testo libero e numeri no.

Se entra in una vista, aggiungi o estendi un test Playwright su Schede di prova (`tests/`), non sulle Schede reali.

## 5. Validare e pubblicare

Chiuso quando `npm run check` e `npm test` passano.

1. `npm run check` e `npm test`; la build deve validare tutte le Schede. Una Scheda non valida si corregge, mai si allenta lo schema per farla passare.
2. Commit su `main` con gitmoji (`docs/agents/commits.md`); il push pubblica.

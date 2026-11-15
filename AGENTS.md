## Project

Piante: schedario di consultazione, in italiano e pensato prima per il telefono, delle piante coltivate dal proprietario in casa, all'aperto e nell'orto. Un file Markdown per Pianta (frontmatter con le Informazioni ricercate e le Fonti, corpo con la Nota personale), sito statico Astro pubblicato su GitHub Pages.

Il vocabolario è in `GLOSSARY.md`: usalo nei testi, nei documenti e nelle issue.

### Lingua

- **Codice: sempre e solo inglese.** Identificatori, commenti, nomi di file e cartelle, script, classi CSS, chiavi e valori fissi del frontmatter, titoli dei test, messaggi di commit. Per i termini del glossario usa i nomi inglesi fissati in `GLOSSARY.md` ("Nomi nel codice"), senza inventarne altri.
- **Testi del sito e contenuto delle Schede: italiano.** Le etichette italiane dei valori fissi stanno in `src/vocabulary.ts`.
- **Documenti e issue: italiano** (`GLOSSARY.md`, `AGENTS.md`, `docs/`, ADR).

### Contesto di coltivazione e privacy

Il repository è pubblico. Località, condizioni della casa e dati sugli esemplari stanno in `contesto.local.md`, fuori da git: leggilo prima di ogni ricerca, e non riportarne mai i dettagli personali in file versionati. Nei testi pubblicati la località è al massimo "pianura del Nord Italia".

### Nota personale

Il corpo Markdown di una Scheda è scritto dal proprietario: una ricerca non lo modifica mai.

## Agent skills

### Issue tracker

Le issue vivono come GitHub Issues in questo repo (CLI `gh`), e servono per il lavoro sulla pagina; aggiungere una Pianta o un'Informazione è una richiesta diretta, senza issue. See `docs/agents/issue-tracker.md`.

### Triage labels

Etichette di default: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: un `GLOSSARY.md` e `docs/adr/` alla radice. See `docs/agents/domain.md`.

### Ricerche

Le Fonti vanno lette davvero; alcune richiedono un browser vero. See `docs/agents/research.md`.

### Foto

Ogni Pianta può avere una foto da Wikimedia Commons (solo licenze di riuso) o del proprietario. See `docs/agents/photos.md`.

### Branching (solo `main`)

Si committa su `main`, ogni push pubblica; rami `feature/<slug>` solo per modifiche grosse alla pagina. Niente gitflow, release o changelog. See `docs/agents/branching.md`.

### Commits (gitmoji)

Ogni commit inizia con una gitmoji per il tipo (`<emoji>: <descrizione>`), per il resto struttura Conventional Commits. See `docs/agents/commits.md`.

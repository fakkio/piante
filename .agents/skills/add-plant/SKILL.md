---
name: add-plant
description: Aggiungere una Pianta allo schedario ("aggiungi la pianta X", "fai la Scheda di X"): legge il Contesto di coltivazione, identifica la specie e la fa confermare, ricerca tutte le Informazioni applicabili, scrive la Scheda con la foto, valida, pubblica.
---

Procedura per aggiungere una **Pianta** con la sua **Scheda** completa (`cards/<id>.md`). Il vocabolario è in `GLOSSARY.md`; il catalogo delle Informazioni coincide con `src/infos.ts`. Se la richiesta è una nuova Informazione per tutte le Piante, non è questa skill: vedi `add-info`.

Ogni passo si chiude solo quando il suo criterio è soddisfatto. Per una Scheda esistente da rifare, parti dal passo 2 e rispetta il passo 4.

## 1. Identificare la specie

Chiuso quando il proprietario ha **confermato** il nome botanico.

1. Leggi `contesto.local.md` (fuori da git) prima di tutto: Contesto di coltivazione, casa, clima.
2. Dal nome anche approssimativo ("mandarino", "ciliegino") proponi specie o varietà con nome botanico, nomi comuni e Categoria. Chiedi conferma prima di ricercare. Se l'identificazione è solo probabile, dillo: la Scheda lo dichiarerà.
3. Determina Categoria (ornamentale, agrume, aromatica, ortaggio, bulbosa) e Stato (coltivata, in programma). Se non sono chiari, chiedili.
4. Scegli `<id>`: il nome botanico in minuscolo con trattini (`ficus-elastica`). Una Scheda che copre più varietà (es. il pomodoro) ne indica le differenze nelle note.

## 2. Ricercare le Informazioni

Chiuso quando ogni Informazione applicabile alla Categoria ha un valore, una nota di una o due frasi e almeno una Fonte letta davvero.

1. Applicabili = quelle di `src/infos.ts` per la Categoria. Quelle previste dalla Categoria ma prive di senso per la Pianta si marcano non applicabili con la nota che spiega perché; mai campi vuoti. Quelle escluse dalla Categoria non si scrivono.
2. **Gerarchia delle Fonti**: prima le istituzionali (società orticole, divulgazione universitaria, orti botanici, enti agrari regionali italiani per orto e agrumi); il resto solo di ripiego, con tipo `fallback`. Leggi le Fonti davvero, anche con un browser vero dove serve: `docs/agents/research.md`. Registra solo Fonti lette.
3. **Adatta i periodi** al clima della pianura del Nord Italia, espressi in mesi; le fonti straniere vanno tradotte al nostro calendario.
4. **Dichiara le discordanze**: quando le Fonti non concordano, o non dicono qualcosa, la nota lo scrive. Non scegliere in silenzio.
5. Tara luce, temperatura e svernamento sul Contesto di coltivazione. Se la Pianta soffrirà in una casa poco luminosa, segnalalo nel valore di luce (tollerabilità in casa) e suggerisci una luce artificiale dove serve.
6. Distingui pianta giovane e adulta solo dove la cura cambia davvero.

## 3. Scrivere la Scheda

Chiuso quando `cards/<id>.md` contiene il frontmatter completo.

- Frontmatter: nome botanico, nomi comuni e alias, Categoria, Stato, Informazioni, Fonti (titolo, indirizzo, tipo), `researchedOn` alla data della ricerca. Segui la forma di una Scheda esistente della stessa Categoria.
- Il corpo Markdown è la **Nota personale**, del proprietario: una ricerca non lo modifica mai. In una Scheda nuova resta vuoto, salvo fatti sull'esemplare comunicati dal proprietario, scritti in forma generica.
- **Privacy**: il repository è pubblico. I dettagli del Contesto di coltivazione (località esatta, stanze, dimensioni o età degli esemplari) non vanno mai in file versionati: al massimo "pianura del Nord Italia" e "casa poco luminosa".

## 4. Foto

Chiuso quando la Scheda ha una foto con licenza verificata, oppure è stato deciso di lasciarla senza.

Segui `docs/agents/photos.md`: ricerca su Wikimedia Commons, scelta di una foto che mostri davvero la specie, licenza ammessa (pubblico dominio, CC0, CC BY, CC BY-SA) **verificata sulla pagina di origine** (che deve essere la pagina del file), miniatura di circa 900 px in `cards/photos/<id>.jpg`, e `photo` nel frontmatter con autore, licenza e `sourceUrl`. Senza foto adatta la Pianta resta senza: non si forza. Una foto del proprietario sostituisce quella di Commons (`origin: own`, nessun credito di terzi).

## 5. Validare e pubblicare

Chiuso quando `npm run check` e `npm test` passano.

1. `npm run check` e `npm test`: la build valida tutte le Schede. Una Scheda non valida si corregge, mai si allenta lo schema.
2. Commit su `main` con gitmoji (`docs/agents/commits.md`); il push pubblica.

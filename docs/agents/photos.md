# Foto delle Piante

Ogni Pianta può avere una foto (`photo` nel frontmatter), mostrata nell'elenco e nella Scheda. Una Pianta senza foto adatta resta senza: non si forza.

## Foto da Wikimedia Commons

1. Cerca con l'API di Commons (`action=query`, `generator=search`, namespace 6, `prop=imageinfo&iiprop=extmetadata|url`), con uno `User-Agent` generico. Rispetta i limiti: una richiesta ogni qualche secondo.
2. Scegli una foto che mostri davvero la specie o varietà della Scheda (guardala, non fidarti del titolo). Niente foto con persone riconoscibili.
3. Licenze ammesse, verificate sulla pagina di origine: pubblico dominio, CC0, CC BY, CC BY-SA. Altre (GFDL, NC, ND...) no.
4. Scarica la miniatura a circa 900 px di larghezza (`iiurlwidth`) in `cards/photos/<id>.jpg`, dove `<id>` è il nome del file della Scheda. Il sito la ridimensiona ulteriormente in build.
5. Nel frontmatter:

   ```yaml
   photo:
     origin: commons
     file: ./photos/<id>.jpg
     author: Nome dell'autore   # pulito da HTML e note
     license: CC BY-SA 4.0      # come la scrive Commons
     sourceUrl: https://commons.wikimedia.org/wiki/File:...
   ```

La build fallisce se manca autore o licenza, se la licenza non è tra quelle ammesse, o se il file non esiste.

## Foto del proprietario

Sostituisce quella di Commons e non richiede crediti di terzi:

```yaml
photo:
  origin: own
  file: ./photos/<id>.jpg
```

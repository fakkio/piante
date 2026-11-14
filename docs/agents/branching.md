# Branching: solo `main`

Niente gitflow, release o changelog: questo è un sito di consultazione guidato dai dati, e ogni modifica deve andare online subito.

- Il lavoro ordinario (nuove Schede, nuove Informazioni, correzioni) si committa direttamente su `main`.
- Ogni push su `main` valida i dati, esegue i test e pubblica su GitHub Pages.
- Un ramo `feature/<slug>` serve solo per modifiche grosse alla pagina, che richiedono più commit prima di essere pubblicabili; si fonde in `main` a lavoro finito.

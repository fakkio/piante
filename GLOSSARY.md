# Piante

Schedario di consultazione delle piante coltivate dal proprietario, in casa e all'aperto: per ogni pianta raccoglie le informazioni di coltivazione ricercate da fonti affidabili.

## Language

**Contesto di coltivazione**:
Le condizioni reali in cui le Piante vivono (località, luminosità della casa, Protezioni invernali disponibili), usate per tarare le ricerche e tenute fuori dal repository.
_Avoid_: Profilo, impostazioni

**Pianta**:
Una specie o varietà coltivata, identificata dal nome botanico; i nomi comuni sono alias. Due vasi della stessa specie sono la stessa Pianta.
_Avoid_: Esemplare, vaso

**Categoria**:
Il tipo di coltivazione di una Pianta (ornamentale, agrume, aromatica, ortaggio, bulbosa), che determina quali Informazioni le si applicano.
_Avoid_: Tipo, gruppo

**Stato**:
Se una Pianta è già coltivata oppure in programma, cioè non ancora acquistata o seminata.
_Avoid_: Fase

**Protezione invernale**:
Uno dei tre mezzi disponibili per far svernare una Pianta: in casa, in serretta, sotto tessuto non tessuto.
_Avoid_: Riparo, copertura

**Scheda**:
L'insieme di tutte le Informazioni, le Fonti e la Nota personale di una Pianta.
_Avoid_: Pagina, voce

**Informazione**:
Un aspetto di coltivazione definito per tutte le Piante (es. terriccio, periodo di rinvaso, temperatura minima), espresso come valore breve più una nota di una o due frasi.
_Avoid_: Attributo, campo, proprietà

**Nota personale**:
Testo libero scritto dal proprietario su una Pianta, mai modificato da una ricerca.
_Avoid_: Commento, appunto

**Fonte**:
Il riferimento da cui è stata ricavata un'Informazione, conservato nella Scheda.
_Avoid_: Link, riferimento

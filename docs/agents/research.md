# Ricerche: come leggere le Fonti

Alcune Fonti istituzionali non si leggono con un semplice fetch HTTP:

- **Pagine generate via JavaScript** (es. le voci ASPCA): il contenuto non è nell'HTML iniziale.
- **Redirect in loop o controlli su cookie** (es. UF/IFAS EDIS, `ask.ifas.ufl.edu`).
- **Blocco dei client semplici** (es. Clemson HGIC risponde 403 a `curl`, ma si legge con un fetch normale).

## Cosa fare

1. Prova prima il fetch normale. Non indovinare gli URL: se danno 404, cerca la pagina giusta con una ricerca.
2. Se la pagina è renderizzata via JavaScript o fa redirect in loop, usa un **browser vero** (Chrome o il browser integrato, anche headless) che apre la pagina e ne legge il testo.
3. Se un sito blocca esplicitamente l'accesso automatico, **passa a un'altra Fonte**: niente falsificazione dell'identità del browser o altri modi per aggirare un blocco.
4. Registra nella Scheda solo le Fonti lette davvero; le lacune si dichiarano nella nota dell'Informazione.

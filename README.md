# InvoiceFlow - In Fase Di Sviluppo

InvoiceFlow è un'applicazione web per la gestione delle fatture, sviluppata con Angular.

Il progetto è basato sulla challenge **Invoice App** di Frontend Mentor e ha l'obiettivo di simulare una dashboard gestionale per creare, visualizzare, modificare, filtrare ed eliminare fatture.

---

## Funzionalità

- Visualizzazione della lista fatture
- Visualizzazione del dettaglio di una fattura
- Creazione di una nuova fattura
- Modifica di una fattura esistente
- Eliminazione di una fattura
- Salvataggio di una fattura come bozza
- Cambio stato da **In attesa** a **Pagata**
- Filtro per stato: **Bozza**, **In attesa**, **Pagata**
- Tema chiaro/scuro
- Layout responsive

---

## Tecnologie utilizzate

- Angular 21.2.12
- Angular CLI 21.2.11
- TypeScript 5.9.3
- SCSS
- Angular Signals
- Reactive Forms
- RxJS 7.8.2
- Dati locali tramite file JSON

---

## Versione Angular

Il progetto è stato inizialmente sviluppato con Angular 19.

Versioni iniziali:

- Angular: 19.2.21
- Angular CLI: 19.2.25
- TypeScript: 5.7.3

Successivamente il progetto è stato aggiornato ad Angular 21 per usare le novità più recenti e più importanti, come i Signal.

Versioni attuali:

- Angular: 21.2.12
- Angular CLI: 21.2.11
- TypeScript: 5.9.3
- RxJS: 7.8.2
- Node.js: 22.15.0
- npm: 10.9.2

---

## Stato del progetto

Il progetto è attualmente in fase di sviluppo.

La prima versione utilizza un file JSON locale per simulare i dati delle fatture.

In una fase successiva verrà aggiunto un backend con:

- Spring Boot
- Java
- PostgreSQL

---

## Strategia Git

Il progetto utilizza una strategia **Git Flow semplificata**:

- `main`: branch stabile / produzione
- `develop`: branch principale di sviluppo
- `feature/*`: branch dedicati alle singole funzionalità

Flusso di lavoro previsto:

```text
feature/* → develop → main
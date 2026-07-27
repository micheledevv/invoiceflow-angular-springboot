# InvoiceFlow - In Fase Di Sviluppo

InvoiceFlow è un'applicazione web full-stack per la gestione delle fatture, sviluppata con Angular e Spring Boot.

Il progetto nasce dalla challenge **Invoice App** di Frontend Mentor, ma è stato esteso con funzionalità reali da gestionale, come autenticazione, gestione utente, validazioni frontend/backend, esportazione PDF e dashboard protetta tramite JWT.

L'obiettivo del progetto è simulare una piattaforma gestionale moderna per creare, visualizzare, modificare, filtrare, eliminare ed esportare fatture.

> Il progetto è ancora in fase di sviluppo e viene aggiornato progressivamente con nuove funzionalità.

---

## Funzionalità principali

- Registrazione utente
- Login utente
- Autenticazione tramite JWT
- Protezione delle rotte con `authGuard`
- Salvataggio token e dati utente in `localStorage`
- Logout
- Visualizzazione della lista fatture
- Visualizzazione del dettaglio di una fattura
- Creazione di una nuova fattura
- Modifica di una fattura esistente
- Eliminazione di una fattura
- Salvataggio di una fattura come bozza
- Cambio stato da **In attesa** a **Pagata**
- Filtro per stato: **Bozza**, **In attesa**, **Pagata**
- Validazioni frontend sui form
- Validazioni backend tramite DTO
- Gestione errori HTTP con RxJS
- Notifiche globali di successo/errore
- Loader globale durante le operazioni asincrone
- Modale di conferma per l'eliminazione
- Tema chiaro/scuro
- Layout responsive
- Esportazione PDF della fattura
- Segnalazione visiva delle fatture in scadenza
- Pannello impostazioni utente
- Aggiornamento profilo utente
- Aggiornamento indirizzo mittente
- Cambio password
- Preferenze fattura
- Anagrafica clienti in fase di sviluppo

---

## Stato del progetto

Il progetto è attualmente in fase di sviluppo.

La prima versione utilizzava un file JSON locale per simulare i dati delle fatture.

Successivamente è stato aggiunto un backend reale con:

- Spring Boot
- Java
- PostgreSQL
- Spring Security
- JWT
- Validazioni lato server
- Esportazione PDF lato backend

Attualmente l'applicazione permette di gestire fatture collegate all'utente autenticato.

Sono ancora in fase di sviluppo alcune funzionalità avanzate, come la gestione completa dell'anagrafica clienti e il collegamento diretto tra clienti e fatture.

---

## Tecnologie utilizzate

### Frontend

- Angular 21.2.12
- Angular CLI 21.2.11
- TypeScript 5.9.3
- SCSS
- Angular Signals
- Angular Signal Forms
- RxJS 7.8.2
- Standalone Components
- Lazy Loading delle rotte
- Componenti riutilizzabili
- Pipes custom
- LocalStorage

### Backend

- Java 21
- Spring Boot 4.0.6
- Spring Security
- JWT
- PostgreSQL
- Maven
- Jakarta Validation
- Apache PDFBox

---

## Versione Angular

Il progetto è stato inizialmente sviluppato con Angular 19.

Versioni iniziali:

- Angular: 19.2.21
- Angular CLI: 19.2.25
- TypeScript: 5.7.3

Successivamente il progetto è stato aggiornato ad Angular 20 e poi ad Angular 21 per usare funzionalità moderne come Signals, Signal Forms e la nuova sintassi template.

Versioni attuali:

- Angular: 21.2.12
- Angular CLI: 21.2.11
- TypeScript: 5.9.3
- RxJS: 7.8.2
- Node.js: 22.15.0
- npm: 10.9.2

---

## Funzionalità frontend implementate

### Routing

Sono state configurate rotte lazy-loaded per:

- login
- registrazione
- lista fatture
- dettaglio fattura
- futura gestione clienti

Le rotte principali sono protette tramite `authGuard`.

L'utente non autenticato viene reindirizzato automaticamente alla pagina di login.

---

### Autenticazione

Il frontend gestisce:

- login
- registrazione
- salvataggio del token JWT
- salvataggio dei dati utente
- logout
- controllo autenticazione tramite Signal
- redirect automatico alla pagina login se l'utente non è autenticato

È stato introdotto un `tokenSignal` per rendere lo stato di login realmente reattivo.

In questo modo il sistema di autenticazione non dipende direttamente dal `localStorage`, ma da uno stato reattivo controllato da Angular.

---

### Signals

Il progetto utilizza Angular Signals per gestire lo stato locale dei componenti.

Esempi di utilizzo:

- stato di caricamento
- utente corrente
- token autenticazione
- fattura selezionata
- apertura/chiusura pannelli
- stato dei form
- controlli derivati con `computed`

---

### Computed

Sono stati usati `computed()` per valori derivati, ad esempio:

- disabilitare bottoni quando il form è invalido
- controllare se le password non coincidono
- verificare se è possibile aggiungere un nuovo articolo
- calcolare warning per fatture in scadenza
- derivare lo stato di login dal token

---

### Signal Forms

Sono stati usati Angular Signal Forms per gestire i form in modo tipizzato e reattivo.

Form implementati:

- login
- registrazione
- creazione fattura
- modifica fattura
- impostazioni profilo
- cambio password
- preferenze fattura

Ogni form usa validazioni dichiarative come:

- `required`
- `email`
- `minLength`
- `maxLength`
- `pattern`

---

### Componenti riutilizzabili

Sono stati creati componenti condivisi per evitare duplicazione di codice e mantenere il progetto più ordinato.

Componenti principali:

- Generic Input
- Select Input
- Calendar Input
- Textarea
- Actions Button
- Generic Modal
- Loader
- Alert/Notification Banner
- Settings Panel
- Invoice PDF Download Button
- Invoice Records

Anche le pagine di login e registrazione sono state refactorate per usare input riutilizzabili.

---

### Gestione errori

Le chiamate HTTP usano RxJS con:

- `tap`
- `catchError`
- `finalize`
- `EMPTY`

Il flusso usato è:

- `tap()` per gestire il successo
- `catchError()` per gestire errori HTTP
- `finalize()` per spegnere loader/loading a prescindere dall'esito
- `EMPTY` per chiudere lo stream dopo aver gestito un errore

Questo approccio permette di mantenere i componenti più puliti e di gestire correttamente sia gli stati di successo sia quelli di errore.

---

### Notifiche

È stato implementato un sistema globale di notifiche per mostrare messaggi di successo o errore.

Esempi:

- login riuscito
- login fallito
- registrazione riuscita
- fattura creata
- fattura eliminata
- fattura aggiornata
- PDF scaricato
- errore durante un'operazione

---

### Loader

È stato implementato un loader globale per migliorare l'esperienza utente durante operazioni asincrone.

Il loader viene usato durante:

- caricamento fatture
- caricamento dettaglio fattura
- eliminazione fattura
- aggiornamento fattura
- cambio stato fattura

---

### Esportazione PDF

È stata aggiunta la possibilità di scaricare una copia PDF della fattura dal dettaglio.

Il flusso è:

```text
Dettaglio fattura
↓
Click su "Scarica PDF"
↓
Chiamata HTTP protetta al backend
↓
Generazione PDF lato server
↓
Download del file PDF nel browser
```

Il PDF viene generato lato backend tramite Apache PDFBox.

La funzionalità è pensata come esportazione di una copia PDF di cortesia, non come fattura elettronica fiscale ufficiale.

---

### Fatture in scadenza

È stata aggiunta una gestione visiva delle fatture in scadenza.

Le fatture con stato **In attesa** vengono controllate in base alla data di scadenza.

Il frontend calcola dinamicamente i giorni mancanti partendo da:

```text
paymentDue - data attuale
```

Se una fattura è vicina alla scadenza o scaduta, viene mostrata un'icona di attenzione animata con tooltip.

Esempi di messaggi:

- La fattura scade oggi
- Manca 1 giorno alla scadenza
- Mancano 3 giorni alla scadenza
- La fattura è scaduta da 2 giorni

---

### Pannello impostazioni utente

È stato implementato un pannello impostazioni che permette all'utente autenticato di gestire i propri dati.

Funzionalità previste o implementate:

- modifica nome completo
- modifica avatar
- modifica indirizzo mittente
- modifica termini di pagamento predefiniti
- cambio password

I dati aggiornati vengono sincronizzati anche nello stato frontend dell'utente corrente.

---

## Funzionalità backend implementate

### Autenticazione

Il backend gestisce:

- registrazione utente
- login utente
- cifratura password
- generazione JWT
- protezione endpoint
- autenticazione tramite Bearer Token

Gli endpoint protetti richiedono un token JWT valido.

---

### Gestione fatture

Il backend espone endpoint per:

- recuperare tutte le fatture dell'utente autenticato
- recuperare una singola fattura
- creare una fattura
- modificare una fattura
- eliminare una fattura
- segnare una fattura come pagata
- esportare una fattura in PDF

Le fatture sono collegate all'utente autenticato.

Ogni utente può visualizzare e gestire solo le proprie fatture.

---

### Validazioni backend

Il backend non si fida dei dati ricevuti dal frontend.

Sono state introdotte DTO dedicate per validare le richieste:

- `InvoiceRequest`
- `InvoiceItemRequest`
- `SenderAddressRequest`
- `ClientAddressRequest`
- `RegisterRequest`
- `LoginRequest`

Il backend valida:

- email
- CAP
- nome cliente
- descrizione
- indirizzi
- stato fattura
- termini pagamento
- quantità articoli
- prezzo articoli
- numero massimo di articoli
- presenza di almeno un articolo
- duplicazione ID fattura

---

### Calcoli lato backend

Il backend ricalcola dati importanti per evitare manipolazioni dal frontend:

- data di scadenza
- totale articolo
- totale fattura

Questo rende la gestione delle fatture più sicura e coerente.

---

### Impostazioni utente

È stato aggiunto un modulo impostazioni che permette di gestire:

- nome completo
- avatar
- indirizzo mittente
- termini di pagamento predefiniti
- cambio password

---

### Esportazione PDF lato backend

Il backend genera il PDF della fattura tramite Apache PDFBox.

Endpoint dedicato:

```text
GET /api/invoices/{id}/pdf
```

Il PDF viene generato solo se la fattura appartiene all'utente autenticato.

---

## Gestione dei branch

Il progetto utilizza una strategia **Git Flow semplificata**, pensata per mantenere il codice ordinato durante lo sviluppo.

### Branch principali

- `main`: contiene il codice stabile, pronto per essere considerato versione finale o produzione.
- `develop`: contiene il codice aggiornato in fase di sviluppo.
- `feature/*`: branch dedicati allo sviluppo di singole funzionalità.

Il flusso principale è:

```text
feature/* → develop → main
```

---

### Regole di lavoro

Ogni nuova funzionalità viene sviluppata su un branch dedicato partendo da `develop`.

Esempio:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/invoice-pdf-export
```

Una volta completata la funzionalità, il branch viene unito in `develop`.

Solo quando il progetto raggiunge uno stato stabile, `develop` viene unito in `main`.

---

### Convenzione nomi branch

I branch vengono nominati in modo descrittivo, usando il prefisso `feature/`.

Esempi:

```text
feature/invoice-form
feature/invoice-pdf-export
feature/client-management
feature/user-settings
feature/due-date-alerts
```

In questo modo ogni branch rappresenta una funzionalità chiara e isolata.

---

### Convenzione commit

I commit seguono una convenzione semplice e leggibile.

Esempi:

```bash
git commit -m "feat: add invoice PDF export"
git commit -m "feat: add user settings panel"
git commit -m "fix: correct auth redirect after login"
git commit -m "style: improve invoice record layout"
git commit -m "refactor: use reusable inputs in auth pages"
```

Prefissi usati:

- `feat`: nuova funzionalità
- `fix`: correzione bug
- `style`: modifiche grafiche o SCSS
- `refactor`: miglioramento codice senza cambiare comportamento
- `docs`: modifiche alla documentazione
- `chore`: modifiche tecniche o di configurazione

---

### Workflow usato

Il workflow tipico è:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-funzionalita
```

Durante lo sviluppo:

```bash
git status
git add .
git commit -m "feat: descrizione funzionalità"
```

Al termine della feature:

```bash
git checkout develop
git merge feature/nome-funzionalita
git push origin develop
```

Quando `develop` è stabile:

```bash
git checkout main
git merge develop
git push origin main
```

---

### File sensibili

I file contenenti configurazioni locali o credenziali non vengono committati.

Esempio:

```text
application.properties
```

Per il backend è presente un file di esempio sicuro:

```text
application-example.properties
```

Questo permette di condividere la struttura della configurazione senza esporre dati sensibili come password del database o chiavi JWT.

---

## Struttura generale del progetto

```text
invoiceflow-angular/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   ├── pages/
│   │   │   └── settings/
│   │   │
│   │   ├── features/
│   │   │   ├── invoices/
│   │   │   └── clients/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   └── services/
│   │   │
│   │   └── app.routes.ts
│   │
│   └── assets/
│
└── invoiceflow-backend/
    ├── src/main/java/com/invoiceflow/
    │   ├── auth/
    │   ├── controller/
    │   ├── dto/
    │   ├── model/
    │   ├── repository/
    │   ├── security/
    │   ├── service/
    │   ├── settings/
    │   └── user/
    │
    └── pom.xml
```

---

## Setup backend

Il backend usa un file locale:

```text
application.properties
```

Questo file non deve essere committato perché contiene credenziali locali.

È presente invece un file sicuro di esempio:

```text
application-example.properties
```

Esempio configurazione locale:

```properties
spring.application.name=invoiceflow-backend

spring.datasource.url=jdbc:postgresql://localhost:5432/invoiceflow
spring.datasource.username=postgres
spring.datasource.password=LA_TUA_PASSWORD_POSTGRES

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.secret=invoiceflow-local-dev-secret-key
jwt.expiration=86400000
```

---

## Comandi principali

### Frontend

```bash
npm install
ng serve
```

Applicazione frontend:

```text
http://localhost:4200
```

---

### Backend

```bash
cd invoiceflow-backend
.\mvnw.cmd spring-boot:run
```

Backend:

```text
http://localhost:8080
```

---

## Funzionalità previste

Il progetto è ancora in fase di sviluppo.

Funzionalità previste o in lavorazione:

- anagrafica clienti completa
- collegamento clienti/fatture
- ricerca clienti
- dettaglio cliente
- precompilazione fattura da cliente esistente
- dashboard statistiche
- ordinamento avanzato fatture
- test automatici
- Docker Compose
- Swagger/OpenAPI

---

## Obiettivo del progetto

InvoiceFlow ha l'obiettivo di mostrare competenze moderne nello sviluppo frontend e full-stack, tra cui:

- Angular moderno
- Signals
- Signal Forms
- gestione stato reattiva
- componenti riutilizzabili
- UI responsive
- autenticazione JWT
- integrazione frontend/backend
- validazioni complete
- gestione errori
- generazione PDF
- architettura modulare
- uso corretto di Git Flow
- protezione dei dati sensibili tramite `.gitignore`
- organizzazione del codice per feature

Il progetto è pensato come applicazione portfolio per dimostrare competenze reali nello sviluppo di una dashboard gestionale moderna.
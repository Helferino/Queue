## Queue system


### Setup

Vytvorenie v roote appky `.env` suboru podla `.env.example` predlohy.

Naistalovanie potrebnych dependencies:
```
npm install
```

Spustenie appky v dev prostredi:
```
npm run dev
```

Spustit work scriptu ktory kazdu chvilu checkuje a spracuje tickety z redisu. Vsetky potrebne informacie o spracovani budu vypisane v tomto procese:
```
adonis work
```

### Funkcnost

- Otvorenie FE rozhrania na `localhost:3333`
- Vlozenie validneho emailu (Backend validacia)
- Zmacknutie Submit button ktory zaradi Vas ticket do stsanice s najmensim poctom ticketov
- Po vyhodnoteni (5-15s) ticketu pride cez websocket notifikacia o uspesnom spracovani ticketu

Ostatne:

- Je tu moznost vytvorit fake requesty na nove tickety cez prikaz `adonis fake --number 10`
- Monitoring vyuzitia je mozny cez `localhost:3333/stats`
- Je mozne menit hodnoty cez `.env` hodnoty (pozri `.env.example`)

## Zlepsenia

- Aktualne to je single thread, cize kazda station je v rovnakom procese co moze byt pri velkych cislach pomale. V buducnosti by sa to mohlo automaticky clustrovat a vytvarat nove stations, procesy podla potreby a fungovlali by nezavysle len na redise.
- Tranzakcie pri redis operaciach
- Dockerizacia
- Unit testy

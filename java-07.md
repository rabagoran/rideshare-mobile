# RideShare — Java 7: Korrigjimi i një problemi

**Studenti:** Goran Raba  
**Kodi personal:** P7-526  
**Llogaria:** raba  
**Skenari:** Rasti 1 — Lista dhe detajet

## Hapi 1 — Hapja e projektit dhe rasti

Projekti u hap nga dosja `aplikacioni/`, ku ndodhet `package.json`. Serveri lokal
u nis me `npm run dev` dhe u përgjigj në `http://localhost:3000`.

U zgjodh Rasti 1 — Lista dhe detajet. Vlerat personale të provës janë:

- Nisja drejt AAB-së: Gjakovë
- Ora fillestare: 08:20
- Vende fillestare: 2
- Ora për provën e re: 08:25
- Rasti kufitar: ID udhëtimi që nuk ekziston

## Hapi 2 — Parashikimi para korrigjimit

Parashikimi im për Rastin 1: kur lista dhe databaza janë të arritshme, Arta duhet
të hapë një udhëtim nga lista dhe të shohë te detajet të njëjtin ID, nisje,
destinacion, orë dhe vende. Për një ID që nuk ekziston, duhet të shfaqet faqja
“Udhëtimi nuk u gjet” me lidhje për t'u kthyer te lista. Nëse databaza nuk
përgjigjet, faqja duhet të tregojë se të dhënat nuk u ngarkuan dhe t'i japë
përdoruesit një veprim të qartë për ta provuar përsëri.

## Rezultati i kontrollit fillestar

Faqja kryesore dhe detajet e ID 2 u përgjigjën me HTTP 200, por paraqitën
mesazhin se nuk u lidhën me databazën. Endpoint-i `GET /api/udhetimet` nuk dha
listën e udhëtimeve. Prandaj nuk u verifikua nëse ekziston udhëtimi Gjakovë →
AAB me orën 08:20 dhe 2 vende, dhe nuk u krye prova me një ID të zgjedhur nga
lista. Asnjë e dhënë udhëtimi nuk u ndryshua.

Rasti 1 është zgjedhur për raportim, por kontrolli i listës dhe ndjekja e të
njëjtit ID te detajet mbeten të papërfunduara derisa databaza të jetë e
arritshme. Vlerat e gjeneruara janë të dhëna testimi; kodi personal nuk është
regjistrim ose provë autorësie.

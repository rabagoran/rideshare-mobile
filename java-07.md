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

## Hapi 3 — Dy problemet dhe korrigjimi

1. **Lista dhe databaza:** `GET /api/udhetimet` ktheu HTTP 503. Faqja e listës
   u kthye me HTTP 200, por tregoi gabimin e lidhjes; udhëtimet nuk u shfaqën.
2. **Rikuperimi te detajet:** kur databaza nuk lidhet, detajet shfaqnin vetëm
   gabimin dhe lidhjen për t'u kthyer te lista. Nuk kishte veprim të qartë për
   të provuar sërish të njëjtat detaje.

Korrigjova problemin e dytë te
`aplikacioni/src/app/udhetimi/[id]/page.tsx`. Gjendja e gabimit tani shpjegon
se detajet nuk u ngarkuan, ofron “Provo përsëri” për të njëjtin ID dhe ruan
lidhjen për kthim te lista. `prefetch={false}` shmang kërkesën automatike në
sfond për të njëjtën faqe. Nuk ndryshova rreshta udhëtimesh ose të dhëna reale.

## Hapi 4 — Tri prova

### Prova 1 — Hapja e listës

- **Hapat:** Hapa `http://localhost:3000` dhe kontrollova endpoint-in
  `/api/udhetimet`.
- **Pritshmëria:** Lista shfaq udhëtimet që vijnë nga databaza.
- **Vëzhgimi:** Faqja u përgjigj me HTTP 200, por tregoi gabimin e lidhjes;
  endpoint-i u përgjigj me HTTP 503. Lista nuk u verifikua.

### Prova 2 — Detajet e ID 2

- **Hapat:** Hapa `/udhetimi/2` pas korrigjimit.
- **Pritshmëria:** Të shfaqen vlerat e të njëjtit udhëtim nga lista; nëse
  databaza dështon, të ketë udhëzim dhe mundësi për riprovim.
- **Vëzhgimi:** Databaza nuk u lidh, ndaj vlerat e udhëtimit nuk u ngarkuan.
  Gjendja e re u shfaq dhe përmbante “Provo përsëri” dhe “Kthehu te lista”.
  Pjesa e korrigjimit kaloi; rrjedha me të dhënat reale nuk u verifikua.

### Prova 3 — ID që nuk ekziston

- **Hapat:** Hapa `/udhetimi/999999`.
- **Pritshmëria:** Të shfaqet “Udhëtimi nuk u gjet” dhe lidhja për t'u kthyer te
  lista.
- **Vëzhgimi:** Edhe kjo kërkesë dështoi te lidhja me databazën para se sistemi
  të mund të kontrollonte nëse ID ekziston. Prandaj rezultati 404 nuk u
  verifikua.

## Hapi 5 — Commit-et

- **Para:** [Java 7 parashikimi dhe rasti](https://github.com/rabagoran/rideshare-mobile/commit/008f4258e9e7f88f201902ed6c3545782db28f61)
- **Pas:** [Java 7 përmirëso rikuperimin e detajeve](https://github.com/rabagoran/rideshare-mobile/commit/5a764e7dc6774486f4b772c2d72239caae77132e)

U verifikuan `npm run lint` dhe `npm run build`; të dyja përfunduan pa gabime.

## Hapi 6 — Dorëzimi dhe ndihma

**Ndryshimi i hyrjes:** puna u bë lokalisht në këtë repository. Udhëtimi nuk u
ndryshua. Nuk u bë demonstrim me koleg; prova e listës dhe e ID-së mungon për
shkak të HTTP 503 nga databaza.

**Ndihma nga AI:** u përdor Codex për të lexuar udhëzimin, shqyrtuar kodin,
propozuar dhe zbatuar korrigjimin, si dhe për të dokumentuar provat. Për këtë
arsye, parashikimi në raport nuk paraqitet si punë e bërë pa AI.

**GitHub Issue:** nuk u krijua. Mjedisi nuk ka GitHub CLI ose lidhje shkrimi
për Issue. Linku i repository-t që kërkon formulari është
https://github.com/rabagoran/rideshare-mobile.

# RideShare — Java 7: Korrigjimi i një problemi

## Rasti im

Kodi personal për pronarin aktual të repository-t: P7-661

GitHub: rabagoran

Skenari: Rasti 1 — Lista dhe detajet

Vlerat e gjeneruara për këtë llogari: Ferizaj → AAB, 10:25, 2 vende; ora e re
10:30.

## Parashikimi

Kur databaza është e arritshme, Arta duhet të hapë një udhëtim nga lista dhe të
shohë te detajet të njëjtin ID, nisje, destinacion, orë dhe vende. Për një ID që
nuk ekziston, duhet të shfaqet “Udhëtimi nuk u gjet” me lidhje për t'u kthyer te
lista. Nëse databaza nuk përgjigjet, faqja duhet të shpjegojë dështimin dhe të
ofrojë mënyrë për të provuar përsëri.

## Dy probleme

1. `GET /api/udhetimet` ktheu HTTP 503, kështu lista nuk mundi të shfaqte
   udhëtimet.
2. Kur databaza nuk lidhej, faqja e detajeve tregonte gabimin dhe kthimin te
   lista, por nuk ofronte riprovim të qartë për të njëjtin ID.

## Korrigjimi

Skedari: `aplikacioni/src/app/udhetimi/[id]/page.tsx`

Gjendja e gabimit tani shpjegon se detajet nuk u ngarkuan, ofron “Provo përsëri”
për të njëjtin ID dhe ruan lidhjen për kthim te lista. `prefetch={false}` shmang
kërkesën automatike në sfond për të njëjtën faqe. Nuk ndryshova të dhëna
udhëtimesh.

### Prova 1

Hapat: Hapa `http://localhost:3000` dhe kontrollova `/api/udhetimet`.

Pritshmëria: Lista shfaq udhëtimet e databazës dhe API kthen HTTP 200.

Vëzhgimi: Faqja u përgjigj HTTP 200, por tregoi gabimin e lidhjes; API ktheu
HTTP 503. Lista nuk u verifikua.

### Prova 2

Hapat: Hapa `/udhetimi/2` pas korrigjimit.

Pritshmëria: Të shfaqen vlerat e të njëjtit udhëtim nga lista; në rast gabimi të
databazës, të ketë udhëzim dhe mundësi riprovimi.

Vëzhgimi: Databaza nuk u lidh, ndaj vlerat nuk u ngarkuan. Mesazhi i ri u shfaq
me “Provo përsëri” dhe “Kthehu te lista”. Rrjedha me të dhëna reale nuk u
verifikua.

### Prova 3

Hapat: Hapa `/udhetimi/999999`.

Pritshmëria: Të shfaqet “Udhëtimi nuk u gjet” dhe lidhja për t'u kthyer te lista.

Vëzhgimi: Kërkesa dështoi te lidhja me databazën para kontrollit të ID-së;
rezultati 404 nuk u verifikua.

## Ndryshimi i ri

Pas përditësimit të `aplikacioni/.env.local`, e rindiza aplikacionin. Formati i
`DATABASE_URL` u verifikua, por nga ky mjedis lidhja me Neon ende dështoi (`fetch
failed`); `/api/udhetimet` ktheu HTTP 503. Duhet riprovuar nga rrjeti ku Neon
është i arritshëm. Kodi P7-526 ishte gjeneruar për emrin `raba`; repository
publik i kësaj pune është nën `rabagoran`, ndaj përputha rastin e raportit me
llogarinë e repository-t dhe rregullin e kontrollit automatik.

## Ndihma nga AI

U përdor Codex për të lexuar udhëzimin, shqyrtuar kodin, zbatuar korrigjimin,
testuar përgjigjet lokale dhe dokumentuar rezultatet. Parashikimi nuk paraqitet
si punë e bërë pa AI. Demonstrimi me koleg nuk u krye.

## Versionet

Para: https://github.com/rabagoran/rideshare-mobile/commit/008f4258e9e7f88f201902ed6c3545782db28f61

Pas: https://github.com/rabagoran/rideshare-mobile/commit/5a764e7dc6774486f4b772c2d72239caae77132e

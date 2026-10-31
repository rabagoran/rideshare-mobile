# RideShare — Java 7: Korrigjimi i një problemi

## Rasti im

Kodi personal për pronarin aktual të repository-t: P7-561

GitHub: rabagoran

Skenari: Rasti 1 — Lista dhe detajet

Vlerat e gjeneruara për këtë llogari: Pejë → AAB, 08:15, 1 vend; ora e re
08:20.

## Parashikimi

Kur databaza është e arritshme, Arta duhet të hapë një udhëtim nga lista dhe të
shohë te detajet të njëjtin ID, nisje, destinacion, orë dhe vende. Për një ID që
nuk ekziston, duhet të shfaqet “Udhëtimi nuk u gjet” me lidhje për t'u kthyer te
lista. Nëse databaza nuk përgjigjet, faqja duhet të shpjegojë dështimin dhe të
ofrojë mënyrë për të provuar përsëri.

## Dy probleme

1. Lokalisht `GET /api/udhetimet` kthente HTTP 503 dhe faqja kryesore tregonte
   “Nuk u lidhëm me databazën”, edhe pse `DATABASE_URL` ishte i saktë dhe në
   Vercel lista punonte. Kur e shfaqa gabimin e plotë në terminal, doli
   `fetch failed` me shkakun `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. Avast Antivirus
   kontrollon lidhjet HTTPS me certifikatën e vet dhe Node.js nuk e njihte atë
   certifikatë, kështu që e ndërpriste lidhjen me Neon. Problemi ishte te mjedisi
   im, jo te kodi. E zgjidha duke e nisur serverin me certifikatat e Windows-it:
   `$env:NODE_USE_SYSTEM_CA="1"; npm run dev`.
2. Kur databaza nuk lidhej, faqja e detajeve tregonte gabimin dhe kthimin te
   lista, por nuk ofronte riprovim të qartë për të njëjtin ID.

## Korrigjimi

Skedari: `aplikacioni/src/app/udhetimi/[id]/page.tsx`

Gjendja e gabimit tani shpjegon se detajet nuk u ngarkuan, ofron “Provo përsëri”
për të njëjtin ID dhe ruan lidhjen për kthim te lista. `prefetch={false}` shmang
kërkesën automatike në sfond për të njëjtën faqe. Nuk ndryshova të dhëna
udhëtimesh.

### Prova 1 (e dështuar, para zgjidhjes së lidhjes)

Hapat: Nisa `npm run dev`, hapa `http://localhost:3000` dhe kontrollova
`/api/udhetimet`.

Pritshmëria: Lista shfaq tri udhëtimet e databazës dhe API kthen HTTP 200.

Vëzhgimi: Faqja u hap, por tregoi “Nuk u lidhëm me databazën. Provo përsëri.”
API ktheu HTTP 503. Në terminal pashë `fetch failed` /
`UNABLE_TO_VERIFY_LEAF_SIGNATURE` (problemi 1 më lart).

### Prova 2 (lista dhe detajet, pas zgjidhjes së lidhjes)

Hapat: E nisa serverin me `$env:NODE_USE_SYSTEM_CA="1"; npm run dev`, hapa
`http://localhost:3000` dhe pastaj “Shiko detajet” te udhëtimi me ID 2.

Pritshmëria: Lista shfaq tri udhëtimet; detajet e ID 2 kanë të njëjtat vlera si
karta në listë.

Vëzhgimi: Lista shfaqi Prishtinë – AAB, Fushë Kosovë – AAB dhe Lipjan – AAB;
`/api/udhetimet` ktheu HTTP 200. Te `/udhetimi/2` u shfaq Fushë Kosovë – AAB,
ora 08:15, vendtakimi “Te stacioni kryesor”, 1 vend i lirë dhe butoni “Kërko
vend”, njësoj si te karta në listë. E njëjta gjë funksionoi edhe në Vercel:
<https://rideshare-mobile-inky.vercel.app>.

### Prova 3 (ID që nuk ekziston)

Hapat: Hapa `http://localhost:3000/udhetimi/999999`.

Pritshmëria: Të shfaqet “Udhëtimi nuk u gjet” dhe lidhja për t'u kthyer te lista.

Vëzhgimi: Faqja ktheu HTTP 404 me “Udhëtimi nuk u gjet” dhe lidhjen “Kthehu te
lista”. Rezultati ishte i njëjtë në Vercel.

## Ndryshimi i hyrjes

Si hyrje të ndryshuar përdora vlerën kufitare nga kodi personal: në vend të një
ID-je ekzistuese (2) provova një ID që nuk ekziston (999999). Aplikacioni
dalloi saktë rastin pa e prishur faqen (Prova 3). Të dhënat e udhëtimeve në
databazë nuk i ndryshova; vlerat e gjeneruara (Pejë → AAB, 08:15, 1 vend; ora e
re 08:20) nuk i futa në Neon. Kodi P7-526 ishte gjeneruar fillimisht për emrin
`raba`; për pronarin e repository-t `rabagoran` kodi i saktë është P7-561.

## Ndihma nga AI

Përdora Codex për të lexuar udhëzimin, për të shqyrtuar kodin dhe për korrigjimin
e faqes së detajeve. Përdora Claude Code për të gjetur pse lidhja me Neon
dështonte vetëm lokalisht (certifikata e Avast), për deploy-in në Vercel dhe për
të përditësuar provat në këtë raport. Demonstrimin me koleg nuk e bëra.

## Versionet

Para: https://github.com/rabagoran/rideshare-mobile/commit/008f4258e9e7f88f201902ed6c3545782db28f61

Pas: https://github.com/rabagoran/rideshare-mobile/commit/5a764e7dc6774486f4b772c2d72239caae77132e

# RideShare — Java 6: PWA dhe lexim offline

**Studenti:** Goran Raba  
**Repository:** https://github.com/rabagoran/rideshare-mobile  
**Tema:** Manifest, service worker dhe lexim offline i listës publike

## Përshkrimi i punës

Aplikacioni përfshin manifestin e RideShare AAB, dy ikona PNG, endpoint-in
publik `GET /api/udhetimet`, një service worker dhe faqen `offline.html` për
leximin e listës së ruajtur. Endpoint-i ekspozon vetëm fushat publike të
udhëtimit: ID-në, nisjen, destinacionin, orën, vendtakimin dhe numrin e vendeve.
Service worker-i ruan faqen offline, ikonat dhe kopjen e përgjigjes së listës.
Faqja offline është vetëm për lexim; nuk konfirmon rezervime. Komponenti `Pwa`
regjistron service worker-in nga layout-i kryesor.

## Skedarët kryesorë

- `aplikacioni/src/app/manifest.ts` — manifesti i aplikacionit.
- `aplikacioni/src/app/api/udhetimet/route.ts` — endpoint-i publik i listës.
- `aplikacioni/public/sw.js` — ruajtja dhe leximi offline.
- `aplikacioni/public/offline.html` — pamja offline për listën.
- `aplikacioni/public/icons/` — ikonat 192×192 dhe 512×512.
- `aplikacioni/src/components/Pwa.tsx` — regjistrimi i service worker-it.
- `aplikacioni/src/app/layout.tsx` — përfshirja e komponentit PWA.

## Rezultatet e verifikimit

### Prova 1 — Manifesti, ikonat dhe service worker-i

Nisa aplikacionin me `npm run dev`. Në localhost, faqja kryesore, manifesti,
service worker-i, `offline.html` dhe të dy ikonat u përgjigjën me HTTP `200`.
Përmasat e ikonave u verifikuan si 192×192 dhe 512×512. Regjistrimi aktiv i
worker-it dhe cache-i në panelin Application të shfletuesit mbeten për t'u
verifikuar.

### Prova 2 — Leximi offline

Endpoint-i `GET /api/udhetimet` u përgjigj me HTTP `503` gjatë kontrollit lokal.
Për këtë arsye nuk u morën tri udhëtimet dhe nuk u verifikuan cache-i i listës,
rifreskimi i faqes pa internet, kartat ose koha e kopjes.

### Prova 3 — Rifreskimi i listës nga serveri

Prova nuk u krye, sepse endpoint-i nuk arriti të lexojë listën nga Neon. Ora e
udhëtimit me ID 2 nuk u ndryshua. Duhet provuar ndryshimi 08:15 → 08:25, rifreskimi
online në aplikacion, verifikimi i burimit “server” dhe rikthimi i orës në 08:15.

## Gjendja e dorëzimit

Kodi dhe raporti janë përgatitur në repository-n personal. Verifikimi teknik i
PWA-së dhe tri provat në shfletues/Neon duhet të përfundojnë para se kjo punë të
dorëzohet si e përfunduar. Në raport do të shënohen rezultatet që u panë realisht.

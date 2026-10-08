# RideShare — Java 4 · Neon dhe PostgreSQL

## Çfarë ndërtova

Lista, detajet dhe faqja e kërkesës lexojnë të dhënat nga Neon përmes funksioneve
asinkrone në `aplikacioni/src/lib/udhetimet.ts`. Lidhja me `DATABASE_URL`
mbahet në server në `aplikacioni/src/lib/db.ts`; `.env.local` nuk publikohet.

## Provat që bëra

### Prova 1: Ndryshimi në databazë shfaqet në aplikacion

Ndryshova përkohësisht orën e udhëtimit me ID 2 nga 08:15 në 08:25 në Neon.
Pas rifreskimit, lista dhe faqja e detajeve shfaqën 08:25. E ktheva orën në
08:15 dhe verifikova që të dyja faqet shfaqnin përsëri 08:15.

### Prova 2: Lista bosh dhe rikthimi

Shtova përkohësisht `WHERE false` vetëm te pyetja e listës. Aplikacioni shfaqi
“Nuk ka udhëtime për momentin.” Pasi e hoqa kushtin, u kthyen tri kartat.

### Prova 3: Lidhja mungon, rikthimi dhe siguria

E zhvendosa përkohësisht `.env.local` jashtë emrit të njohur nga Next.js dhe
rinisa serverin. Aplikacioni shfaqi “Nuk u lidhëm me databazën. Provo përsëri.”
E riktheva `.env.local`, rinisa serverin dhe tri udhëtimet u shfaqën sërish.
Skedari mbetet i përjashtuar nga Git nga `aplikacioni/.gitignore`.

## Ku gjendet puna

- Skema: `aplikacioni/schema.sql`
- Lidhja private dhe pyetjet: `aplikacioni/src/lib/db.ts`,
  `aplikacioni/src/lib/udhetimet.ts`
- Faqet e listës, detajeve dhe kërkesës janë te `aplikacioni/src/app/`.
- Repository: <https://github.com/rabagoran/rideshare-mobile>

## Çfarë mbetet për përmirësim

Kërkesa “Në pritje” mbetet simulim: nuk ruhet rezervim real dhe nuk njoftohet
shoferi.

## Ndihma nga AI

AI ndihmoi me lidhjen e faqeve me Neon, konfigurimin e mjedisit dhe kontrollet
teknike. Verifikova vetë listën, detajet, ID 99, ndryshimin e përkohshëm të orës,
listën bosh dhe sjelljen kur mungon lidhja.

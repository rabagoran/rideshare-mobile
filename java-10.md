# RideShare — Java 10

## Çfarë ndërtova

U shtua dërgimi i kërkesës në databazë dhe paneli i shoferit për përgjigjen. Ekranet marrin gjendjen nga Neon përmes Server-Sent Events, me rifreskim të gjendjes çdo 1.5 sekonda. Pranimi përditëson statusin dhe vendet në një veprim atomik në server. Lidhja e ndërprerë shfaq gjendjen e rilidhjes.

## Përgatitja e provës

- ID-ja e udhëtimit fiktiv: `1` (ndryshoje nëse përdore tjetër).
- Vendet fillestare: [PLOTËSO]
- Dy rolet dhe si i ndave sesionet: [PLOTËSO]

## Provat që bëra

### Prova 1: Kërkesa mbërrin te shoferi

- Hapat: [PLOTËSO]
- Çfarë prisja: Kërkesa e udhëtarit shfaqet te shoferi pa Refresh.
- Çfarë pa realisht shoferi dhe udhëtari, pa Refresh: [PLOTËSO PAS PROVËS]
- Ku e verifikova ruajtjen: [PLOTËSO]

### Prova 2: Pranimi përditëson të dy ekranet

- Hapat dhe vendet para/pas: [PLOTËSO]
- Përsëritja e pranimit dhe prova me 0 vende: [PLOTËSO]
- Çfarë pashë realisht te të dy përdoruesit: [PLOTËSO PAS PROVËS]

### Prova 3: Ndërprerja dhe rilidhja

- ID-ja e udhëtimit të provës, dritarja offline dhe mënyra si e provova: [PLOTËSO]
- Pamja e fundit gjatë ndërprerjes: [PLOTËSO PAS PROVËS]
- Çfarë ndryshoi pas rilidhjes: [PLOTËSO PAS PROVËS]

## Ku gjendet puna

- `aplikacioni/src/lib/kerkesa.ts`: krijimi, leximi dhe pranimi i kërkesave; ulja atomike e vendeve.
- `aplikacioni/src/app/api/realtime/route.ts`: rrjedha SSE dhe kontrolli periodik i Neon-it.
- `aplikacioni/src/components/KerkesaLive.tsx`, `ShoferiLive.tsx`, `UdhetimiLive.tsx`: ekranet që marrin përditësimet.
- `aplikacioni/schema-java10.sql`: tabela e kërkesave.
- Udhëzimi i nisjes dhe konfigurimit: `aplikacioni/README-java10.md`.

Rruga e gjendjes: Neon → `/api/realtime` → `EventSource` → komponentët live. Veprimi i pranimit: `POST /api/kerkesat/[id]/prano`.

## Prova me kolegun

[PLOTËSO PAS PROVËS: hyrja tjetër, parashikimi, vëzhgimi real dhe funksioni që e shpjegon.]

## Çfarë mbetet për përmirësim

Kontrolli periodik i Neon-it ka vonesë deri rreth 1.5 sekonda dhe bën kërkesa të përsëritura; nuk është kanal push i bazës së të dhënave. [Shto një kufizim tjetër që vërejte gjatë provës, nëse pati.]

## Ndihma nga AI

U përdor Codex për të lexuar udhëzimin, ndërtuar rrjedhën e kërkesave dhe sinkronizimin, dhe përgatitur planin e provave. Provat reale me dy llogari, ndërprerjen e rrjetit dhe kolegun duhet t'i kryej dhe t'i dokumentoj vetë.

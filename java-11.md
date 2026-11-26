# RideShare — Java 11: Njoftimet dhe angazhimi

## Çfarë shtova ndaj javës 10

Ripërdora kërkesat, përgjigjen e shoferit, sesionin GitHub dhe panelin ekzistues. Kur shoferi pranon kërkesën, vendet, statusi dhe njoftimi ruhen në një SQL statement; kur e refuzon, statusi dhe njoftimi ruhen bashkë. Njoftimi lidhet me kërkesën dhe udhëtarin nga databaza, jo nga të dhëna të lira të klientit. API-ja e njoftimeve filtron sipas përdoruesit të sesionit. Paneli tregon historinë, të palexuarit dhe toast për ID të re vetëm një herë gjatë sesionit. Hapja e njoftimit kontrollon marrësin, shfaq kërkesën e saktë dhe shënon `read_at` në server.

## Përgatitja

Nuk krijova udhëtim ose kërkesë reale, nuk përdora dy sesione GitHub dhe nuk ekzekutova migrimin në Neon. Prandaj nuk kam ID reale për raportuar. Për ta përgatitur provën: ekzekuto `aplikacioni/schema-java11.sql` në Neon pas skemës Java 10; pastaj përdor dy hyrje të ndara, një shofer dhe një udhëtar. Mos vendos të dhëna personale këtu.

### Prova 1: Rasti 1 · Përgjigjja bëhet njoftim
- Hapat dhe përgjigjja e shoferit: nuk e provova në aplikacion.
- Çfarë prisja te udhëtari: një njoftim të palexuar, për kërkesën e saktë, dhe vetëm një toast për ID-në e tij.
- ID-ja e njoftimit, numri i palexuar dhe çfarë pashë realisht: nuk u gjenerua ID; nuk u bë provë live. Build-i lokal kaloi.
- Cila kërkesë u hap dhe çfarë mbeti pas Refresh: nuk e provova.

### Prova 2: Rasti 2 · Hapja dhe shënimi si i lexuar
- ID-ja e njoftimit dhe cila kërkesë u hap realisht: nuk e provova.
- Numri i palexuar para/pas konfirmimit nga serveri: nuk e provova.
- Çfarë mbeti në histori pas kthimit te lista dhe Refresh: nuk e provova.
- Nëse provova dështimin e shënimit: Nuk e provova këtë skenar shtesë.

### Prova 3: Rasti 3 · Rilidhja pa njoftime të dyfishta
- ID-ja e kërkesës tjetër, dritarja offline dhe hapat: nuk e provova; nuk përdora dritare offline.
- Çfarë prisja pas rilidhjes dhe pas dy leximeve të tjera: i njëjti njoftim shfaqet një herë; lexime të tjera nuk shtojnë rekorde ose toast-e.
- Numri i rekordeve, ID-ja e njoftimit dhe alarmet që pashë realisht: nuk u provuan në aplikacion.

## Prova me një hyrje tjetër

Nuk e provova me hyrje tjetër. Parashikimi është që hyrja e dytë nuk mund të lexojë njoftimin e udhëtarit të parë, sepse API-ja dhe faqja kontrollojnë marrësin sipas sesionit.

## Ku gjendet kodi dhe çfarë mbetet

- `aplikacioni/schema-java11.sql`: tabela e njoftimeve me `created_at`, `read_at` dhe unikalitet për kërkesë. Duhet ekzekutuar në Neon.
- `aplikacioni/src/lib/kerkesa.ts`: ruajtja atomike e përgjigjes dhe njoftimit.
- `aplikacioni/src/lib/njoftimet.ts`: leximi i historisë dhe hapja/shënimi i lexuar me autorizim.
- `aplikacioni/src/app/api/njoftimet/route.ts`: API-ja personale e listës.
- `aplikacioni/src/components/KerkesatEUdhetaritLive.tsx`: polling, numri i palexuar, lista dhe toast.
- `aplikacioni/src/app/njoftim/[id]/page.tsx`: hapja e kërkesës së lidhur.

Build-i i prodhimit dhe ESLint për skedarët e ndryshuar kaluan. Mbeten migrimi në Neon dhe provat reale me dy llogari, përfshirë offline/online; nuk i raportoj si të kryera.

## Zgjerime opsionale

Web Push/VAPID nuk u shtua; ushtrimi bazë nuk e kërkon. Refuzimi ishte tashmë i implementuar, ndaj tani edhe ai krijon njoftim.

## Ndihma nga AI (Artificial Intelligence — inteligjencë artificiale)

Përdora AI për të analizuar ushtrimin, implementuar ndryshimet dhe përgatitur këtë raport. Verifikova kodin me build dhe ESLint për skedarët e ndryshuar. Provat manuale në Neon dhe me llogari reale nuk i kreva.

## Pas dorëzimit të parë — përditëso më vonë

Ky është dorëzimi i parë. Pas feedback-ut, shto linkun e Issue-t, commit-in e kontrolluar dhe korrigjimet e bëra.

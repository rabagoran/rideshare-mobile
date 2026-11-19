# RideShare - Java 10

## Cfare ndertova

Shtova dergimin e kerkeses ne databaze dhe panelin e shoferit per pergjigjen. Ekranet marrin gjendjen nga Neon permes Server-Sent Events (SSE), me kontroll te gjendjes cdo 1.5 sekonda. Pranimi perditeson statusin dhe vendet ne nje veprim atomik ne server. Kur lidhja nderpritet, ekrani tregon se po rilidhet.

## Pergatitja e proves

- Udhetimi i planifikuar per prove: ID `1`.
- Vendet: nuk i kam lexuar ende nga databaza ime Neon. Skema fillestare e projektit ka 2 vende per udhetimin 1; udhezimi i konfigurimit i vendos ne 1 per proven e pranimit.
- Rolet: plani eshte te perdor nje llogari GitHub udhetar dhe nje shofer. Duhet t'i caktoj rolet sipas `aplikacioni/README-java10.md` dhe t'i hap ne dy profile/dritare te ndara te shfletuesit.
- Statusi: konfigurimi dhe prova me dy sesione ende nuk jane kryer.

## Provat dhe rezultatet

### Prova 1: Kerkesa mberrin te shoferi

- Hapat: ende nuk e kam ekzekutuar proven me dy llogari. Hapi i planifikuar eshte qe udhetari te hape udhetimin 1, te dergoje kerkesen, ndersa shoferi e mban hapur `/panel`.
- Cfare prisja: kerkesa te shfaqet te shoferi pa rifreskim manual; udhetari te shohe statusin "ne pritje".
- Cfare ndodhi realisht: nuk eshte provuar ende me llogari GitHub dhe Neon, prandaj nuk po pretendoj rezultat real.
- Verifikimi ne databaze: nuk e kam kryer ende. Pas proves mund te perdor ne Neon `SELECT id, udhetim_id, udhetar_id, emri, status FROM kerkesat ORDER BY id DESC;`.

### Prova 2: Pranimi perditeson te dy ekranet

- Hapat dhe vendet para/pas: ende nuk jane ekzekutuar. Plani eshte te nis me 1 vend, te pranoj kerkesen nga paneli i shoferit dhe te krahasoj vleren para/pas ne te dy ekranet.
- Perseritja dhe prova me 0 vende: ende nuk jane provuar ne Neon. Kodi duhet te mos e ule numrin perseri per nje pranim te perseritur dhe duhet ta bllokoje pranimin kur vendet jane zero.
- Cfare pashe realisht: nuk eshte provuar ende me dy perdorues; rezultati real duhet te shenohet pas proves.

### Prova 3: Nderprerja dhe rilidhja

- Udhetimi, dritarja offline dhe menyra e proves: ende nuk e kam kryer. Plani eshte te perdor udhetimin 1, te nderpres perkohesisht rrjetin ne dritaren e udhetarit dhe pastaj ta rikthej.
- Pamja gjate nderprerjes: nuk eshte vezhguar ende. Sjellja e pritur nga UI eshte mesazhi "Lidhja u nderpre. Po rilidhemi...".
- Pas rilidhjes: nuk eshte vezhguar ende. Prova duhet te konfirmoje qe EventSource lidhet perseri dhe merr gjendjen e fundit nga Neon.

## Ku gjendet puna

- `aplikacioni/src/lib/kerkesa.ts`: krijimi, leximi dhe pranimi i kerkesave; pranimi ul vendet ne databaze.
- `aplikacioni/src/app/api/realtime/route.ts`: rrjedha SSE dhe kontrolli periodik i Neon-it.
- `aplikacioni/src/components/KerkesaLive.tsx`, `ShoferiLive.tsx`, `UdhetimiLive.tsx`: ekranet qe marrin perditesimet live.
- `aplikacioni/schema-java10.sql`: skema e tabeles se kerkesave.
- `aplikacioni/README-java10.md`: udhezimi per migrimin dhe pergatitjen e dy llogarive.
- Rruga e gjendjes: Neon -> `/api/realtime` -> `EventSource` -> komponentet live.
- Veprimi i pranimit: `POST /api/kerkesat/[id]/prano`.
- Verifikimi teknik i kodit: TypeScript, ESLint per skedaret e prekur dhe `npm run build` kaluan. Keto kontrolle nuk zevendesojne proven live me Neon.

## Prova me kolegun

Nuk e kam kryer ende proven me koleg. Parashikimi im eshte qe kur udhetari dergon kerkese, shoferi do ta shohe pa Refresh dhe, pas pranimit, te dy do ta shohin statusin e ri dhe nje vend me pak. Nuk kam vezhgim real nga nje hyrje tjeter per ta krahasuar me parashikimin. Pas proves duhet te shenoj hyrjen testuese, veprimin, rezultatin dhe funksionin qe e shpjegon: `pranoKerkese` ne `aplikacioni/src/lib/kerkesa.ts`.

## Cfare mbetet per permiresim

Sinkronizimi kontrollon Neon-in cdo 1.5 sekonda, ndaj ndryshimi mund te kete vonese te shkurter dhe secili ekran ben kerkesa periodike. Mbetet te ekzekutoj migrimin ne Neon, te provoj rrjedhen me dy llogari dhe rrjet offline/online, si dhe te shenoj rezultatet reale te seciles prove.

## Ndihma nga AI

Perdora Codex per te lexuar udhezimin e Java 10, implementuar rrjedhen e kerkesave dhe sinkronizimin, kontrolluar tipat/lint/build dhe pergatitur kete raport. Nuk i kam kryer ende provat live me dy llogari, Neon, nderprerje rrjeti ose koleg; do t'i provoj dhe do t'i dokumentoj para se t'i shenoj si te kaluara.

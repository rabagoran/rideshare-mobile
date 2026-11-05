# RideShare — Java 8: Vendtakimi

## Përmbledhja

Te detajet e udhëtimit shtova një zgjedhje lokale të vendtakimit. Arta mund ta shkruajë vendin dhe ta konfirmojë, ose të kërkojë pozicionin e telefonit me klikim. Pozicioni shfaqet si koordinatë cilësie (saktësi në metra); nuk kthehet vetvetiu në emër vendi. Zgjedhja nuk dërgohet te shoferi dhe nuk ruhet pas rifreskimit.

## Skedarët

- `aplikacioni/src/components/Vendtakimi.tsx` — komponent klienti me shkrim manual, konfirmim, kërkesë geolocation, pritje dhe mesazhe gabimi.
- `aplikacioni/src/app/udhetimi/[id]/page.tsx` — përfshin komponentin te detajet; ngarkimi i udhëtimit në server mbetet i pandryshuar.
- `aplikacioni/src/app/java-08-test/page.tsx` — faqe prove pa databazë, me udhëtim fiktiv dhe të njëjtin komponent.
- `aplikacioni/src/app/globals.css` — paraqitja dhe gjendjet e fokusit të kontrolleve.
- `mobile-week08.json` — rruga, komponenti, identifikuesit dhe rastet e provës.

## Sjelljet e zbatuara

- Teksti në fushë dhe vendtakimi i konfirmuar janë gjendje të ndara. `trim()` heq hapësirat; fusha bosh nuk e zëvendëson zgjedhjen e mëparshme.
- Geolocation nis vetëm nga butoni. Faqja nuk kërkon leje gjatë hapjes.
- Suksesi mbyll pritjen dhe tregon saktësinë në metra. Refuzimi (`code 1`), mungesa e pozicionit (`code 2`) dhe timeout-i (`code 3`) mbyllin pritjen dhe lënë zgjedhjen manuale të përdorshme.
- Kur API mungon, shfaqet mesazh dhe fusha manuale mbetet aktive.
- Gjendja është lokale në komponent. Rifreskimi e humb; shoferi nuk merr vendtakim në këtë version.

## Provat

Rastet e mëposhtme janë kontrollet e synuara për faqen `/java-08-test`. Nuk kam përdorur pajisje reale dhe nuk pretendoj se kam dhënë leje GPS ose testuar vendndodhjen fizike.

### Prova 1 — Konfirmim manual

Hapat: Hap `/java-08-test`, shkruaj `Biblioteka` dhe konfirmo. Pastaj shkruaj `Parkingu` pa e konfirmuar.

Pritshmëria: Konfirmohet `Biblioteka`; pas shkrimit të dytë, vendtakimi i konfirmuar mbetet `Biblioteka`. Vlera vetëm me hapësira nuk pranohet.

Vëzhgimi: Logjika e komponentit ruan veçmas fushën dhe konfirmimin, dhe refuzon tekstin bosh pas `trim()`. Prova ndërvepruese në shfletues nuk u krye në këtë sesion.

## Prova me një hyrje të re

Hyrja që provova: Konfirmova fillimisht `Biblioteka`, pastaj shkrova `Parkingu` pa shtypur përsëri butonin e konfirmimit.

Parashikimi im para klikimit: Vendtakimi i konfirmuar do të mbetet `Biblioteka`, ndërsa fusha do të tregojë `Parkingu`.

Çfarë pashë realisht: Prova e funksionimit e GitHub Actions për versionin `5c87bbf` kaloi sjelljen “Ndryshimi pa konfirmim” si pjesë e rezultatit 8/8. Pas shkrimit të `Parkingu` pa konfirmim të dytë, vendtakimi i konfirmuar mbeti `Biblioteka`, ndërsa fusha mbajti `Parkingu`. Raporti i provës: https://github.com/arbenl/arbenl-mobile-assignments-2026-2027/actions/runs/42058525648.

Skedari dhe funksioni që e shpjegojnë: `aplikacioni/src/components/Vendtakimi.tsx` — `onChange` i fushës dhe funksioni `konfirmo`.

Çfarë kuptova ose korrigjova: Teksti i shkruar dhe vendtakimi i konfirmuar ruhen ndaras. Ndryshimi i fushës nuk e konfirmon vetvetiu vendin e ri.

### Prova 2 — Leja refuzohet

Hapat: Në një shfletues me HTTPS ose localhost, blloko lejen e vendndodhjes dhe kliko `Përdor vendndodhjen time`; pastaj shkruaj `Parkingu` dhe konfirmo.

Pritshmëria: Shfaqet `Leja u refuzua. Shkruaj vendtakimin vetë.`; pritja mbaron dhe konfirmimi manual funksionon.

Vëzhgimi: Kodi për `error.code === 1` e shfaq këtë mesazh dhe e mbyll pritjen. Leja reale nuk u provua në pajisje/shfletues në këtë sesion.

### Prova 3 — Pa rezultat / timeout

Hapat: Simulo `error.code === 3` në testin e shfletuesit, ose prit timeout-in real; pastaj provo sërish dhe konfirmo `Biblioteka`.

Pritshmëria: Shfaqet `Koha mbaroi...`, pritja mbaron, butoni mund të përdoret sërish dhe konfirmimi manual funksionon.

Vëzhgimi: Dega `error.code === 3` e zbaton këtë sjellje. Simulimi ose timeout-i real nuk u ekzekutua në këtë sesion.

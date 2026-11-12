# RideShare — Java 9: Udhëtimet e preferuara

## Çfarë ndërtohet

Udhëtari i kyçur me GitHub mund ta ruajë udhëtimin te të preferuarat. Ylli dhe numri përditësohen menjëherë, pastaj serveri e shkruan preferimin në Neon. Gjendja fillestare lexohet nga databaza, prandaj preferimi shfaqet edhe pas rifreskimit dhe lidhet me llogarinë e përdoruesit. Preferimi është personal dhe nuk krijon rezervim.

## Si funksionon

1. Faqja lexon sesionin dhe preferimet e përdoruesit nga Neon.
2. Komponenti `Preferimi` shfaq yllin, numrin e preferimeve të përdoruesit dhe statusin.
3. Pas klikimit, komponenti tregon menjëherë gjendjen “Po ruhet…” dhe bllokon klikimet e tjera.
4. Server Action verifikon hyrjen, pastaj ruan ID-në e përdoruesit dhe ID-në e udhëtimit.
5. Çelësi unik i databazës e bën ruajtjen të sigurt ndaj klikimeve të përsëritura. Në sukses shfaqet konfirmimi; në gabim ylli dhe numri kthehen në gjendjen fillestare.

Për provën e refuzimit, vendos `SIMULO_GABIM_PREFERIMI=1` në `.env.local` dhe rinise serverin e zhvillimit. Simulimi kthehet para shkrimit në databazë. Largoje ose vendose në `0` për provën e suksesit. Mos e aktivizo në mjedisin publik.

## Skedarët

- `aplikacioni/src/lib/preferimet.ts` — leximi i preferimeve dhe shkrimi idempotent në Neon.
- `aplikacioni/src/app/preferimet-actions.ts` — Server Action që thërret shkrimin në server.
- `aplikacioni/src/components/Preferimi.tsx` — ylli, numri, pritja, suksesi dhe rikthimi pas gabimit.
- `aplikacioni/src/app/page.tsx` dhe `aplikacioni/src/app/udhetimi/[id]/page.tsx` — lexojnë gjendjen fillestare për përdoruesin e kyçur.
- `aplikacioni/src/components/KartaUdhetimi.tsx` dhe `aplikacioni/src/app/globals.css` — vendosja dhe paraqitja e kontrollit.
- `aplikacioni/schema-java09.sql` — tabela dhe kufizimi unik i çiftit përdorues–udhëtim.

## SQL dhe provat

Ekzekuto `aplikacioni/schema-java09.sql` në Neon SQL Editor pasi databaza të ketë tabelat `udhetimet` dhe `profilet` nga javët e mëparshme.

Provat që duhen bërë në aplikacion:

1. **Suksesi dhe rifreskimi:** hyr me GitHub, ruaj një udhëtim, prit konfirmimin dhe rifresko faqen. Ylli duhet të mbetet i mbushur.
2. **Gabimi:** aktivizo simulimin në `.env.local`, provo një udhëtim të paruajtur dhe prit përfundimin. Ylli/numri duhet të kthehen dhe të shfaqet “Nuk u ruajt. Provo përsëri.” Pastaj çaktivizo simulimin dhe provo sërish.
3. **Përsëritja:** kliko disa herë gjatë pritjes dhe kontrollo në Neon që për çiftin tënd përdorues–udhëtim ka vetëm një rresht.

Kontrolli real me llogari GitHub dhe Neon nuk u krye këtu. Mos i shëno provat si të kaluara pa i ekzekutuar. Nuk u shtuan teste automatike.

## Kufizime

Kërkohet konfigurimi ekzistues i hyrjes GitHub dhe `DATABASE_URL` në Neon. Java 9 shton ruajtjen; heqja e preferimit mbetet zgjerim opsional.

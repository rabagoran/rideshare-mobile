# RideShare — Java 10: kërkesat për udhëtim

## Çfarë implementova

Shoferi mund të zgjedhë rolin e vet në panel dhe të publikojë udhëtime që lidhen me llogarinë e tij GitHub. Udhëtari mund t’i shohë udhëtimet e reja, të dërgojë kërkesë dhe ta përcjellë statusin në panelin e vet. Shoferi mund ta pranojë ose refuzojë kërkesën. Pranimi e ul numrin e vendeve vetëm një herë; refuzimi nuk i ndryshon vendet. Ndryshimet përcillen nga Neon përmes SSE, me rifreskim automatik kur lidhja rikthehet.

## Konfigurimi dhe të dhënat

- Skema `aplikacioni/schema-java10.sql` u ekzekutua në Neon. U verifikua se tabela `kerkesat` ekziston pas migrimit.
- API-ja publike e udhëtimeve në Vercel u përgjigj me HTTP 200 dhe ktheu udhëtimet me ID `1`, `2` dhe `3`; në atë kontroll kishin përkatësisht 2, 1 dhe 0 vende.
- API-ja e ofruesve të autentikimit në Vercel u përgjigj me HTTP 200 dhe përfshinte GitHub.
- Vercel e ndërtoi commit-in `28f651d` me status `Ready`.

## Provat dhe rezultatet

### 1. Lista e udhëtimeve dhe krijimi i udhëtimit

- Kontrollova `/api/udhetimet` në Vercel: u përgjigj me HTTP 200 dhe ktheu të dhënat e udhëtimeve nga databaza.
- Kontrollova build-in e prodhimit: `npm run build` përfundoi me sukses, përfshirë kontrollin TypeScript dhe gjenerimin e faqeve.
- Kodi i formularit të shoferit ruan pronarin e udhëtimit me ID-në e llogarisë GitHub. Lista publike kontrollohet automatikisht çdo 4 sekonda.
- Nuk e regjistrova këtu krijimin e një udhëtimi duke klikuar me llogari të autentikuar; ai hap duhet provuar në shfletues me llogarinë e shoferit.

### 2. Kërkesa, pranimi dhe refuzimi

- Migrimi krijoi tabelën `kerkesat` në Neon. Krijimi i kërkesës ruan udhëtarin, udhëtimin dhe statusin fillestar `ne_pritje`.
- Kodi i shoferit kontrollon pronësinë e udhëtimit para pranimit/refuzimit. Pranimi përditëson statusin dhe ul vendet në të njëjtin veprim të databazës; refuzimi ndryshon vetëm statusin.
- Udhëtari sheh kërkesat dhe përgjigjet e veta te paneli. Shoferi sheh kërkesat vetëm për udhëtimet e veta.
- Nuk kam kryer një provë të plotë duke dërguar dhe aprovuar kërkesë në dy sesione GitHub. Prandaj statuset e shfaqura në të dy shfletuesit duhen konfirmuar me provën manuale më poshtë.

### 3. Ndërprerja dhe rilidhja

- Komponentët përdorin `EventSource`; shfletuesi rilidhet automatikisht kur rrjeti kthehet.
- Ekrani shfaq gjendjen e lidhjes dhe merr sërish gjendjen aktuale nga Neon pas rilidhjes.
- Nuk e ndërpreva realisht rrjetin gjatë një sesioni të autentikuar, ndaj sjelljen offline/online nuk e shënova si të testuar.

## Prova manuale me dy llogari

1. Hape linkun e Vercel në dy profile të ndara të shfletuesit.
2. Hyr në profilin e parë me GitHub, shko te `/panel`, zgjidh rolin **Shofer** dhe krijo një udhëtim.
3. Hyr në profilin e dytë me llogari tjetër GitHub, zgjidh rolin **Udhëtar** dhe hape udhëtimin e sapokrijuar.
4. Dërgo kërkesën. Kontrollo që shoferi e sheh si **në pritje** dhe udhëtari e sheh të njëjtin status në panel.
5. Pranoje kërkesën nga shoferi. Kontrollo që udhëtari sheh **pranuar** dhe numri i vendeve ulet me një. Provo edhe refuzimin me kërkesë tjetër.
6. Ndërprite përkohësisht internetin në njërin profil dhe riktheje; vëzhgo mesazhin e rilidhjes dhe statusin pas rikthimit.

## Skedarët kryesorë

- `aplikacioni/src/lib/udhetimet.ts`: publikimi dhe leximi i udhëtimeve.
- `aplikacioni/src/lib/kerkesa.ts`: krijimi, autorizimi, pranimi, refuzimi dhe leximi i kërkesave.
- `aplikacioni/src/app/api/realtime/route.ts`: përditësimet SSE.
- `aplikacioni/src/components/KerkesaLive.tsx` dhe `ShoferiLive.tsx`: statuset live për udhëtarin dhe shoferin.
- `aplikacioni/src/components/KerkesatEUdhetaritLive.tsx`: lista e kërkesave në panelin e udhëtarit.
- `aplikacioni/schema-java10.sql`: migrimi i tabelave dhe indekseve.

## Çfarë mësova dhe çfarë mbetet

Kërkesat dhe vendet duhet të përditësohen në databazë nga serveri, që dy llogari të shohin të njëjtën gjendje dhe një vend të mos rezervohet dy herë. SSE e bën përditësimin të duket pa rifreskim manual. Verifikimi teknik dhe endpoint-et publike kaluan, por kjo nuk e zëvendëson provën manuale me dy llogari GitHub dhe testin offline/online.

# RideShare · Java 10: kërkesat në kohë reale

## Përgatitja

1. Në Neon SQL Editor ekzekuto `schema-java10.sql`. Kërkohen tabelat `udhetimet` dhe `profilet` nga javët e mëparshme.
2. Nise aplikacionin me `npm run dev -- --port 3001` ose hape lidhjen Production në Vercel.
3. Hyr me llogarinë tënde GitHub, hap `/panel` dhe zgjidh rolin. Shoqja mund të hyjë me llogarinë e saj GitHub dhe të zgjedhë rolin shofer.
4. Shoferi krijon udhëtimin te paneli; ai shfaqet në listën publike. Udhëtari e hap dhe dërgon kërkesën. Shoferi mund ta pranojë ose refuzojë; udhëtarit i shfaqet përgjigjja te paneli i vet.
5. Për provë me dy përdorues, përdorni dy profile ose dritare të ndara të shfletuesit që cookies të mos mbivendosen.

Për Vercel, projekti duhet të ketë `DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET` dhe `NEXTAUTH_URL` në Production. `NEXTAUTH_URL` duhet të jetë domeni publik i Vercel. Te GitHub OAuth App, callback URL duhet të jetë `https://<domeni-vercel>/api/auth/callback/github`.

## Si punon sinkronizimi

Neon-i i këtij projekti nuk ka kanal të drejtpërdrejtë për Realtime. Route Handler-i `/api/realtime` dërgon ngjarje Server-Sent Events (SSE) dhe kontrollon gjendjen e autorizuar në Neon çdo 1.5 sekonda. `EventSource` rilidhet vetë pas ndërprerjes; ekrani tregon “Po rilidhemi…” dhe merr gjendjen aktuale kur lidhja rikthehet. Lista publike kontrollohet çdo 4 sekonda për udhëtime të reja ose vende të ndryshuara.

Kërkesa ruhet në tabelën `kerkesat`. Pranimi kontrollon pronarin e udhëtimit dhe statusin në server, i ul vendet me një SQL atomik dhe e kalon kërkesën në `pranuar`. Refuzimi e kalon kërkesën në `refuzuar` pa ndryshuar vendet. Pranimi i përsëritur ose pranimi kur vendet janë zero nuk i ul vendet përsëri.

## Provat që duhet t'i regjistrosh te `../java-10.md`

- Hyr me dy llogari GitHub; cakto rolet te `/panel`. Shoferi krijon udhëtim; udhëtari duhet ta shohë pa rifreskim manual.
- Hape udhëtimin me llogarinë e udhëtarit dhe panelin në dritaren e shoferit. Dërgo kërkesë dhe shëno çfarë u shfaq pa Refresh.
- Pranoje nga shoferi. Kontrollo që statusi dhe vendet të përditësohen në të dy ekranet; provo sërish pranimin dhe rastin me zero vende.
- Provo edhe refuzimin dhe kontrollo statusin te paneli i udhëtarit.
- Në njërën dritare ndërprit internetin për pak, shëno mesazhin e rilidhjes dhe vëzhgo rikthimin e gjendjes pas aktivizimit të internetit.
- Shëno rezultatet reale, edhe nëse një hap dështon. Mos plotëso vëzhgime që nuk i ke provuar.

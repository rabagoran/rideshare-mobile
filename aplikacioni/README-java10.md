# RideShare · Java 10: sinkronizimi në kohë reale

## Përgatitja

1. Në Neon SQL Editor ekzekuto `schema-java10.sql`. Kërkohen tabelat `udhetimet` dhe `profilet` nga javët e mëparshme.
2. Nise aplikacionin me `npm run dev -- --port 3001` dhe hyr me dy llogari GitHub të veçanta.
3. Te `/panel`, kopjo ID-në GitHub të secilës llogari. Në Neon cakto njërën si shofer i udhëtimit testues dhe tjetrën si udhëtar. Përdor vetëm vlera fiktive:

```sql
UPDATE profilet SET roli = 'shofer' WHERE github_id = 'ID_E_SHOFERIT';
UPDATE profilet SET roli = 'udhetar' WHERE github_id = 'ID_E_UDHETARIT';
UPDATE udhetimet SET shofer_id = 'ID_E_SHOFERIT', vende = 1 WHERE id = '1';
```

4. Për ekranet e ndara përdor dritare private/profil tjetër të shfletuesit, sepse sesioni i GitHub ruhet në cookie. Llogaria e shoferit hap `/panel`; udhëtari hap detajet e udhëtimit `1`.

## Si punon sinkronizimi

Neon-i i këtij projekti nuk ka kanal të drejtpërdrejtë për Realtime. Route Handler-i `/api/realtime` dërgon ngjarje Server-Sent Events (SSE) dhe kontrollon gjendjen e autorizuar në Neon çdo 1.5 sekonda. `EventSource` rilidhet vetë pas ndërprerjes; ekrani tregon “Po rilidhemi…” dhe merr gjendjen aktuale kur lidhja rikthehet.

Kërkesa ruhet në tabelën `kerkesat`. Pranimi kontrollon pronarin e udhëtimit dhe statusin në server, i ul vendet me një SQL atomik dhe e kalon kërkesën në `pranuar`. Pranimi i përsëritur ose pranimi kur vendet janë zero nuk i ul vendet përsëri.

## Provat që duhet t'i regjistrosh te `../java-10.md`

- Hape udhëtimin me një llogari udhëtari dhe panelin në dritaren e shoferit. Dërgo kërkesë dhe shëno çfarë u shfaq pa Refresh.
- Pranoje nga shoferi. Kontrollo që statusi dhe vendet të përditësohen në të dy ekranet; provo sërish pranimin dhe rastin me zero vende.
- Në njërën dritare ndërprit internetin për pak, shëno mesazhin e rilidhjes dhe vëzhgo rikthimin e gjendjes pas aktivizimit të internetit.
- Shëno rezultatet reale, edhe nëse një hap dështon. Mos plotëso vëzhgime që nuk i ke provuar.

# RideShare — Java 5 · Hyrja dhe lejet

## Çfarë ndërtova

GitHub OAuth vërteton identitetin dhe NextAuth e ruan atë në sesion. Roli (`udhetar` ose `shofer`) lexohet nga tabela `profilet` në Neon, ndërsa pronësia e udhëtimit ruhet te `udhetimet.shofer_id`. Veprimi në server kontrollon rolin dhe pronësinë nga databaza para se të ndryshojë orën; formulari nuk mund ta caktojë vetë pronarin.

## Provat që bëra

### Prova 1: Hyrja, rifreskimi dhe dalja

Hapa `/panel` pa hyrë dhe pashë udhëzimin për hyrje. Hyra me GitHub; paneli shfaqi emrin dhe rolin `udhetar`. Pas rifreskimit, hyrja dhe profili mbetën. Kur dola, paneli kërkoi hyrje përsëri.

### Prova 2: Shoferi ndryshon udhëtimin e vet

Si shofer i ID 2, e ndryshova orën në `08:25`. Paneli tregoi sukses, dhe ora e re u shfaq te lista, detajet dhe në Neon SQL Editor. Pastaj e riktheva në `08:15` dhe e verifikova përsëri.

### Prova 3: Veprimi pa leje refuzohet

Ndryshova përkohësisht ID-në e formularit nga `2` në `1` dhe provova ta ruaj orën. Aplikacioni shfaqi “Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.” Në Neon verifikova se ID 1 mbeti në `08:00`; ID 2 u rikthye në `08:15`.

## Ku gjendet puna

Repository: <https://github.com/rabagoran/rideshare-mobile>

- Skema e Java 5: `aplikacioni/schema-java05.sql`
- Hyrja GitHub dhe callback: `aplikacioni/src/lib/auth.ts`, `aplikacioni/src/app/api/auth/[...nextauth]/route.ts`
- Kontrolli i rolit dhe pronësisë: `aplikacioni/src/lib/lejet.ts`
- Veprimi dhe paneli: `aplikacioni/src/app/panel/`
- Butoni i hyrjes: `aplikacioni/src/components/Hyrja.tsx`

## Çfarë mbetet për përmirësim

Kërkesa për vend mbetet simulim dhe nuk ruan rezervim real. Hapi tjetër do të ishte ruajtja e kërkesës në databazë dhe njoftimi i shoferit.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

ChatGPT ndihmoi me kodin e hyrjes, kontrollin e lejeve dhe diagnostikimin e konfigurimit. Hyrjen me GitHub dhe provat e ndryshimit/refuzimit i verifikova në aplikacion dhe në Neon.

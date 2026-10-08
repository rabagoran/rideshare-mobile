# Java 3 – RideShare


Në këtë javë është vazhduar zhvillimi i aplikacionit **RideShare** duke krijuar strukturën bazë të aplikacionit me Next.js dhe TypeScript.

Projekti ndodhet në folderin:

`aplikacioni/`

Aplikacioni përmban faqet kryesore të RideShare dhe komponentë të ndarë për paraqitjen e udhëtimeve.

## Teknologjitë

* Next.js
* React
* TypeScript
* CSS
* App Router

## Faqet e RideShare

### 1. Faqja kryesore

Faqja kryesore e aplikacionit ndodhet te:

`aplikacioni/src/app/page.tsx`

Kjo faqe shërben si faqja kryesore e RideShare dhe paraqet udhëtimet e disponueshme.

### 2. Faqja e detajeve të udhëtimit

Faqja e detajeve ndodhet te:

`aplikacioni/src/app/udhetimi/[id]/page.tsx`

Kjo faqe përdor parametrin dinamik `[id]` për të paraqitur informacionin për një udhëtim të caktuar.

Gjithashtu ekziston faqja:

`aplikacioni/src/app/udhetimi/[id]/not-found.tsx`

e cila përdoret kur udhëtimi i kërkuar nuk gjendet.

### 3. Faqja për kërkesën për udhëtim

Faqja e kërkesës ndodhet te:

`aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`

Kjo faqe lidhet me një udhëtim specifik dhe paraqet ndërfaqen për dërgimin e kërkesës për udhëtim.

## Komponenti i RideShare

Është krijuar komponenti:

`aplikacioni/src/components/KartaUdhetimi.tsx`

Komponenti **KartaUdhetimi** përdoret për paraqitjen e informacionit të një udhëtimi në formë karte.

Përdorimi i komponentit ndihmon në organizimin dhe ripërdorimin e kodit të ndërfaqes.

## Të dhënat e udhëtimeve

Të dhënat bazë për udhëtimet ruhen te:

`aplikacioni/src/lib/udhetimet.ts`

Ky file përmban të dhënat që përdoren nga faqet e RideShare për paraqitjen e udhëtimeve.

## Prova 1 – Struktura e projektit

**Hapat:** Hap folderin `aplikacioni/src/app/` dhe kontrollo faqen kryesore, faqen dinamike të udhëtimit, faqen e kërkesës dhe faqen `not-found`; kontrollo gjithashtu `src/components/` dhe `src/lib/`.

**Rezultati real:** U verifikuan faqet `page.tsx`, `udhetimi/[id]/page.tsx`, `udhetimi/[id]/kerkesa/page.tsx` dhe `udhetimi/[id]/not-found.tsx`, si edhe komponenti `src/components/KartaUdhetimi.tsx` dhe të dhënat `src/lib/udhetimet.ts`.

## Prova 2 – Faqet e RideShare

**Hapat:** Hap faqen kryesore dhe ndiq lidhjet e udhëtimeve te faqja dinamike e detajeve dhe te faqja e kërkesës; kontrollo rrugët përkatëse nën `src/app/udhetimi/[id]/`.

**Rezultati real:** `npm run build` përfundoi me sukses, kontrolli TypeScript kaloi dhe Next.js gjeneroi faqet kryesore, të detajeve dhe të kërkesës; ekziston edhe faqja `not-found.tsx` për udhëtime që nuk gjenden.

## Prova 3 – Komponenti i ripërdorshëm

**Hapat:** Kontrollo `src/components/KartaUdhetimi.tsx` dhe importin në `src/app/page.tsx`; komponenti merr një objekt të tipizuar `Udhetim` dhe përdoret gjatë paraqitjes së listës së udhëtimeve.

**Rezultati real:** Komponenti paraqet nisjen, destinacionin, orën dhe vendet e lira, si dhe lidhjen për detajet e udhëtimit; importi përdor tani shtegun e saktë `@/components/KartaUdhetimi`.

## Përfundim

Në Java 3 është vazhduar implementimi i projektit RideShare me Next.js dhe TypeScript.

Janë krijuar faqja kryesore, faqja e detajeve të udhëtimit, faqja e kërkesës për udhëtim dhe komponenti `KartaUdhetimi`.

Kodi i aplikacionit ndodhet në folderin `aplikacioni/`, ndërsa ky raport ndodhet në root të repository-t si `java-03.md`.

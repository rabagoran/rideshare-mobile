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

`aplikacioni/src/commponents/KartaUdhetimi.tsx`

Komponenti **KartaUdhetimi** përdoret për paraqitjen e informacionit të një udhëtimi në formë karte.

Përdorimi i komponentit ndihmon në organizimin dhe ripërdorimin e kodit të ndërfaqes.

## Të dhënat e udhëtimeve

Të dhënat bazë për udhëtimet ruhen te:

`aplikacioni/src/lib/udhetimet.ts`

Ky file përmban të dhënat që përdoren nga faqet e RideShare për paraqitjen e udhëtimeve.

## Prova 1 – Struktura e projektit

Prova e parë është struktura e projektit Next.js në folderin `aplikacioni/`.

Në projekt janë të pranishme:

* `src/app/page.tsx`
* `src/app/udhetimi/[id]/page.tsx`
* `src/app/udhetimi/[id]/kerkesa/page.tsx`
* `src/app/udhetimi/[id]/not-found.tsx`
* `src/commponents/KartaUdhetimi.tsx`
* `src/lib/udhetimet.ts`

Kjo dëshmon krijimin e strukturës bazë të aplikacionit RideShare.

## Prova 2 – Faqet e RideShare

Prova e dytë është krijimi i tri faqeve kryesore:

1. Faqja kryesore e RideShare.
2. Faqja e detajeve të një udhëtimi.
3. Faqja për kërkesën për një udhëtim.

Faqet janë të organizuara sipas strukturës së Next.js App Router.

## Prova 3 – Komponenti i ripërdorshëm

Prova e tretë është komponenti:

`KartaUdhetimi.tsx`

Ky komponent përdoret për paraqitjen e një udhëtimi dhe ndihmon që pjesët e ndërfaqes të jenë të organizuara dhe të ripërdorshme.

## Përfundim

Në Java 3 është vazhduar implementimi i projektit RideShare me Next.js dhe TypeScript.

Janë krijuar faqja kryesore, faqja e detajeve të udhëtimit, faqja e kërkesës për udhëtim dhe komponenti `KartaUdhetimi`.

Kodi i aplikacionit ndodhet në folderin `aplikacioni/`, ndërsa ky raport ndodhet në root të repository-t si `java-03.md`.

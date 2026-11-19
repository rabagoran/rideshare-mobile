"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function RifreskoUdhetimet({ gjendjaFillestare }: { gjendjaFillestare: string }) {
  const router = useRouter();
  const gjendja = useRef(gjendjaFillestare);

  useEffect(() => {
    gjendja.current = gjendjaFillestare;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch("/api/udhetimet", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as { trips: { id: string; vende: number; ora: string }[] };
        const signature = JSON.stringify(data.trips.map(({ id, vende, ora }) => [id, vende, ora]));
        if (signature !== gjendja.current) {
          gjendja.current = signature;
          router.refresh();
        }
      } catch {
        // A later poll retries when the connection returns.
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, [gjendjaFillestare, router]);

  return null;
}

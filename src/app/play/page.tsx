"use client"
import { Suspense } from "react";
import Game from "@/components/game"

export default function Page() {
    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <Game />
      </Suspense>
    );
  }
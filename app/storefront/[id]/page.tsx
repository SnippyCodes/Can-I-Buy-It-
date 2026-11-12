"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ProductPageV2 } from "@/src/v2/storefront/ProductPageV2";
import { DEFAULT_PERSONA_ID, personas } from "@/src/guardian/evaluate";

const PERSONA_KEY = "guardian.persona";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = typeof params?.id === "string" ? params.id : "";
  const [personaId, setPersonaId] = React.useState<string>(DEFAULT_PERSONA_ID);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(PERSONA_KEY);
      if (saved && personas.some((p) => p.id === saved)) {
        setPersonaId(saved);
      }
    }
  }, []);

  const handlePersonaChange = React.useCallback((id: string) => {
    setPersonaId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PERSONA_KEY, id);
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <ProductPageV2
        productId={productId}
        personaId={personaId}
        onPersonaChange={handlePersonaChange}
      />
    </main>
  );
}


"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { StorefrontV2 } from "@/src/v2/storefront/StorefrontV2";
import { ProductPageV2 } from "@/src/v2/storefront/ProductPageV2";
import { DEFAULT_PERSONA_ID, personas } from "@/src/guardian/evaluate";

const PERSONA_KEY = "guardian.persona";

function StorefrontContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
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

  if (productId) {
    return (
      <ProductPageV2
        productId={productId}
        personaId={personaId}
        onPersonaChange={handlePersonaChange}
      />
    );
  }

  return <StorefrontV2 personaId={personaId} onPersonaChange={handlePersonaChange} />;
}

export default function StorefrontPage() {
  return (
    <main className="min-h-screen w-full bg-zinc-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <React.Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
        <StorefrontContent />
      </React.Suspense>
    </main>
  );
}

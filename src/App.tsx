import { useEffect, useState } from "react";
import { CopilotPage } from "./copilot/CopilotPage";
import { DEFAULT_PERSONA_ID, personas } from "./guardian/evaluate";
import { routeHref, useRoute, type Route } from "./guardian/router";
import { LandingPage } from "./landing/LandingPage";
import { ProductDetails } from "./storefront/ProductDetails";
import { StorefrontPage } from "./storefront/StorefrontPage";
import { LandingV2 } from "./v2/landing/LandingV2";
import { ProductPageV2 } from "./v2/storefront/ProductPageV2";
import { StorefrontV2 } from "./v2/storefront/StorefrontV2";

const PERSONA_KEY = "guardian.persona";

function initialPersona() {
  const saved = window.localStorage.getItem(PERSONA_KEY);
  return personas.some((p) => p.id === saved) ? (saved as string) : DEFAULT_PERSONA_ID;
}

/* Floating toggle to compare the current design with the first pass on the same page. */
function DesignSwitch({ route }: { route: Route }) {
  return (
    <nav
      aria-label="Design version"
      className="fixed bottom-5 left-5 z-50 max-sm:bottom-3 max-sm:left-3 flex items-center gap-1 rounded-full border border-white/10 bg-zinc-925/90 p-1 text-[11.5px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
    >
      {(["v2", "v1"] as const).map((d) => (
        <a
          key={d}
          href={routeHref(route, d)}
          aria-current={route.design === d ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
            route.design === d ? "bg-zinc-50 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          <span className="max-sm:hidden">{d === "v2" ? "New design" : "Previous"}</span>
          <span className="sm:hidden">{d === "v2" ? "New" : "Old"}</span>
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  const route = useRoute();
  const [personaId, setPersonaId] = useState(initialPersona);

  useEffect(() => {
    window.localStorage.setItem(PERSONA_KEY, personaId);
  }, [personaId]);

  if (route.name === "copilot") return <CopilotPage />;

  const props = { personaId, onPersonaChange: setPersonaId };
  let page;
  if (route.design === "v2") {
    if (route.name === "storefront") page = <StorefrontV2 {...props} />;
    else if (route.name === "product") page = <ProductPageV2 key={route.id} productId={route.id} {...props} />;
    else page = <LandingV2 {...props} />;
  } else {
    if (route.name === "storefront") page = <StorefrontPage {...props} />;
    else if (route.name === "product") page = <ProductDetails key={route.id} productId={route.id} {...props} />;
    else page = <LandingPage {...props} />;
  }

  return (
    <>
      {page}
      <DesignSwitch route={route} />
    </>
  );
}

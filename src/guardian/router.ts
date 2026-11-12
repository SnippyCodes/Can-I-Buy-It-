import { useEffect, useState } from "react";

/** "v2" is the current design; "v1" keeps the first pass for comparison. */
export type Design = "v1" | "v2";

export type Route = { design: Design } & (
  | { name: "home" }
  | { name: "storefront" }
  | { name: "product"; id: string }
  | { name: "copilot" }
);

function parse(hash: string): Route {
  const path = hash.replace(/^#/, "") || "/";
  let parts = path.split("/").filter(Boolean);
  let design: Design = "v2";
  if (parts[0] === "v1") {
    design = "v1";
    parts = parts.slice(1);
  }
  if (parts[0] === "storefront" && parts[1]) return { design, name: "product", id: parts[1] };
  if (parts[0] === "storefront") return { design, name: "storefront" };
  if (parts[0] === "copilot") return { design, name: "copilot" };
  return { design, name: "home" };
}

let base = typeof window !== "undefined" && parse(window.location.hash).design === "v1" ? "#/v1" : "";

/* Links resolve against the active design so each version stays self-contained. */
export const href = {
  get home() {
    return base ? `${base}/` : "/";
  },
  get storefront() {
    return base ? `${base}/storefront` : "/storefront";
  },
  product: (id: string) => (base ? `${base}/storefront/${id}` : `/storefront/${id}`),
  copilot: "/copilot",
  dashboard: "/dashboard",
  repo: "https://github.com/SnippyCodes/Can-I-Buy-It-",
};

export function routeHref(route: Route, design: Design) {
  const prefix = design === "v1" ? "#/v1" : "";
  if (route.name === "storefront") return `${prefix}/storefront`;
  if (route.name === "product") return `${prefix}/storefront/${route.id}`;
  return `${prefix}/`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window !== "undefined" ? parse(window.location.hash || window.location.pathname) : { design: "v2", name: "home" }
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onChange = () => {
      const next = parse(window.location.hash || window.location.pathname);
      base = next.design === "v1" ? "#/v1" : "";
      setRoute(next);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

/** Scroll to an in-page section without touching the hash router. */
export function scrollToId(id: string) {
  if (typeof document !== "undefined") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

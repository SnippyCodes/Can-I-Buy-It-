import { useEffect, useRef, useState } from "react";
import { getPersona, personas, usd } from "./evaluate";
import { CheckIcon, ChevronDownIcon, WalletIcon } from "./icons";

interface PersonaMenuProps {
  personaId: string;
  onChange: (id: string) => void;
}

/* Sandbox persona switcher; the balance drives every Guardian verdict. */
export function PersonaMenu({ personaId, onChange }: PersonaMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const persona = getPersona(personaId);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2.5 rounded-[9px] border border-zinc-800 bg-zinc-925 pr-2.5 pl-3 text-left hover:border-zinc-700"
      >
        <WalletIcon width={14} height={14} className="text-zinc-400" />
        <span className="flex flex-col leading-none">
          <span className="text-[10px] text-zinc-500">{persona.name}</span>
          <span className="mt-[3px] text-[12.5px] font-medium tabular-nums text-zinc-100">
            {usd(persona.balance, { cents: true })}
          </span>
        </span>
        <ChevronDownIcon width={13} height={13} className="ml-1 text-zinc-500" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[280px] rounded-[12px] border border-zinc-800 bg-zinc-925 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
        >
          <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-medium tracking-[0.06em] text-zinc-500">
            PAYPAL SANDBOX PERSONA
          </p>
          {personas.map((p) => (
            <button
              key={p.id}
              type="button"
              role="menuitemradio"
              aria-checked={p.id === personaId}
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
              className="flex w-full items-start gap-2.5 rounded-[8px] px-2.5 py-2 text-left hover:bg-zinc-900"
            >
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center text-zinc-100">
                {p.id === personaId && <CheckIcon width={13} height={13} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[12.5px] font-medium text-zinc-100">{p.name}</span>
                  <span className="text-[12px] tabular-nums text-zinc-300">{usd(p.balance)}</span>
                </span>
                <span className="block text-[11px] text-zinc-500">
                  {p.label} · {p.note}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

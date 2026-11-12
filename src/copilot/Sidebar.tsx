import type { Session, SessionGroup } from "./data";
import { ChevronUpDownIcon, PlusIcon } from "./icons";

const GROUPS: SessionGroup[] = ["TODAY", "PREVIOUS 7 DAYS"];

interface SidebarProps {
  sessions: Session[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

function WindowControls() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span className="size-3 rounded-full border border-black/20 bg-[#ff5f57]" />
      <span className="size-3 rounded-full border border-black/20 bg-[#febc2e]" />
      <span className="size-3 rounded-full border border-black/20 bg-[#28c840]" />
    </div>
  );
}

export function Sidebar({ sessions, activeId, onSelect, onNewChat }: SidebarProps) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-[52px] shrink-0 items-center px-4">
        <WindowControls />
      </div>

      <div className="flex items-center justify-between gap-2 px-4 pb-4">
        <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-zinc-50">
          Guardian Copilot <span className="font-normal text-zinc-500">v2.4</span>
        </p>
        <span className="shrink-0 rounded-[5px] border border-gain/25 bg-gain/10 px-1.5 py-px text-[10px] font-medium text-gain">
          Sandbox
        </span>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-8 w-full items-center gap-2 rounded-[7px] border border-zinc-800 bg-zinc-900 px-2.5 text-[12px] font-medium text-zinc-200 hover:bg-zinc-850"
        >
          <PlusIcon width={14} height={14} />
          New Chat
        </button>
      </div>

      <nav
        aria-label="Chat sessions"
        className="scroll-thin mt-5 min-h-0 flex-1 overflow-y-auto px-3"
      >
        {GROUPS.map((group) => {
          const items = sessions.filter((s) => s.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="mb-5">
              <h2 className="px-2.5 pb-1.5 text-[10px] font-medium tracking-[0.06em] text-zinc-500">
                {group}
              </h2>
              <ul className="flex flex-col gap-px">
                {items.map((session) => {
                  const active = session.id === activeId;
                  return (
                    <li key={session.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(session.id)}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-left text-[12px] ${
                          active
                            ? "bg-zinc-800 text-zinc-50"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        }`}
                      >
                        <span className="min-w-0 flex-1 truncate">{session.title}</span>
                        <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">
                          {session.time}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>

      <footer className="border-t border-zinc-800 p-3">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-200">
            EV
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-zinc-100">
              Elena Vance
            </span>
            <span className="block truncate text-[11px] text-zinc-500">
              VP Treasury · Dual signer
            </span>
          </span>
          <ChevronUpDownIcon width={14} height={14} className="text-zinc-600" />
        </div>
      </footer>
    </aside>
  );
}

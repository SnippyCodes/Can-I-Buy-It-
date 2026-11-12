import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { Message, Session } from "./data";
import { ArrowUpIcon, CanvasIcon, ChevronRightIcon, CloseIcon, PaperclipIcon } from "./icons";

interface ChatStreamProps {
  session: Session;
  artifactOpen: boolean;
  onSend: (text: string, attachment: string | null) => void;
  onOpenArtifact: () => void;
}

const SUGGESTIONS = [
  "Stress-test cash flow for the next 90 days",
  "Review wires waiting for approval",
  "Compare reserve yield by tranche",
];

function StatusPill({ tone, children }: { tone: "neutral" | "gain"; children: ReactNode }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-925 px-2.5 text-[11px] font-medium text-zinc-300">
      <span className={`size-1.5 rounded-full ${tone === "gain" ? "bg-gain" : "bg-zinc-400"}`} />
      {children}
    </span>
  );
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <p className="max-w-[85%] rounded-[14px] border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-[13px] leading-[1.55] text-zinc-100">
        {message.text}
      </p>
      <span className="pr-1 text-[11px] tabular-nums text-zinc-600">{message.time}</span>
    </div>
  );
}

function AssistantMessage({
  message,
  artifactOpen,
  onOpenArtifact,
}: {
  message: Message;
  artifactOpen: boolean;
  onOpenArtifact: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[11px]">
        <span className="font-medium text-zinc-300">Guardian</span>
        <span className="tabular-nums text-zinc-600">{message.time}</span>
      </div>
      {message.heading && (
        <h3 className="text-[13px] font-semibold text-zinc-50">{message.heading}</h3>
      )}
      <ul className="flex flex-col gap-2">
        {message.bullets?.map((bullet) => (
          <li key={bullet} className="flex gap-2.5 text-[13px] leading-[1.6] text-zinc-300">
            <span className="mt-[9px] size-1 shrink-0 rounded-full bg-zinc-500" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {message.artifact && (
        <button
          type="button"
          onClick={onOpenArtifact}
          className="mt-1 flex w-full max-w-[420px] items-center gap-3 rounded-[10px] border border-zinc-800 bg-zinc-925 p-3 text-left hover:border-zinc-700"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-[7px] border border-zinc-800 bg-zinc-900 text-zinc-300">
            <CanvasIcon width={15} height={15} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-zinc-100">
              {message.artifact.title}
            </span>
            <span className="block truncate text-[11px] text-zinc-500">
              {message.artifact.meta}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-zinc-400">
            {artifactOpen ? "Viewing" : "Open"}
            <ChevronRightIcon width={13} height={13} />
          </span>
        </button>
      )}
    </div>
  );
}

export function ChatStream({ session, artifactOpen, onSend, onOpenArtifact }: ChatStreamProps) {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [session.id, session.messages.length]);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text, attachment);
    setDraft("");
    setAttachment(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-zinc-950">
      <header className="flex h-[52px] shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-5">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[12px]">
          <span className="shrink-0 text-zinc-500">Copilot</span>
          <ChevronRightIcon width={12} height={12} className="shrink-0 text-zinc-700" />
          <span className="truncate font-medium text-zinc-100">{session.title}</span>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <StatusPill tone="neutral">Security Guard: Dual HITL Active</StatusPill>
          <StatusPill tone="gain">Sandbox Ready</StatusPill>
          {!artifactOpen && (
            <button
              type="button"
              onClick={onOpenArtifact}
              aria-label="Open canvas"
              className="grid size-7 place-items-center rounded-[7px] border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <CanvasIcon width={14} height={14} />
            </button>
          )}
        </div>
      </header>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[680px] flex-col gap-8 px-6 py-8">
          {session.messages.length === 0 ? (
            <div className="flex flex-col items-start gap-4 pt-16">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-50">New conversation</h2>
                <p className="mt-1 text-[13px] text-zinc-500">
                  Ask about cash, wires, reserves or exposure.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setDraft(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="rounded-[7px] border border-zinc-800 px-3 py-1.5 text-left text-[12px] text-zinc-300 hover:bg-zinc-900"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            session.messages.map((message) =>
              message.role === "user" ? (
                <UserMessage key={message.id} message={message} />
              ) : (
                <AssistantMessage
                  key={message.id}
                  message={message}
                  artifactOpen={artifactOpen}
                  onOpenArtifact={onOpenArtifact}
                />
              ),
            )
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="shrink-0 px-6 pb-5 pt-2">
        <form
          onSubmit={submit}
          className="mx-auto max-w-[680px] rounded-[14px] border border-zinc-800 bg-zinc-925 focus-within:border-zinc-700"
        >
          {attachment && (
            <div className="px-3 pt-3">
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-[6px] border border-zinc-800 bg-zinc-900 py-1 pl-2 pr-1 text-[11px] text-zinc-300">
                <PaperclipIcon width={12} height={12} className="shrink-0 text-zinc-500" />
                <span className="truncate">{attachment}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="grid size-4 place-items-center rounded text-zinc-500 hover:text-zinc-100"
                >
                  <CloseIcon width={11} height={11} />
                </button>
              </span>
            </div>
          )}
          <textarea
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            aria-label="Message Guardian Copilot"
            placeholder="Ask Guardian about cash flow, wires or reserves…"
            className="block w-full resize-none bg-transparent px-4 pt-3 text-[13px] leading-[1.5] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <div className="flex items-center justify-between px-2.5 pb-2.5">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.pdf"
              className="hidden"
              onChange={(e) => {
                setAttachment(e.target.files?.[0]?.name ?? null);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
              className="grid size-7 place-items-center rounded-[7px] text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
            >
              <PaperclipIcon width={15} height={15} />
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className="grid size-7 place-items-center rounded-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 disabled:cursor-default disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              <ArrowUpIcon width={14} height={14} strokeWidth={1.8} />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

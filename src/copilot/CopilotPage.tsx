import { useState } from "react";
import { ArtifactPanel, type ArtifactView } from "./ArtifactPanel";
import { ChatStream } from "./ChatStream";
import { canvasArtifact, initialSessions, type Message, type Session } from "./data";
import { Sidebar } from "./Sidebar";

let idCounter = 0;
const nextId = () => `msg-${++idCounter}`;

function clock() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/* Simulated reply: this prototype has no model backend. */
function buildReply(prompt: string, attachment: string | null, time: string): Message {
  const short = prompt.length > 60 ? `${prompt.slice(0, 60)}…` : prompt;
  const bullets = [`Ran “${short}” against current balances and scheduled settlements.`];
  if (attachment) bullets.push(`Included ${attachment} in the cash position.`);
  bullets.push("Covenant headroom stays above the $500K buffer through day 90.");
  bullets.push("Outbound wires over $50K still require two approvers.");
  return {
    id: nextId(),
    role: "assistant",
    time,
    heading: "Scenario recalculated",
    bullets,
    artifact: canvasArtifact,
  };
}

export function CopilotPage() {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeId, setActiveId] = useState(initialSessions[0].id);
  const [artifactOpen, setArtifactOpen] = useState(true);
  const [view, setView] = useState<ArtifactView>("charts");

  const activeSession = sessions.find((s) => s.id === activeId) ?? sessions[0];

  function handleNewChat() {
    const id = `chat-${Date.now()}`;
    setSessions((prev) => [
      { id, title: "New chat", group: "TODAY", time: clock(), messages: [] },
      ...prev,
    ]);
    setActiveId(id);
  }

  function handleSend(text: string, attachment: string | null) {
    const time = clock();
    const userMessage: Message = { id: nextId(), role: "user", time, text };
    setSessions((prev) =>
      prev.map((s) =>
        s.id !== activeSession.id
          ? s
          : {
              ...s,
              title:
                s.messages.length === 0
                  ? text.length > 34
                    ? `${text.slice(0, 34)}…`
                    : text
                  : s.title,
              time,
              messages: [...s.messages, userMessage, buildReply(text, attachment, time)],
            },
      ),
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 py-6">
      {/* Plain hash links keep this folder free of app-level imports. */}
      <nav
        aria-label="Site"
        className="flex w-full max-w-[1440px] items-center justify-between text-[12px] text-zinc-500"
      >
        <a href="#/" className="hover:text-zinc-200">
          ← Can I Buy It?
        </a>
        <a href="#/storefront" className="hover:text-zinc-200">
          Storefront →
        </a>
      </nav>
      <div className="flex h-[900px] w-full max-w-[1440px] overflow-hidden rounded-[12px] border border-zinc-800 bg-zinc-950">
        <Sidebar
          sessions={sessions}
          activeId={activeSession.id}
          onSelect={setActiveId}
          onNewChat={handleNewChat}
        />
        <ChatStream
          session={activeSession}
          artifactOpen={artifactOpen}
          onSend={handleSend}
          onOpenArtifact={() => setArtifactOpen(true)}
        />
        {artifactOpen && (
          <ArtifactPanel
            view={view}
            onViewChange={setView}
            onClose={() => setArtifactOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

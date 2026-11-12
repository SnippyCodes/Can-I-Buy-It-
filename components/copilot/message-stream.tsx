"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  ArrowUp,
  Paperclip,
  Mic,
  MicOff,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatMessage } from "./types";
import { ActionCardRenderer } from "./action-cards";
import { CanvasIcon, ChevronRightIcon } from "./icons";

function ReasoningAccordion({ reasoning }: { reasoning: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-[10px] border border-zinc-800 bg-zinc-900/60 overflow-hidden text-xs transition-all duration-200 my-2">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3.5 py-2 bg-zinc-900 hover:bg-zinc-850 transition text-zinc-400 hover:text-zinc-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-medium text-xs text-zinc-200">
            Multi-Agent Reasoning &amp; Swarm Audit
          </span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
            Consensus Ratified
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-1.5 whitespace-pre-wrap">
          {reasoning}
        </div>
      )}
    </div>
  );
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="text-[13.5px] leading-[1.6] text-zinc-200 space-y-2.5">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-base font-bold text-zinc-50 mt-3 mb-1.5 tracking-tight" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-sm font-semibold text-zinc-100 mt-2.5 mb-1 tracking-tight" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-xs font-semibold text-zinc-100 mt-2 mb-1 tracking-tight text-emerald-400 flex items-center gap-1.5" {...props} />
          ),
          p: ({ ...props }) => (
            <p className="leading-relaxed text-zinc-300 mb-2 last:mb-0" {...props} />
          ),
          ul: ({ ...props }) => (
            <ul className="space-y-1.5 my-2 pl-4 list-disc marker:text-zinc-500 text-zinc-300 text-[13px]" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal marker:text-emerald-400 marker:font-semibold text-zinc-200 text-[13px]" {...props} />
          ),
          li: ({ ...props }) => (
            <li className="leading-relaxed pl-1 text-[13px] text-zinc-300" {...props} />
          ),
          strong: ({ ...props }) => (
            <strong className="font-semibold text-zinc-100" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="text-zinc-300 italic" {...props} />
          ),
          code: ({ children, ...props }) => {
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-mono text-[11.5px]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

interface MessageStreamProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSend: (message: string) => void;
  onOpenAttach?: () => void;
  artifactOpen?: boolean;
  onOpenArtifact?: () => void;
}

const FIGMA_SUGGESTIONS = [
  "Stress-test cash flow for the next 90 days",
  "Review wires waiting for approval",
  "Compare reserve yield by tranche",
  "Can I buy a mechanical keyboard for $150?",
  "Create an invoice for $500 for consulting services",
];

export function CopilotMessageStream({
  messages,
  isGenerating,
  onSend,
  onOpenAttach,
  artifactOpen,
  onOpenArtifact,
}: MessageStreamProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    onSend(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputValue("Check balance and 90-day cash flow safety");
        setIsRecording(false);
      }, 2200);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* 1. Scrollable Message Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-3xl mx-auto w-full scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start gap-4 pt-12 pb-6">
            <div>
              <h2 className="text-[15px] font-semibold text-zinc-50">New conversation</h2>
              <p className="mt-1 text-[13px] text-zinc-500">
                Ask about liquidity, sandbox checkouts, Pay Later routing, or upcoming cash flow.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {FIGMA_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setInputValue(suggestion);
                  }}
                  className="rounded-[7px] border border-zinc-800 bg-zinc-900/50 px-3.5 py-2 text-left text-[12px] text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 animate-in fade-in duration-200 ${
                  isUser ? "items-end" : "items-start w-full"
                }`}
              >
                {/* User Message Bubble */}
                {isUser ? (
                  <>
                    <p className="max-w-[85%] rounded-[14px] border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-[13px] leading-[1.55] text-zinc-100 shadow-sm">
                      {msg.text}
                    </p>
                    <span className="pr-1 text-[11px] tabular-nums text-zinc-600">
                      {msg.timestamp || "Just now"}
                    </span>
                  </>
                ) : (
                  /* Assistant Response Body */
                  <div className="flex flex-col gap-2.5 w-full">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-zinc-200">Guardian</span>
                      <span className="text-[10px] text-zinc-500 font-mono">v2.4</span>
                      <span className="tabular-nums text-zinc-600 ml-auto">
                        {msg.timestamp || "Just now"}
                      </span>
                    </div>

                    {/* Chain-of-Thought Reasoning Accordion */}
                    {msg.reasoning && (
                      <ReasoningAccordion reasoning={msg.reasoning} />
                    )}

                    <MarkdownMessage content={msg.text} />

                    {/* Interactive Artifact Canvas Link */}
                    {onOpenArtifact && (
                      <button
                        type="button"
                        onClick={onOpenArtifact}
                        className="mt-1 flex w-full max-w-[420px] items-center gap-3 rounded-[10px] border border-zinc-800 bg-zinc-925 p-3 text-left hover:border-zinc-700 transition cursor-pointer"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-[7px] border border-zinc-800 bg-zinc-900 text-zinc-300">
                          <CanvasIcon width={15} height={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium text-zinc-100">
                            Q3 Liquidity &amp; Risk Canvas
                          </span>
                          <span className="block truncate text-[11px] text-zinc-500">
                            Cash balance, settlements, reserves, and corridors
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-0.5 text-[11px] text-zinc-400">
                          {artifactOpen ? "Viewing" : "Open"}
                          <ChevronRightIcon width={13} height={13} />
                        </span>
                      </button>
                    )}

                    {/* Action Cards (Orders, Pay-in-4, Invoices) */}
                    {msg.actionCard && (
                      <div className="pt-2 w-full">
                        <ActionCardRenderer
                          card={msg.actionCard}
                          onAuthorizeOrder={(orderId, amount) => {
                            onSend(`Authorize PayPal sandbox capture for order #${orderId} ($${amount})`);
                          }}
                        />
                      </div>
                    )}

                    {/* Copy Toolbar */}
                    <div className="flex items-center gap-3 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                        title="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-2.5 py-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 text-xs font-mono">
              Guardian consensus swarm debating risk &amp; liquidity reserves...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 2. Figma Input Bar */}
      <div className="shrink-0 px-4 pb-4 pt-1 bg-zinc-950">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl rounded-[14px] border border-zinc-800 bg-zinc-925 focus-within:border-zinc-700 transition"
        >
          <div className="p-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask about cash, wires, reserves, or authorize a PayPal payment..."
              className="w-full bg-transparent text-[13px] text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onOpenAttach}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition cursor-pointer"
                  title="Attach Statement or Invoice"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isRecording
                      ? "bg-rose-500/20 text-rose-300 animate-pulse"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title="Voice input"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!inputValue.trim() || isGenerating}
                className="grid size-7 place-items-center rounded-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                title="Send (Enter)"
              >
                <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CopilotMessageStream;

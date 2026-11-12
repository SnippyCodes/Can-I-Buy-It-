"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  Trash2,
  TrendingUp,
  Receipt,
  Check,
  ChevronRight,
  ArrowLeft,
  Home,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { SubAgentId } from "./types";
import { CanvasIcon } from "./icons";

interface HeaderProps {
  threadTitle: string;
  activeAgentId: SubAgentId;
  onSelectAgent: (id: SubAgentId) => void;
  onClearChat: () => void;
  hasMessages: boolean;
  artifactOpen?: boolean;
  onToggleArtifact?: () => void;
}

const AGENT_MODES: Array<{
  id: SubAgentId;
  name: string;
  icon: typeof Sparkles;
  description: string;
}> = [
  {
    id: "guardian-core",
    name: "Guardian Core",
    icon: Sparkles,
    description: "Financial buffer defense & purchase safety",
  },
  {
    id: "autonomous-trader",
    name: "Trader Agent",
    icon: TrendingUp,
    description: "Guarded order execution & price negotiations",
  },
  {
    id: "merchant-invoicing",
    name: "Invoicing Agent",
    icon: Receipt,
    description: "Automated PayPal Invoicing REST v2 dispatch",
  },
];

export function CopilotHeader({
  threadTitle,
  activeAgentId,
  onSelectAgent,
  onClearChat,
  hasMessages,
  artifactOpen,
  onToggleArtifact,
}: HeaderProps) {
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

  const currentMode =
    AGENT_MODES.find((m) => m.id === activeAgentId) || AGENT_MODES[0];
  const CurrentIcon = currentMode.icon;

  return (
    <header className="h-[52px] border-b border-zinc-800 bg-zinc-950 sticky top-0 z-20 select-none px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 shrink-0">
      {/* Left: Back to Home + Figma Breadcrumb */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[7px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium transition shrink-0 group cursor-pointer shadow-sm"
          title="Return to Home Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <Home className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
          <span className="font-medium hidden sm:inline">Back to Home</span>
          <span className="font-medium sm:hidden">Home</span>
        </Link>

        <span className="text-zinc-800 hidden sm:inline">|</span>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[12px]">
          <Link
            href="/"
            className="hidden sm:inline shrink-0 text-zinc-500 hover:text-zinc-300 transition font-medium"
          >
            Home
          </Link>
          <ChevronRight className="hidden sm:inline w-3 h-3 shrink-0 text-zinc-700" />
          <span className="shrink-0 text-zinc-500 font-medium">Copilot</span>
          <ChevronRight className="w-3 h-3 shrink-0 text-zinc-700" />
          <span className="truncate font-medium text-zinc-100 max-w-[120px] sm:max-w-xs md:max-w-md">
            {threadTitle || "New chat"}
          </span>
        </nav>
      </div>

      {/* Right: Quick Links, Security Status Pills, Mode Dropdown & Canvas Toggle */}
      <div className="flex items-center gap-2 text-xs shrink-0">
        <Link
          href="/dashboard"
          className="hidden xl:inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-925 px-2.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
          title="Go to Merchant Dashboard"
        >
          <LayoutDashboard className="w-3 h-3 text-zinc-400" />
          Dashboard
        </Link>

        <Link
          href="/storefront"
          className="hidden xl:inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-925 px-2.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
          title="Go to Product Storefront"
        >
          <ShoppingBag className="w-3 h-3 text-zinc-400" />
          Storefront
        </Link>

        <span className="hidden md:inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-925 px-2.5 text-[11px] font-medium text-zinc-300">
          <span className="size-1.5 rounded-full bg-zinc-400" />
          Security Guard: Dual HITL
        </span>

        <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-925 px-2.5 text-[11px] font-medium text-zinc-300">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Sandbox Ready
        </span>

        {/* Minimal Agent Mode Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setModeDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-[7px] bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-[11px] font-medium transition cursor-pointer"
            title="Switch Agent Mode"
          >
            <CurrentIcon className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">{currentMode.name}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>

          {modeDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 p-1.5 rounded-xl bg-[#141418] border border-zinc-800 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Agent Mode
              </div>
              {AGENT_MODES.map((mode) => {
                const Icon = mode.icon;
                const isSelected = mode.id === activeAgentId;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      onSelectAgent(mode.id);
                      setModeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition text-left cursor-pointer ${
                      isSelected
                        ? "bg-zinc-800 text-zinc-100 font-semibold"
                        : "hover:bg-zinc-850 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-medium text-xs">{mode.name}</div>
                        <div className="text-[10px] text-zinc-500">{mode.description}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Canvas / Artifact Toggle Icon */}
        {onToggleArtifact && (
          <button
            type="button"
            onClick={onToggleArtifact}
            className={`grid size-7 place-items-center rounded-[7px] border transition cursor-pointer ${
              artifactOpen
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : "border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
            title={artifactOpen ? "Close Liquidity Canvas" : "Open Q3 Liquidity & Risk Canvas"}
          >
            <CanvasIcon width={14} height={14} />
          </button>
        )}

        {/* Clear Chat Button */}
        {hasMessages && (
          <button
            type="button"
            onClick={onClearChat}
            className="p-1.5 rounded-lg hover:bg-zinc-850 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
            title="Clear chat messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
}

export default CopilotHeader;

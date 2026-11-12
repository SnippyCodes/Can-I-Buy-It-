"use client";

import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Check,
  X,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { PlusIcon } from "./icons";
import { HistorySession } from "./types";
import { ConnectedAccount } from "./modals";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  sessions: HistorySession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onRenameSession?: (id: string, newTitle: string) => void;
  onDeleteSession?: (id: string) => void;
  onOpenSettings?: () => void;
  activeAccount?: ConnectedAccount | null;
  onOpenAccountModal?: () => void;
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

export function CopilotSidebar({
  isCollapsed,
  onToggleCollapse,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  onOpenSettings,
  activeAccount,
  onOpenAccountModal,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartRename = (e: React.MouseEvent, session: HistorySession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim() && onRenameSession) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteSession) {
      onDeleteSession(id);
    }
  };

  // Group sessions by date
  const todaySessions = sessions.filter((s) => s.dateGroup === "today" || !s.dateGroup);
  const olderSessions = sessions.filter((s) => s.dateGroup === "previous7Days");

  return (
    <aside
      className={`relative flex flex-col bg-zinc-950 border-r border-zinc-800 transition-all duration-300 select-none z-30 shrink-0 h-full ${
        isCollapsed ? "w-16" : "w-[260px]"
      }`}
    >
      {/* 1. Header with Window Controls & Brand */}
      {!isCollapsed ? (
        <>
          <div className="flex h-[52px] shrink-0 items-center justify-between px-4">
            <WindowControls />
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 px-4 pb-4">
            <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-zinc-50">
              Guardian Copilot <span className="font-normal text-zinc-500">v2.4</span>
            </p>
            <span className="shrink-0 rounded-[5px] border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-px text-[10px] font-medium text-emerald-400">
              Sandbox
            </span>
          </div>

          <div className="px-3">
            <button
              type="button"
              onClick={onNewChat}
              className="flex h-8 w-full items-center gap-2 rounded-[7px] border border-zinc-800 bg-zinc-900 px-2.5 text-[12px] font-medium text-zinc-200 hover:bg-zinc-850 transition cursor-pointer"
            >
              <PlusIcon width={14} height={14} />
              New Chat
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-3 gap-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNewChat}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-850 transition"
            title="New Chat"
          >
            <PlusIcon width={14} height={14} />
          </button>
        </div>
      )}

      {/* 2. Session Groups Navigation */}
      {!isCollapsed ? (
        <nav
          aria-label="Chat sessions"
          className="mt-5 min-h-0 flex-1 overflow-y-auto px-3 space-y-5 scrollbar-thin"
        >
          {/* Today Group */}
          {todaySessions.length > 0 && (
            <section>
              <h2 className="px-2.5 pb-1.5 text-[10px] font-medium tracking-[0.06em] text-zinc-500 uppercase">
                TODAY
              </h2>
              <ul className="flex flex-col gap-px">
                {todaySessions.map((session) => {
                  const active = session.id === activeSessionId;
                  const isEditing = editingId === session.id;

                  return (
                    <li key={session.id}>
                      {isEditing ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-850 rounded-[6px]">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(e, session.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            className="bg-transparent text-xs text-zinc-100 outline-none w-full"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, session.id)}
                            className="p-1 hover:text-emerald-400 text-zinc-400"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRename}
                            className="p-1 hover:text-rose-400 text-zinc-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => onSelectSession(session.id)}
                          className={`group flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-left text-[12px] cursor-pointer transition ${
                            active
                              ? "bg-zinc-800 text-zinc-50"
                              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">{session.title}</span>
                          <span className="shrink-0 text-[11px] tabular-nums text-zinc-600 group-hover:hidden">
                            {session.timestamp || "Today"}
                          </span>
                          <div className="hidden group-hover:flex items-center gap-1 text-zinc-500">
                            <button
                              type="button"
                              onClick={(e) => handleStartRename(e, session)}
                              className="p-0.5 hover:text-zinc-200"
                              title="Rename"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, session.id)}
                              className="p-0.5 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Previous 7 Days Group */}
          {olderSessions.length > 0 && (
            <section>
              <h2 className="px-2.5 pb-1.5 text-[10px] font-medium tracking-[0.06em] text-zinc-500 uppercase">
                PREVIOUS 7 DAYS
              </h2>
              <ul className="flex flex-col gap-px">
                {olderSessions.map((session) => {
                  const active = session.id === activeSessionId;
                  const isEditing = editingId === session.id;

                  return (
                    <li key={session.id}>
                      {isEditing ? (
                        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-850 rounded-[6px]">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(e, session.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            autoFocus
                            className="bg-transparent text-xs text-zinc-100 outline-none w-full"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleSaveRename(e, session.id)}
                            className="p-1 hover:text-emerald-400 text-zinc-400"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRename}
                            className="p-1 hover:text-rose-400 text-zinc-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => onSelectSession(session.id)}
                          className={`group flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-left text-[12px] cursor-pointer transition ${
                            active
                              ? "bg-zinc-800 text-zinc-50"
                              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">{session.title}</span>
                          <span className="shrink-0 text-[11px] tabular-nums text-zinc-600 group-hover:hidden">
                            {session.timestamp || "7d ago"}
                          </span>
                          <div className="hidden group-hover:flex items-center gap-1 text-zinc-500">
                            <button
                              type="button"
                              onClick={(e) => handleStartRename(e, session)}
                              className="p-0.5 hover:text-zinc-200"
                              title="Rename"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(e, session.id)}
                              className="p-0.5 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </nav>
      ) : (
        <div className="flex-1" />
      )}

      {/* 3. User Profile Footer with Account Switcher */}
      <footer className="border-t border-zinc-800 p-3 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onOpenAccountModal}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-lg p-1 hover:bg-zinc-900 transition cursor-pointer"
              title="Click to Switch PayPal Sandbox Persona"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-200">
                {activeAccount?.name ? activeAccount.name.charAt(0).toUpperCase() : "M"}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-zinc-100">
                  {activeAccount?.name || "Michael Buyer"}
                </span>
                <span className="block truncate text-[11px] text-zinc-500 font-mono">
                  ${(activeAccount?.balance ?? 3500).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </span>
            </button>

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAccountModal}
            className="w-full flex justify-center py-1 rounded hover:bg-zinc-900 text-zinc-400"
            title="Switch Account"
          >
            <span className="grid size-7 place-items-center rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-200">
              {activeAccount?.name ? activeAccount.name.charAt(0).toUpperCase() : "M"}
            </span>
          </button>
        )}
      </footer>
    </aside>
  );
}

export default CopilotSidebar;

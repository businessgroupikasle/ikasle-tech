"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, CircleAlert, Code2, Database, Globe2, LayoutGrid, Mail, Minus, Palette, PanelsTopLeft, RefreshCw, Send, Smartphone, Sparkles, X } from "lucide-react";
import { ChatAvatar } from "./ChatAvatar";
import { ChatLeadForm } from "./ChatLeadForm";
import type { ChatAction, ChatMessage, ChatRequestMessage } from "@/types/chatbot";
import { MAX_CHAT_MESSAGE } from "@/lib/chatbot/validation";

const primaryWelcome = [
  { label: "Build a Website", icon: Globe2 },
  { label: "Custom Software", icon: Code2 },
  { label: "ERP / CRM Solutions", icon: Database },
  { label: "Explore Our Work", icon: LayoutGrid },
] as const;
const moreWelcome = [
  { label: "Web Applications", icon: PanelsTopLeft },
  { label: "Mobile Apps", icon: Smartphone },
  { label: "UI/UX Design", icon: Palette },
  { label: "Contact Our Team", icon: Mail },
] as const;

function pageSuggestions(path: string) {
  if (path.startsWith("/services")) return ["Find the Right Service", "Website Development", "Custom Software", "ERP Development"];
  if (path.startsWith("/work")) return ["Explore Related Services", "Discuss a Similar Project"];
  if (path.startsWith("/blog")) return ["Explore Related Topics", "Ask About Our Services"];
  if (path.startsWith("/contact")) return ["Help Choosing a Project Type", "Ask a Question"];
  return ["Explore Services", "View Projects", "Start a Project"];
}

function actionsFor(text: string): ChatAction[] {
  const q = text.toLowerCase();
  if (q.includes("website")) return [{ label: "Explore Website Development", href: "/services/website-development" }, { label: "Discuss Project", enquiry: true }];
  if (q.includes("erp")) return [{ label: "Explore ERP Solutions", href: "/services/erp-business-automation" }, { label: "Start an Enquiry", enquiry: true }];
  if (q.includes("work") || q.includes("portfolio")) return [{ label: "View Our Work", href: "/work" }];
  if (q.includes("contact") || q.includes("enquiry") || q.includes("project")) return [{ label: "Start an Enquiry", enquiry: true }, { label: "Contact Page", href: "/contact" }];
  return [];
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"checking" | "ai" | "local" | "off">("checking");
  const [error, setError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const shouldFollow = useRef(true);
  const suggestions = useMemo(() => pageSuggestions(pathname), [pathname]);

  useEffect(() => {
    fetch("/api/chat").then((response) => response.json()).then((data: { enabled?: boolean; aiAvailable?: boolean }) => setMode(!data.enabled ? "off" : data.aiAvailable ? "ai" : "local")).catch(() => setMode("local"));
    inputRef.current?.focus();
    const escape = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("keydown", escape); abortRef.current?.abort(); };
  }, [onClose]);

  useEffect(() => {
    if (shouldFollow.current) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const newConversation = () => { abortRef.current?.abort(); setMessages([]); setInput(""); setError(null); setLeadOpen(false); setShowMore(false); setBusy(false); inputRef.current?.focus(); };

  const send = useCallback(async (value: string) => {
    const text = value.trim();
    if (!text || text.length > MAX_CHAT_MESSAGE || busy || mode === "off") return;
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text, createdAt: Date.now() };
    const history: ChatRequestMessage[] = [...messages, user].slice(-15).map(({ role, content }) => ({ role, content }));
    const assistantId = crypto.randomUUID();
    setMessages((current) => [...current, user, { id: assistantId, role: "assistant", content: "", createdAt: Date.now() }]);
    setInput(""); setBusy(true); setError(null); shouldFollow.current = true;
    const controller = new AbortController(); abortRef.current = controller;
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }), signal: controller.signal });
      if (!response.ok || !response.body) { const data = await response.json().catch(() => null) as { error?: string } | null; throw new Error(data?.error ?? "The assistant could not respond."); }
      setMode(response.headers.get("x-chat-mode") === "ai" ? "ai" : "local");
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let full = "";
      while (true) { const { done, value: chunk } = await reader.read(); if (done) break; full += decoder.decode(chunk, { stream: true }); setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: full } : message)); }
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, actions: actionsFor(text) } : message));
    } catch (cause) {
      if (controller.signal.aborted) return;
      const message = cause instanceof Error ? cause.message : "Network error. Please retry.";
      setError(message); setMessages((current) => current.map((item) => item.id === assistantId ? { ...item, content: message, error: true } : item));
    } finally { setBusy(false); abortRef.current = null; }
  }, [busy, messages, mode]);

  const submit = (event: FormEvent) => { event.preventDefault(); void send(input); };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(input); } };
  const startEnquiry = () => { setLeadOpen(true); shouldFollow.current = true; };

  return (
    <motion.section id="ikasle-chat-dialog" role="dialog" aria-modal="false" aria-label="IKASLE AI Assistant" initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 16 }} transition={{ type: "spring", stiffness: 340, damping: 30 }} className="chat-window fixed inset-x-0 top-0 bottom-[76px] flex origin-bottom-right flex-col overflow-hidden border border-white/20 bg-white shadow-[0_28px_80px_-24px_rgb(6_28_48/0.52)] sm:inset-auto sm:right-6 sm:bottom-[104px] sm:h-[min(650px,calc(100dvh-132px))] sm:w-[404px] sm:rounded-[24px]">
      <header className="relative overflow-hidden bg-[#061c30] px-4 py-3.5 text-white">
        <span className="chat-header-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div className="relative flex items-center gap-3">
          <ChatAvatar state={error ? "error" : busy ? "thinking" : "idle"} />
          <div className="min-w-0 flex-1"><h2 className="truncate text-[15px] font-semibold">IKASLE Assistant</h2><p className="text-[11.5px] text-[#b8cfdd]">Here to help you build</p><p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#8eb2c9]"><span className={`size-1.5 rounded-full ${mode === "ai" ? "bg-[#4ade80]" : mode === "off" ? "bg-[#f87171]" : "bg-[#f5a524]"}`} />{mode === "ai" ? "Ready to help" : mode === "checking" ? "Getting ready" : mode === "off" ? "Assistant unavailable" : "Quick answers available"}</p></div>
          <button title="New conversation" onClick={newConversation} aria-label="Start new conversation" className="chat-header-control"><RefreshCw className="size-4" /></button>
          <button title="Minimize" onClick={onClose} aria-label="Minimize assistant" className="chat-header-control"><Minus className="size-5" /></button>
          <button title="Close" onClick={onClose} aria-label="Close assistant" className="chat-header-control"><X className="size-4" /></button>
        </div>
      </header>

      <div ref={scrollRef} onScroll={(event) => { const el = event.currentTarget; shouldFollow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }} className="chat-scroll flex-1 overflow-y-auto overscroll-contain bg-[#f7fbfe] px-4 py-5">
        {leadOpen && <ChatLeadForm onClose={() => setLeadOpen(false)} />}
        <AnimatePresence initial={false}>{messages.length === 0 && !leadOpen && <motion.div key="welcome" exit={{ opacity: 0, y: -8 }} className="chat-welcome py-2"><motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}><ChatAvatar className="size-12" /></motion.div><motion.h3 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="mt-4 text-xl font-semibold tracking-tight text-ink">Hi there! <span aria-hidden="true">👋</span></motion.h3><motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-2 max-w-[330px] text-[14px] leading-relaxed text-ink-soft">I&apos;m your IKASLE assistant. Looking to build something? I can help you find the right solution.</motion.p><div className="mt-5 grid grid-cols-2 gap-2.5">{primaryWelcome.map(({ label, icon: Icon }, index) => <motion.button key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 + index * 0.04 }} onClick={() => void send(label)} className="chat-suggestion"><Icon className="size-4 text-accent-strong" /><span>{label}</span></motion.button>)}</div><button onClick={() => setShowMore((value) => !value)} aria-expanded={showMore} className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-[12px] font-semibold text-accent-strong">More ways we can help<ChevronDown className={`size-3.5 transition-transform ${showMore ? "rotate-180" : ""}`} /></button><AnimatePresence>{showMore && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-2 gap-2.5 overflow-hidden pt-1">{moreWelcome.map(({ label, icon: Icon }) => <button key={label} onClick={label === "Contact Our Team" ? startEnquiry : () => void send(label)} className="chat-suggestion"><Icon className="size-4 text-accent-strong" /><span>{label}</span></button>)}</motion.div>}</AnimatePresence></motion.div>}</AnimatePresence>
        <div className="space-y-3" aria-live="polite">
          {messages.map((message) => (
            <motion.div key={message.id} initial={{ opacity: 0, y: 8, x: message.role === "user" ? 6 : 0 }} animate={{ opacity: 1, y: 0, x: 0 }} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && <ChatAvatar state={message.error ? "error" : busy && message === messages.at(-1) ? "thinking" : "idle"} className="mb-1 size-7 rounded-[9px]" />}
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${message.role === "user" ? "rounded-br-md bg-[#007bdf] text-white" : message.error ? "rounded-bl-md border border-danger/25 bg-danger/[0.05] text-[#9f261d]" : "rounded-bl-md bg-white text-ink shadow-[0_5px_18px_-14px_rgb(8_43_69/.5)]"}`}>
                {message.content ? <p className="whitespace-pre-wrap">{message.content}</p> : busy && message === messages.at(-1) ? <span className="chat-typing" role="status" aria-label="Assistant is preparing a response"><i /><i /><i /></span> : null}
                {message.actions && <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => action.href ? <Link key={action.label} href={action.href} onClick={onClose} className="inline-flex items-center gap-1 rounded-lg bg-bg-blue px-2.5 py-1.5 text-[12px] font-semibold text-accent-strong">{action.label}<ArrowUpRight className="size-3" /></Link> : <button key={action.label} onClick={action.enquiry ? startEnquiry : () => action.prompt && void send(action.prompt)} className="rounded-lg bg-bg-blue px-2.5 py-1.5 text-[12px] font-semibold text-accent-strong">{action.label}</button>)}</div>}
                {message.content && <time className={`mt-1.5 block text-[9.5px] ${message.role === "user" ? "text-white/60" : "text-ink-soft/60"}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>}
              </div>
            </motion.div>
          ))}
        </div>
        {error && <button onClick={() => { const last = [...messages].reverse().find((message) => message.role === "user"); if (last) void send(last.content); }} className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-danger"><CircleAlert className="size-3.5" />Retry last message</button>}
      </div>

      <div className="border-t border-line bg-white px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        {messages.length > 0 && <div className="mb-2 flex gap-2 overflow-x-auto pb-1">{suggestions.map((item) => <button key={item} onClick={item === "Start a Project" || item.includes("Discuss") ? startEnquiry : () => void send(item)} className="shrink-0 rounded-full bg-bg-blue px-3 py-1.5 text-[11px] font-medium text-accent-strong hover:bg-[#dcefff]">{item}</button>)}</div>}
        <form onSubmit={submit} className="flex items-end gap-2 rounded-2xl border border-line bg-bg-soft p-2 transition-colors focus-within:border-accent/55">
          <textarea ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={keyDown} maxLength={MAX_CHAT_MESSAGE} rows={1} disabled={busy || mode === "off"} aria-label="Message IKASLE Assistant" placeholder={mode === "off" ? "Assistant unavailable" : "Ask about your project..."} className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[13.5px] text-ink outline-none placeholder:text-ink-soft/60" />
          <button type="submit" disabled={busy || !input.trim() || mode === "off"} aria-label="Send message" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-strong text-white transition-colors hover:bg-accent-hover disabled:opacity-40"><AnimatePresence mode="wait">{busy ? <motion.span key="busy" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles className="size-4" /></motion.span> : <Send className="size-4" />}</AnimatePresence></button>
        </form>
        <p className="mt-1.5 px-1 text-[9.5px] text-ink-soft">Please don&apos;t share sensitive information. <Link href="/privacy-policy" onClick={onClose} className="font-medium underline">Privacy Policy</Link></p>
      </div>
    </motion.section>
  );
}

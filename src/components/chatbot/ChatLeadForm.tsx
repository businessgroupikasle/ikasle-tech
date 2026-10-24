"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle } from "lucide-react";
import { PROJECT_TYPES, type ContactResponse } from "@/lib/contact-schema";

type Lead = { projectType: string; description: string; fullName: string; email: string; phone: string; contactMethod: string };
const initial: Lead = { projectType: "", description: "", fullName: "", email: "", phone: "", contactMethod: "" };
const questions = ["What type of project are you planning?", "Briefly, what would you like us to build?", "What is your full name?", "What email should our team reply to?", "Would you like to add a phone number?", "How would you prefer us to contact you?"];

export function ChatLeadForm({ onClose }: { onClose: () => void }) {
  const [lead, setLead] = useState(initial);
  const [step, setStep] = useState(0);
  const startedAt = useRef(0);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const summary = step === questions.length;
  const valid = useMemo(() => step === 0 ? Boolean(lead.projectType) : step === 1 ? lead.description.trim().length >= 20 : step === 2 ? lead.fullName.trim().length >= 2 && !/\d/.test(lead.fullName) : step === 3 ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) : true, [lead, step]);

  const submit = async () => {
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lead, description: `${lead.description}\n\nPreferred contact method: ${lead.contactMethod || "Not specified"}`, company: "", website: "", startedAt: startedAt.current }) });
      const data = await response.json() as ContactResponse;
      if (data.ok) { setStatus("sent"); return; }
      setStatus("error"); setError(data.message);
    } catch { setStatus("error"); setError("Network error. Your enquiry was not sent. Please use the contact page or try again."); }
  };

  if (status === "sent") return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-2xl border border-success/25 bg-white p-4 text-sm"><span className="mb-2 inline-flex size-8 items-center justify-center rounded-full bg-success/15 text-success"><Check className="size-4" /></span><p className="font-semibold text-ink">Enquiry delivered</p><p className="mt-1 text-ink-soft">Thanks, {lead.fullName}. The backend confirmed delivery to the IKASLE team.</p><button onClick={onClose} className="mt-3 font-semibold text-accent-strong">Return to chat</button></motion.div>;

  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-2xl border border-accent/20 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between"><p className="font-mono text-[10px] uppercase tracking-wider text-accent-strong">Project enquiry · {Math.min(step + 1, 7)}/7</p><button onClick={onClose} className="text-[11px] text-ink-soft">Cancel</button></div>
    {!summary ? <><p className="mt-3 text-[14px] font-semibold text-ink">{questions[step]}</p><div className="mt-3" onFocus={() => { if (!startedAt.current) startedAt.current = Date.now(); }}>
      {step === 0 && <select value={lead.projectType} onChange={(e) => setLead({ ...lead, projectType: e.target.value })} className="w-full rounded-xl border border-line bg-white p-3 text-sm"><option value="">Select project type</option>{PROJECT_TYPES.map((value) => <option key={value}>{value}</option>)}</select>}
      {step === 1 && <textarea value={lead.description} onChange={(e) => setLead({ ...lead, description: e.target.value })} rows={3} maxLength={1500} placeholder="What should it do, and who is it for?" className="w-full resize-none rounded-xl border border-line p-3 text-sm" />}
      {step === 2 && <input value={lead.fullName} onChange={(e) => setLead({ ...lead, fullName: e.target.value })} onKeyDown={(e) => { if (!e.ctrlKey && !e.metaKey && !e.altKey && /^[0-9]$/.test(e.key)) e.preventDefault(); }} autoComplete="name" className="w-full rounded-xl border border-line p-3 text-sm" />}
      {step === 3 && <input value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} type="email" autoComplete="email" className="w-full rounded-xl border border-line p-3 text-sm" />}
      {step === 4 && <input value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} type="tel" autoComplete="tel" className="w-full rounded-xl border border-line p-3 text-sm" />}
      {step === 5 && <select value={lead.contactMethod} onChange={(e) => setLead({ ...lead, contactMethod: e.target.value })} className="w-full rounded-xl border border-line bg-white p-3 text-sm"><option value="">No preference</option><option>Email</option><option>Phone</option></select>}
    </div>{step === 1 && lead.description.length > 0 && !valid && <p className="mt-1.5 text-[11px] text-danger">Please add at least 20 characters.</p>}<div className="mt-3 flex justify-between"><button onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="inline-flex items-center gap-1 text-[12px] text-ink-soft disabled:opacity-0"><ArrowLeft className="size-3" />Back</button><button onClick={() => setStep((value) => value + 1)} disabled={!valid} className="inline-flex items-center gap-1 rounded-lg bg-accent-strong px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-40">{step >= 4 ? "Continue / Skip" : "Continue"}<ArrowRight className="size-3" /></button></div></> : <><p className="mt-3 text-[14px] font-semibold text-ink">Please confirm your details</p><dl className="mt-3 space-y-2 text-[12px]">{[["Project", lead.projectType], ["Description", lead.description], ["Name", lead.fullName], ["Email", lead.email], ["Phone", lead.phone || "Skipped"], ["Contact", lead.contactMethod || "No preference"]].map(([label, value]) => <div key={label} className="grid grid-cols-[72px_1fr] gap-2"><dt className="text-ink-soft">{label}</dt><dd className="break-words font-medium text-ink">{value}</dd></div>)}</dl>{error && <p role="alert" className="mt-3 rounded-lg bg-danger/[.06] p-2 text-[11.5px] text-danger">{error}</p>}<div className="mt-4 flex justify-between"><button onClick={() => { setStep(5); setStatus("idle"); }} className="text-[12px] text-ink-soft">Edit</button><button onClick={() => void submit()} disabled={status === "sending"} className="inline-flex items-center gap-1.5 rounded-lg bg-accent-strong px-3 py-2 text-[12px] font-semibold text-white disabled:opacity-60">{status === "sending" && <LoaderCircle className="size-3 animate-spin" />}Confirm & Send</button></div></>}
  </motion.div>;
}

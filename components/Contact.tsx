"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// ─── Form helpers ─────────────────────────────────────────────────────────────
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// ─── Terminal animation data ──────────────────────────────────────────────────
const CODE_LINES = [
  { text: "const contact = {"                                  },
  { text: '  name:     "Muneeb Niaz",'                        },
  { text: '  role:     "Software Engineer",'                   },
  { text: '  services: ["Backend", "Full-Stack", "APIs", "AI Integration"],'         },
  { text: '  stack:    ["Python","Django","ASP.NET","Node"],'   },
  { text: '  location: "Karachi, Pakistan",'                   },
  { text: "  available: true,"                                 },
  { text: "};"                                                 },
  { text: ""                                                   },
  { text: "contact.sendMessage();"                             },
];

// ─── Lightweight syntax highlighter ──────────────────────────────────────────
function tokenize(line: string) {
  if (line === "") return [{ text: "", color: "transparent" }];
  type Token = { text: string; color: string };
  const tokens: Token[] = [];
  let i = 0;
  const rules: Array<{ re: RegExp; color: string }> = [
    { re: /\/\/.*/g,                           color: "#64748b" },
    { re: /(".*?"|'.*?')/g,                    color: "#fbbf24" },
    { re: /\b(const|let|var|true|false)\b/g,   color: "#818cf8" },
    { re: /\b(\d+)\b/g,                        color: "#fb923c" },
    { re: /(\b\w+)(?=\s*:)/g,                  color: "#38bdf8" },
  ];
  while (i < line.length) {
    let matched = false;
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(line);
      if (m && m.index === i) {
        tokens.push({ text: m[0], color: rule.color });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const last = tokens[tokens.length - 1];
      if (last && last.color === "#cbd5e1") { last.text += line[i]; }
      else { tokens.push({ text: line[i], color: "#cbd5e1" }); }
      i++;
    }
  }
  return tokens;
}

// ─── Hook: typing animation; resets whenever `runKey` changes ────────────────
function useTypingAnimation(runKey: number) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex,    setCharIndex]    = useState(0);
  const [done,         setDone]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisibleLines(0);
    setCharIndex(0);
    setDone(false);

    let currentLine = 0;
    let currentChar = 0;
    let cancelled   = false;
    const CHAR_DELAY = 26;
    const LINE_PAUSE = 160;

    const tick = () => {
      if (cancelled) return;
      if (currentLine >= CODE_LINES.length) {
        timerRef.current = setTimeout(() => { if (!cancelled) setDone(true); }, 600);
        return;
      }
      const lineLen = CODE_LINES[currentLine].text.length;
      if (currentChar < lineLen) {
        currentChar++;
        setCharIndex(currentChar);
        setVisibleLines(currentLine);
        timerRef.current = setTimeout(tick, CHAR_DELAY);
      } else {
        setVisibleLines(currentLine + 1);
        currentLine++;
        currentChar = 0;
        setCharIndex(0);
        timerRef.current = setTimeout(tick, LINE_PAUSE);
      }
    };

    timerRef.current = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runKey]);

  return { visibleLines, charIndex, done };
}

// ─── Hook: fires a new runKey each time element enters the viewport ───────────
function useInViewRestart(threshold = 0.25) {
  const ref       = useRef<HTMLElement | null>(null);
  const [runKey, setRunKey] = useState(0);
  const inViewRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inViewRef.current) {
          inViewRef.current = true;
          setRunKey(k => k + 1);
        } else if (!entry.isIntersecting) {
          inViewRef.current = false;
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, runKey };
}

// ─── Terminal widget with onDone callback ─────────────────────────────────────
function ContactTerminal({ onDone, runKey }: { onDone: () => void; runKey: number }) {
  const { visibleLines, charIndex, done } = useTypingAnimation(runKey);
  const calledRef = useRef(false);

  useEffect(() => { calledRef.current = false; }, [runKey]);

  useEffect(() => {
    if (done && !calledRef.current) {
      calledRef.current = true;
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
  }, [done, onDone]);

  return (
    <div style={{
      fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
      fontSize: "clamp(11px,1.05vw,13px)",
      background: "rgba(5,8,22,0.88)",
      border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 0 36px rgba(99,102,241,0.13), 0 14px 36px rgba(0,0,0,0.5)",
      width: "100%",
    }}>
      {/* Title bar */}
      <div style={{ display:"flex", alignItems:"center", gap:5, padding:"9px 14px", background:"rgba(15,23,42,0.95)", borderBottom:"1px solid rgba(99,102,241,0.13)" }}>
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#ef4444", display:"inline-block" }} />
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />
        <span style={{ width:10, height:10, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
        <span style={{ marginLeft:6, color:"#475569", fontSize:"11px", letterSpacing:"0.04em" }}>contact.ts</span>
        {done && <span style={{ marginLeft:"auto", color:"#22c55e", fontSize:"10px", letterSpacing:"0.05em" }}>● compiled</span>}
      </div>

      {/* Code body */}
      <div style={{ padding:"14px 16px", lineHeight:1.72 }}>
        {CODE_LINES.map((line, li) => {
          if (li > visibleLines) return null;
          const isActive      = li === visibleLines && !done;
          const displayedText = isActive ? line.text.slice(0, charIndex) : line.text;
          const tokens        = tokenize(displayedText);
          return (
            <div key={li} style={{ display:"flex", whiteSpace:"pre" }}>
              <span style={{ color:"#1e293b", userSelect:"none", marginRight:14, minWidth:14, textAlign:"right" }}>{li + 1}</span>
              <span>
                {tokens.map((tok, ti) => <span key={ti} style={{ color:tok.color }}>{tok.text}</span>)}
                {isActive && (
                  <span style={{ display:"inline-block", width:"2px", height:"1.1em", background:"#6366f1", verticalAlign:"text-bottom", animation:"termCursor 1s step-end infinite" }} />
                )}
              </span>
            </div>
          );
        })}
        {done && (
          <div style={{ marginTop:8, color:"#475569", whiteSpace:"pre" }}>
            <span style={{ color:"#22c55e" }}>➜</span>
            <span style={{ color:"#94a3b8" }}> ts-node contact.ts</span>
          </div>
        )}
      </div>
      <style>{`@keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ─── Profile card: terminal → original content, restarts on each scroll-in ───
function ProfileCard({ runKey }: { runKey: number }) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Each new scroll-in resets to the terminal
  useEffect(() => { setShowOriginal(false); }, [runKey]);

  return (
    <div className="card p-6 sm:p-8 flex flex-col">
      <AnimatePresence mode="wait">
        {!showOriginal ? (
          <motion.div
            key={`terminal-${runKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <ContactTerminal runKey={runKey} onDone={() => setShowOriginal(true)} />
          </motion.div>
        ) : (
          <motion.div
            key={`original-${runKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col h-full"
          >
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-7">
              <Image src="/logo-mn.png" alt="Muneeb Niaz Logo" width={56} height={56} className="flex-shrink-0" style={{ borderRadius: "4px" }} />
              <div>
                <h3 className="subheading text-xl">Muneeb Niaz</h3>
                <p className="overline">Software Engineer</p>
              </div>
            </div>

            {/* Bio */}
            <p className="label mb-8 leading-loose border-l-2 pl-4" style={{ borderLeftColor: "var(--accent-primary)" }}>
              If you&apos;re building a web product and need end-to-end support—frontend, backend, APIs, or architecture—send the brief.
              I specialize in React, Django, ASP.NET Core, and Node.js, with practical experience in RESTful API development,
              scalable system design, and seamless frontend-backend integration.
            </p>

            {/* Links */}
            <div className="flex flex-col gap-4 mt-auto">
              {[
                { href: "https://github.com/Muneebniaz111", label: "GitHub", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                { href: "mailto:muneebniaz258@gmail.com", label: "muneebniaz258@gmail.com", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 7l8.586 5.657a2 2 0 002.828 0L22 7"/></svg> },
                { href: "https://www.linkedin.com/in/muneeb-niaz-7295a8329", label: "LinkedIn", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
              ].map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 label group"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  <span style={{ color: "var(--text-tertiary)" }}>{icon}</span>
                  {label}
                </a>
              ))}
              <div className="flex items-center gap-3 label" style={{ color: "var(--text-secondary)" }}>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Karachi, Pakistan
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Contact section ─────────────────────────────────────────────────────
export default function Contact() {
  const { ref: sectionRef, runKey } = useInViewRestart(0.2);
  const setRef = useCallback((node: HTMLElement | null) => { sectionRef.current = node; }, [sectionRef]);

  const [formData, setFormData] = useState({ name: "", email: "", guestType: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (name === "email") {
      if (!value.trim()) setEmailError(null);
      else if (!isValidEmail(value)) setEmailError("Please enter a valid email address");
      else setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setStatus(null);
    if (!isValidEmail(formData.email)) {
      setStatus({ type: "error", text: "Please enter a valid email address" });
      setIsLoading(false); return;
    }
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (res.ok) { setStatus({ type: "success", text: "Message sent successfully!" }); setTimeout(() => setStatus(null), 5000); }
      else setStatus({ type: "error", text: data.error || "Failed to send message." });
    } catch { setStatus({ type: "error", text: "Failed to send message. Please try again." }); }
    finally { setIsLoading(false); }
  };

  const inputStyle = {
    background: "var(--surface-light)",
    border: "1px solid var(--border-color)",
    borderRadius: 0,
    color: "var(--text-primary)",
    padding: "12px 16px",
    width: "100%",
    fontSize: "var(--label-size)",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const focusStyle = { borderColor: "var(--accent-primary)", boxShadow: "0 0 0 3px var(--accent-glow)" };

  return (
    <section
      id="contact"
      ref={setRef}
      className="section section-dark relative z-20"
      style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 sm:mb-14">
          <h2 className="heading">Get In Touch</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Profile card with terminal intro */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <ProfileCard runKey={runKey} />
          </motion.div>

          {/* Right: Form — completely unchanged */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} viewport={{ once: true }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="overline block mb-2">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="Your full name" required style={inputStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, { borderColor: "var(--border-color)", boxShadow: "none" })}
                />
              </div>

              <div>
                <label className="overline block mb-2">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="you@example.com" required
                  style={{ ...inputStyle, borderColor: emailError ? "#f87171" : "var(--border-color)" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, { borderColor: emailError ? "#f87171" : "var(--border-color)", boxShadow: "none" })}
                />
                <AnimatePresence>
                  {emailError && (
                    <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      className="text-xs mt-1.5" style={{ color: "#f87171" }}>{emailError}</motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="overline block mb-2">Guest Type</label>
                <div className="relative">
                  <select name="guestType" value={formData.guestType} onChange={handleChange} required
                    style={{ ...inputStyle, appearance: "none", paddingRight: "40px", cursor: "pointer" }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => Object.assign(e.target.style, { borderColor: "var(--border-color)", boxShadow: "none" })}
                  >
                    <option value="">Select type…</option>
                    <option value="client">Client</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--text-tertiary)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <div>
                <label className="overline block mb-2">Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange}
                  placeholder="Tell me about the role, product, or problem you're solving." rows={5} required
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => Object.assign(e.target.style, { borderColor: "var(--border-color)", boxShadow: "none" })}
                />
              </div>

              <motion.button type="submit" disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="btn-primary justify-center py-3.5 mt-1"
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin" />Sending…</>
                ) : "Send Message →"}
              </motion.button>

              <AnimatePresence mode="wait">
                {status && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-4 text-sm font-medium"
                    style={{
                      background: status.type === "success" ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)",
                      border: `1px solid ${status.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                      color: status.type === "success" ? "#4ade80" : "#f87171",
                    }}>
                    {status.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

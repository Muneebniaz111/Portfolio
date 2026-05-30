"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const stats = [
  { label: "Projects Delivered", value: "6+",  color: "#6366f1" },
  { label: "Professional Certs", value: "2",   color: "#8b5cf6" },
  { label: "Tech Skills",        value: "10+", color: "#22d3ee" },
  { label: "Years Experience",   value: "1",   color: "#4ade80" },
];

// ─── Terminal animation data ──────────────────────────────────────────────────
const CODE_LINES = [
  { text: 'const engineer = {'                        },
  { text: '  name:    "Muneeb Niaz",'                 },
  { text: '  role:    "Software Engineer",'            },
  { text: '  focus:   "Back-End Developer",'          },
  { text: '  stack:   ["Python","Django","JS"],'      },
  { text: '  open:    true,'                          },
  { text: '};'                                        },
  { text: ''                                          },
  { text: 'console.log(engineer.greet());'            },
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

// ─── Hook: runs typing animation; resets whenever `runKey` changes ────────────
function useTypingAnimation(runKey: number) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIndex,    setCharIndex]    = useState(0);
  const [done,         setDone]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reset state at the start of every new run
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

// ─── Hook: fires a callback each time an element enters the viewport ──────────
function useInViewRestart(threshold = 0.25) {
  const ref      = useRef<HTMLElement | null>(null);
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
function TerminalWithCallback({
  onDone,
  small = false,
  runKey,
}: {
  onDone: () => void;
  small?: boolean;
  runKey: number;
}) {
  const { visibleLines, charIndex, done } = useTypingAnimation(runKey);
  const calledRef = useRef(false);
  const fontSize  = small ? "11px" : "clamp(11px,1.05vw,13px)";

  // Reset calledRef whenever a new run starts so onDone can fire again
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
      fontSize,
      background: "rgba(5,8,22,0.88)",
      border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 0 36px rgba(99,102,241,0.13), 0 14px 36px rgba(0,0,0,0.5)",
      width: "100%",
    }}>
      {/* Title bar */}
      <div style={{ display:"flex", alignItems:"center", gap:5, padding: small ? "8px 12px" : "9px 14px", background:"rgba(15,23,42,0.95)", borderBottom:"1px solid rgba(99,102,241,0.13)" }}>
        <span style={{ width:small?8:10, height:small?8:10, borderRadius:"50%", background:"#ef4444", display:"inline-block" }} />
        <span style={{ width:small?8:10, height:small?8:10, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }} />
        <span style={{ width:small?8:10, height:small?8:10, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
        <span style={{ marginLeft:6, color:"#475569", fontSize:small?"10px":"11px", letterSpacing:"0.04em" }}>portfolio.ts</span>
        {done && <span style={{ marginLeft:"auto", color:"#22c55e", fontSize:small?"9px":"10px", letterSpacing:"0.05em" }}>● compiled</span>}
      </div>

      {/* Code body */}
      <div style={{ padding: small ? "10px 12px" : "14px 16px", lineHeight:1.72 }}>
        {CODE_LINES.map((line, li) => {
          if (li > visibleLines) return null;
          const isActive      = li === visibleLines && !done;
          const displayedText = isActive ? line.text.slice(0, charIndex) : line.text;
          const tokens        = tokenize(displayedText);
          return (
            <div key={li} style={{ display:"flex", whiteSpace:"pre" }}>
              {!small && (
                <span style={{ color:"#1e293b", userSelect:"none", marginRight:14, minWidth:14, textAlign:"right" }}>{li + 1}</span>
              )}
              <span>
                {tokens.map((tok, ti) => <span key={ti} style={{ color:tok.color }}>{tok.text}</span>)}
                {isActive && (
                  <span style={{ display:"inline-block", width:"2px", height:"1.1em", background:"#6366f1", verticalAlign:"text-bottom" }} />
                )}
              </span>
            </div>
          );
        })}
        {done && (
          <div style={{ marginTop:8, color:"#475569", whiteSpace:"pre" }}>
            <span style={{ color:"#22c55e" }}>➜</span>
            <span style={{ color:"#94a3b8" }}> ts-node portfolio.ts</span>
          </div>
        )}
      </div>
      <style>{`@keyframes termCursor{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );
}

// ─── Desktop right-column: terminal → original heading ───────────────────────
function DesktopHeadingSection({ runKey }: { runKey: number }) {
  const [showOriginal, setShowOriginal] = useState(false);

  // Reset to terminal whenever a new scroll-in triggers
  useEffect(() => { setShowOriginal(false); }, [runKey]);

  return (
    <div className="mb-4">
      <AnimatePresence mode="wait">
        {!showOriginal ? (
          <motion.div
            key={`terminal-${runKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
          >
            <TerminalWithCallback runKey={runKey} onDone={() => setShowOriginal(true)} />
          </motion.div>
        ) : (
          <motion.div
            key={`heading-${runKey}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="heading mb-3">
              Hello! I&apos;m{" "}
              <span className="gradient-text">Muneeb Niaz</span>
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="role-badge">Software Engineer</span>
              <span className="role-badge" style={{ background: "var(--accent-primary)" }}>Back-End Developer</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Mobile centre-column: terminal → original heading ────────────────────────
function MobileHeadingSection({ runKey }: { runKey: number }) {
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => { setShowOriginal(false); }, [runKey]);

  return (
    <AnimatePresence mode="wait">
      {!showOriginal ? (
        <motion.div
          key={`terminal-mobile-${runKey}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="w-full mb-6"
        >
          <TerminalWithCallback small runKey={runKey} onDone={() => setShowOriginal(true)} />
        </motion.div>
      ) : (
        <motion.div
          key={`heading-mobile-${runKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full mb-6"
        >
          <h1 className="heading text-center lg:hidden mb-3">
            Hello! I&apos;m{" "}
            <span className="gradient-text">Muneeb Niaz</span>
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="role-badge">Software Engineer</span>
            <span className="role-badge" style={{ background: "var(--accent-primary)" }}>Full-Stack Dev</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────
const Hero = () => {
  const { ref: sectionRef, runKey } = useInViewRestart(0.25);
  const setRef = useCallback((node: HTMLElement | null) => { sectionRef.current = node; }, [sectionRef]);

  return (
    <section
      id="hero"
      ref={setRef}
      className="section section-light relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "calc(64px + 1.5rem)", paddingBottom: "var(--section-py)" }}
    >
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.18, 0.1, 0.18] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 right-20 w-[500px] h-[500px]"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)", filter: "blur(48px)" }}
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.12, 0.06, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-24 left-12 w-[380px] h-[380px]"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div className="absolute inset-0 dot-grid opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="available-badge">
            <span className="available-dot" />
            Available for New Projects
          </div>
        </motion.div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px_1fr] gap-8 lg:gap-12 items-center">

          {/* LEFT: Bio + contact */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25,0.1,0.25,1], delay: 0.3 }}
            className="hidden lg:flex flex-col gap-10"
          >
            <div>
              <p className="overline mb-3">Biography</p>
              <p className="label" style={{ lineHeight: 1.8 }}>
                Results-driven Software Engineer specializing in scalable back-end systems with strong Frontend expertise. Passionate about AI integration and evolving into a Full-Stack Developer. Software Engineering graduate from Bahria University, ready to deliver production-ready solutions.             </p>
            </div>
            <div>
              <p className="overline mb-3">Contact</p>
              <div className="flex flex-col gap-2">
                <a href="https://www.linkedin.com/in/muneeb-niaz-7295a8329/" target="_blank" rel="noopener noreferrer"
                  className="label flex items-center gap-2 transition-colors group" style={{ color: "var(--accent-primary)" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
                <a href="mailto:muneebniaz258@gmail.com" className="label flex items-center gap-2 transition-colors" style={{ color: "var(--accent-primary)" }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  muneebniaz258@gmail.com
                </a>
              </div>
            </div>
            <div>
              <p className="overline mb-3">Core Skills</p>
              <div className="flex flex-col gap-1.5">
                {["Full-Stack Development","Front-End Development","Back-End Development"].map(s => (
                  <div key={s} className="flex items-center gap-2 label">
                    <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "var(--accent-primary)" }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER: Image + mobile heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25,0.1,0.25,1], delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="lg:hidden w-full">
              <MobileHeadingSection runKey={runKey} />
            </div>
            <div className="relative w-full max-w-[300px] sm:max-w-[340px]"
              style={{ borderRadius:"0", overflow:"hidden", border:"1px solid rgba(99,102,241,0.2)", boxShadow:"0 0 60px rgba(99,102,241,0.18), 0 24px 48px rgba(0,0,0,0.4)" }}>
              <Image src="/sequence/bg.png" alt="Muneeb Niaz - Profile" width={400} height={500} className="w-full h-auto object-contain" priority />
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--background) 0%, transparent 100%)", opacity: 0.5 }} />
            </div>
          </motion.div>

          {/* RIGHT: terminal → heading + stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25,0.1,0.25,1], delay: 0.35 }}
            className="hidden lg:flex flex-col gap-3"
          >
            <DesktopHeadingSection runKey={runKey} />
            {stats.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                whileHover={{ y: -3, boxShadow: `0 16px 32px ${stat.color}28` }}
                className="card flex items-center justify-between px-5 py-4 cursor-pointer"
              >
                <span className="label text-xs uppercase tracking-widest font-medium" style={{ color: "var(--text-tertiary)" }}>{stat.label}</span>
                <span className="font-bold text-2xl" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile stats row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="lg:hidden grid grid-cols-2 gap-3 mt-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="card px-4 py-4 flex flex-col items-center gap-1">
              <span className="font-bold text-3xl" style={{ fontFamily: "var(--font-display)", color: stat.color }}>{stat.value}</span>
              <span className="text-center" style={{ fontSize: "var(--small-size)", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="label text-center max-w-3xl mx-auto mt-12" style={{ lineHeight: 1.85 }}
        >
          Software Engineer with a strong foundation in full-stack and back-end development, focused on building scalable,
          efficient, and user-centric applications. Experienced in Python, JavaScript, Django, modern web development
          practices, and AI tools. Looking to work with AI and further enhance skills in artificial intelligence.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="hero-cta-wrap flex flex-wrap justify-center gap-3 mt-8 px-4 sm:px-0"
        >
          <button className="btn-primary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
          <button className="btn-outline" onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}>
            View Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

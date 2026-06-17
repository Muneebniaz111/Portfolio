"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const education = [
  {
    title: "Bachelor of Software Engineering",
    institution: "Bahria University, Karachi",
    period: "June 2026",
    description: "Pursuing comprehensive software engineering degree with focus on full-stack development, data structures, and system design.",
  },
  {
    title: "Pre-Engineering",
    institution: "Bahria Model College, Majeed SRE",
    period: "2021",
    description: "",
  },
];

const certifications = [
  {
    title: "Meta Back-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    period: "Feb 2025 – Apr 2026",
    description: "Comprehensive 9-course program covering servers, databases, Python, Django, RESTful APIs, SQL, data structures, and full-stack capstone project.",
    link: "https://www.coursera.org/account/accomplishments/specialization/certificate/IDAZ5AW6WYNF",
  },
  {
    title: "React Basics",
    issuer: "Meta / Coursera",
    period: "Apr 2023 – May 2023",
    description: "Mastered React fundamentals including JSX, props, state, lifecycle methods, and component-based architecture.",
    link: "https://www.coursera.org/account/accomplishments/certificate/66P7VUYIWSD8",
  },
];

const skills: Record<string, { items: string[]; color: string }> = {
"Programming Languages": { color: "#6366f1", items: ["Python", "JavaScript", "HTML5", "CSS3", "SQL", "C#", "Java", "PHP"] },
"Frameworks & Libraries": { color: "#22d3ee", items: ["React.js", "Next.js", "Django", "Bootstrap", "Tailwind CSS", "Chart.js", "Recharts", ".NET (ASP.NET Core)", "Node.js"] },
"Database Management": { color: "#a78bfa", items: ["MySQL", "MongoDB", "PostgreSQL", "SQL Server", "Database Design"] },
"Version Control": { color: "#4ade80", items: ["Git", "GitHub"] },
"Tools & Platforms": { color: "#fb923c", items: ["Visual Studio Code", "Visual Studio", "Google Colab", "Jupyter Notebook", "Figma", "Linux", "Bash", "Agile"] },
"Data & AI Tools": { color: "#f472b6", items: ["TensorFlow", "NumPy", "Pandas", "Pillow", "LLMs", "Machine Learning", "NLP"] },
"Specializations": { color: "#34d399", items: ["RESTful APIs", "MVC Architecture", "Responsive Web Design", "Data Visualization", "Back-End Development", "Front-End Development", "API Design", "Deep Learning", "CNN / Image Classification", "System Design"] },
};

const contact = {
  phone: ["+92-311-5445737", "+92-300-3450384 (WA)"],
  email: "muneebniaz258@gmail.com",
  linkedin: "https://www.linkedin.com/in/muneeb-niaz-7295a8329/",
  github: "https://github.com/Muneebniaz111",
  location: "Karachi, Pakistan",
};

const resumeContent = {
  summary: "Junior Backend Developer and Full Stack Developer with 1 year of freelance experience and a .NET internship at MidsOnline, Karachi — building production-grade apps across finance, healthcare, and education. Skilled in React.js, Django, Python, REST APIs, FastAPI, and ASP.NET Core, with proven AI/ML delivery: a CNN eye disease classifier at 90%+ accuracy, an HBL Car Loan Calculator with AI-driven forecasting, and an AI-Powered Car Image Background Replacement System built with .NET Web API and AI image processing workflows. Meta Back-End Developer certified (Coursera, 9 courses). BSE finalist at Bahria University, Karachi (June 2026). Open to Backend, Full Stack, and AI/ML roles — on-site (Karachi / Islamabad / Lahore) or remote.",
  highlights: [
    "90%+ CNN validation accuracy on a 5,000+ image medical dataset using TensorFlow/Keras — deployed via Flask REST API with sub-2-second inference.",
    "Delivered 5+ production-grade applications across finance, healthcare, and education using React.js, Django, Flask, and ASP.NET Core.",
    "Built an AI-Powered Car Image Background Replacement System at MidsOnline using .NET Web API — integrating vehicle detection, background removal, and AI-generated dealership-ready backgrounds for automotive marketing workflows.",
  ],
  experience: [
    {
      title: ".Net Developer Intern",
      company: "MidsOnline, Karachi",
      period: "1-May 2026 – 15-June 2026",
      bullets: [
        "Developed and maintained ASP.NET Core web application modules, contributing to backend features and bug fixes across multiple service layers.",
        "Wrote and optimized SQL Server queries and stored procedures to support data retrieval and reporting requirements, improving data access efficiency for core application workflows.",
        "Collaborated with the development team under Agile practices to deliver sprint tasks on schedule, gaining hands-on exposure to .NET MVC architecture, C# business logic, and RESTful service integration.",
      ],
    },
    {
      title: "Backend Developer Intern",
      company: "Rizq Tech, Karachi",
      period: "Dec 2025 – Feb 2026",
      bullets: [
        "Built and maintained 10+ RESTful API endpoints using PHP/Laravel, reducing data-exchange latency ~30% while integrating backend services with React.js frontend clients.",
        "Optimized 3+ MySQL schemas cutting query speed ~25%; implemented JWT authentication with role-based access control — writing clean, scalable code following Laravel MVC architecture.",
      ],
    },
    {
      title: "Freelance Full Stack Developer",
      company: "Self-Employed",
      period: "May 2025 - Present",
      bullets: [
        "Designed and delivered 5+ full-stack web applications across finance, healthcare, and education using React.js, Django, Flask, ASP.NET Core, and MySQL — including an HBL Car Loan Calculator with a real-time EMI engine and a React.js analytics dashboard tracking 6 live metrics across 3 responsive breakpoints.",
        "Built a CNN-based eye disease classifier at 90%+ validation accuracy using TensorFlow/Keras on a 5,000+ image dataset, deployed via a Python/Flask REST API with sub-2-second inference.",
        "Engineered FinLedger, a Java/MySQL desktop finance app, and developed RESTful backend services in ASP.NET Core with jBCrypt authentication, role-based access control, and MVC architecture.",
      ],
    },
  ],
  technicalSkills: {
    "Languages": "Python, JavaScript, TypeScript, HTML5, CSS3, SQL, Java",
    "Frameworks & Libraries": "React.js, Next.js, Django, Flask, FastAPI, ASP.NET Core, Bootstrap, Chart.js, Node.js",
    "Databases": "MySQL, PostgreSQL, MongoDB",
    "AI / Data": "TensorFlow, Keras, CNN, RNN, NumPy, Pandas, Pillow",
    "DevOps & Tools": "Git, GitHub, GitHub Actions, Docker, Figma, VS Code, Google Colab, Jupyter",
    "Methodologies": "Agile, Scrum, MVC Architecture, OOP, SDLC, RESTful API Design",
  },
};

const projects = [
  {
    title: "HBL Car Loan Calculator",
    category: "Financial Tool",
    accent: "#6366f1",
    problem: "Car buyers lacked a transparent way to compare financing scenarios before committing to a loan — standard bank tools showed one static EMI with no insight into how rates could shift.",
    built: "Built a browser-based loan simulation tool for HBL car financing with real-time EMI computation, AI-driven forecast charts, and downloadable PDF summaries.",
    result: "Enables side-by-side comparison of 3 interest trajectories with sub-100ms chart updates and one-click PDF export.",
    tech: "HTML, CSS, JavaScript, Chart.js, jsPDF",
  },
  {
    title: "Eye Disease Classification",
    category: "AI & Deep Learning",
    accent: "#22d3ee",
    problem: "Clinics in under-resourced settings struggle with early diagnosis of 4 common retinal diseases — delayed detection leads to preventable vision loss.",
    built: "Built a diagnostic web tool classifying Diabetic Retinopathy, Glaucoma, Cataracts, and Normal retinas from uploaded fundus images — deployable in any browser.",
    result: "Achieved 90%+ accuracy on 5,000+ images; Flask API delivers inference in under 2 seconds without GPU hardware.",
    tech: "Python, TensorFlow, Flask, NumPy, Pillow",
  },
  {
    title: "Analytics Dashboard",
    category: "Data Visualization",
    accent: "#8b5cf6",
    problem: "Marketing teams had no unified view of web performance — bounce rate, session length, and traffic sources were scattered across spreadsheets.",
    built: "Built a React analytics dashboard consolidating KPIs into a single live interface with composable chart components.",
    result: "Reduces reporting time and enables non-technical stakeholders to self-serve performance snapshots.",
    tech: "React.js, Recharts, JavaScript ES6+, CSS3",
  },
  {
    title: "Career & Counseling Portal",
    category: "Educational Platform",
    accent: "#4ade80",
    problem: "Students had no structured way to explore career paths or book counseling sessions — guidance was informal and inaccessible outside office hours.",
    built: "Built a full-stack portal for career exploration, appointment scheduling, and resource access — with role-based admin management.",
    result: "Centralised guidance for an entire student cohort, replacing ad-hoc email coordination with a trackable appointment system.",
    tech: "HTML, CSS, PHP, MySQL",
  },
  {
    title: "FinLedger",
    category: "Digital Wallet System",
    accent: "#f97316",
    problem: "Users lacked a secure, comprehensive platform to manage multiple wallets, process transactions, and track financial history — existing solutions were fragmented and lacked robust administrative controls.",
    built: "Built a Java-based digital wallet and financial management system with secure authentication, multi-wallet support, real-time transaction processing, and an administrative dashboard.",
    result: "Delivers secure user management, seamless wallet operations, real-time transaction tracking with refund capabilities, and comprehensive admin controls.",
    tech: "Java, NetBeans, Payment Gateway, User Authentication, Database",
  },
  {
    title: "Blockchain CMS",
    category: "Blockchain & Web3",
    accent: "#a78bfa",
    problem: "Traditional CMS platforms rely on centralised databases, making them vulnerable to censorship, data tampering, and single points of failure — with no verifiable content authenticity.",
    built: "Built a blockchain-based CMS leveraging decentralised storage and smart contracts to ensure immutable content records, transparent versioning, and tamper-proof publishing workflows.",
    result: "Provides verifiable content authenticity, eliminates centralised control risks, and enables trustless collaboration with on-chain audit trails for every content change.",
    tech: "Blockchain, Smart Contracts, Web3, Solidity, IPFS",
  },
];

const tabs = [
  { id: "education",       label: "Education",      icon: "🎓" },
  { id: "certifications",  label: "Certifications", icon: "🏆" },
  { id: "skills",          label: "Skills",         icon: "⚡" },
  { id: "projects",        label: "Projects",       icon: "🛠" },
  { id: "contact",         label: "Contact",        icon: "📬" },
  { id: "resume",          label: "Resume",         icon: "📄" },
];

// ── OTP modal state machine ───────────────────────────────────────────────────
type OtpStep = "idle" | "sending" | "enter_code" | "verifying" | "verified";

export default function Resume() {
  const [activeTab, setActiveTab] = useState("education");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFileUrl, setResumeFileUrl]   = useState("");
  const [uploadError, setUploadError]       = useState("");
  const [uploadSuccess, setUploadSuccess]   = useState(false);
  const [uploading, setUploading]           = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP state
  const [showOtpModal, setShowOtpModal]   = useState(false);
  const [otpStep, setOtpStep]             = useState<OtpStep>("idle");
  const [otpCode, setOtpCode]             = useState("");
  const [otpError, setOtpError]           = useState("");
  const [uploadToken, setUploadToken]     = useState(""); // token issued after OTP success
  const uploadTokenRef = useRef("");       // ref copy so it's accessible inside onChange

  // Countdown timer for OTP resend
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkResumeExists = async () => {
      try {
        const res  = await fetch("/api/resume-upload");
        const data = await res.json();
        if (res.ok && data.exists) {
          setResumeFileUrl("/api/resume-download");
          setResumeFileName(data.originalName || "resume.pdf");
        }
      } catch { /* no resume yet */ }
    };
    checkResumeExists();
  }, []);

  // Keep ref in sync with state
  useEffect(() => { uploadTokenRef.current = uploadToken; }, [uploadToken]);

  // Cleanup countdown on unmount
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  // ── Upload PDF after OTP verified ─────────────────────────────────────────
  const validateAndUploadResume = async (file: File, token: string) => {
    setUploadError("");
    setUploadSuccess(false);
    setUploading(true);

    console.log("[Resume Upload Client] Starting upload with token:", token ? `${token.substring(0, 20)}...` : "MISSING");

    const isPdf = file.type === "application/pdf" ||
                  file.type === "application/octet-stream" ||
                  file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) { 
      const err = "Please upload a PDF file (.pdf)"; 
      setUploadError(err); 
      console.error("[Resume Upload Client]", err);
      setUploading(false); 
      return; 
    }
    if (file.size > 5 * 1024 * 1024) { 
      const err = "File size must be less than 5MB"; 
      setUploadError(err); 
      console.error("[Resume Upload Client]", err);
      setUploading(false); 
      return; 
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadToken", token);

      console.log("[Resume Upload Client] Sending upload request with token");

      const response = await fetch("/api/resume-upload", { method: "POST", body: formData });
      const data     = await response.json();

      console.log("[Resume Upload Client] Response status:", response.status, "Data:", data);

      if (response.ok && data.success) {
        console.log("[Resume Upload Client] Upload successful");
        setResumeFileName(data.fileName);
        setResumeFileUrl("/api/resume-download");
        setUploadSuccess(true);
        setUploadToken("");
        uploadTokenRef.current = "";
        setTimeout(() => setUploadSuccess(false), 4000);
      } else {
        const err = data.error || "Failed to upload resume";
        console.error("[Resume Upload Client] Upload failed:", err);
        setUploadError(err);
      }
    } catch (e) {
      const err = "Error uploading file. Please try again.";
      console.error("[Resume Upload Client] Network error:", e);
      setUploadError(err);
    } finally {
      setUploading(false);
    }
  };

  // ── OTP: send ─────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    setOtpError("");
    setOtpStep("sending");
    try {
      console.log("[OTP] Sending OTP request");
      const res  = await fetch("/api/resume-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });
      const data = await res.json();
      console.log("[OTP] Send response:", res.status, data);
      if (res.ok && data.success) {
        console.log("[OTP] OTP sent successfully");
        setOtpStep("enter_code");
        setOtpCode("");
        // 60-second resend cooldown
        setResendCountdown(60);
        countdownRef.current = setInterval(() => {
          setResendCountdown(c => {
            if (c <= 1) { clearInterval(countdownRef.current!); return 0; }
            return c - 1;
          });
        }, 1000);
      } else {
        console.error("[OTP] Failed to send OTP:", data.error);
        setOtpError(data.error || "Failed to send OTP. Please try again.");
        setOtpStep("idle");
      }
    } catch (e) {
      console.error("[OTP] Network error:", e);
      setOtpError("Connection error. Please try again.");
      setOtpStep("idle");
    }
  };

  // ── OTP: verify ───────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length < 6) {
      setOtpError("Please enter the 6-digit code sent to your email.");
      return;
    }
    setOtpError("");
    setOtpStep("verifying");
    try {
      console.log("[OTP] Verifying code:", otpCode);
      const res  = await fetch("/api/resume-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code: otpCode.trim() }),
      });
      const data = await res.json();
      console.log("[OTP] Verification response:", res.status, { success: data.success, hasToken: !!data.uploadToken });
      
      if (res.ok && data.success && data.uploadToken) {
        console.log("[OTP] Verification successful, token received:", `${data.uploadToken.substring(0, 20)}...`);
        setUploadToken(data.uploadToken);
        uploadTokenRef.current = data.uploadToken;
        setOtpStep("verified");
        // Close modal after brief success display, then open file picker
        setTimeout(() => {
          setShowOtpModal(false);
          setOtpStep("idle");
          setOtpCode("");
          setTimeout(() => {
            console.log("[OTP] Opening file picker with token:", `${uploadTokenRef.current.substring(0, 20)}...`);
            fileInputRef.current?.click();
          }, 100);
        }, 1200);
      } else {
        console.error("[OTP] Verification failed:", data.error);
        setOtpError(data.error || "Invalid code. Please try again.");
        setOtpStep("enter_code");
      }
    } catch (e) {
      console.error("[OTP] Network error:", e);
      setOtpError("Connection error. Please try again.");
      setOtpStep("enter_code");
    }
  };

  // ── Open update flow ──────────────────────────────────────────────────────
  const handleUpdateResumeClick = () => {
    // If we already have a valid token from this session, go straight to picker
    if (uploadTokenRef.current) {
      fileInputRef.current?.click();
      return;
    }
    setOtpError("");
    setOtpCode("");
    setOtpStep("idle");
    setShowOtpModal(true);
  };

  const closeOtpModal = () => {
    if (otpStep === "sending" || otpStep === "verifying") return; // block close during async
    setShowOtpModal(false);
    setOtpStep("idle");
    setOtpCode("");
    setOtpError("");
  };

  // ── OTP input — digits only, max 6 ────────────────────────────────────────
  const handleOtpInput = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setOtpCode(digits);
    setOtpError("");
  };

  return (
    <section id="resume" className="section section-dark relative z-20" style={{ borderTop: "1px solid var(--border-color)" }}>
      <div className="max-w-[1280px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8 sm:mb-12">
          <h2 className="heading">Resume &amp; Details</h2>
          <p className="label mt-3">Education, certifications, and comprehensive skill set</p>
        </motion.div>

        {/* Tab bar */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="flex gap-1 mb-10 p-1 overflow-x-auto flex-nowrap sm:flex-wrap scrollbar-none"
          style={{ background: "var(--surface)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                background: activeTab === tab.id ? "var(--surface-lighter)" : "transparent",
                color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-tertiary)",
                boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.25)" : "none",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="tabIndicator" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5" style={{ background: "var(--accent-primary)" }} />
              )}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>

            {/* Education */}
            {activeTab === "education" && (
              <div className="space-y-5">
                {education.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="card p-5 sm:p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                      <div>
                        <h3 className="subheading text-xl mb-1">{item.title}</h3>
                        <p className="label" style={{ color: "var(--accent-primary)" }}>{item.institution}</p>
                      </div>
                      <span className="tag self-start">{item.period}</span>
                    </div>
                    {item.description && <p className="label">{item.description}</p>}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {activeTab === "certifications" && (
              <div className="space-y-5">
                {certifications.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="card p-5 sm:p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                      <div>
                        <h3 className="subheading text-xl mb-1">{item.title}</h3>
                        <p className="label" style={{ color: "var(--accent-primary)" }}>{item.issuer}</p>
                      </div>
                      <span className="tag self-start whitespace-nowrap">{item.period}</span>
                    </div>
                    <p className="label mb-5">{item.description}</p>
                    <a href={item.link} target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">View Certificate →</a>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Skills */}
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(skills).map(([cat, { color, items }], i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-6">
                    <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: `1px solid ${color}25` }}>
                      <span className="w-2 h-2 flex-shrink-0" style={{ background: color }} />
                      <h3 className="overline" style={{ color }}>{cat}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, si) => (
                        <motion.span key={si} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: si * 0.03 }}
                          className="text-xs font-medium px-3 py-1.5 cursor-default"
                          style={{ background: `${color}10`, color: "var(--text-secondary)", border: `1px solid ${color}28`, transition: "background 0.2s, color 0.2s" }}
                          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}22`; el.style.color = color; }}
                          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}10`; el.style.color = "var(--text-secondary)"; }}
                        >{skill}</motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Contact */}
            {activeTab === "contact" && (
              <div className="card p-5 sm:p-8 max-w-2xl">
                <h3 className="subheading text-xl mb-7">Get in Touch</h3>
                <div className="space-y-6">
                  {[
                    { label: "Location", content: <p className="label" style={{ color: "var(--text-primary)" }}>{contact.location}</p> },
                    { label: "Email", content: <a href={`mailto:${contact.email}`} className="label" style={{ color: "var(--accent-primary)" }}>{contact.email}</a> },
                    { label: "Phone", content: <div>{contact.phone.map((p,i) => <a key={i} href={`tel:${p}`} className="block label" style={{ color: "var(--accent-primary)" }}>{p}</a>)}</div> },
                    { label: "Social", content: (
                      <div className="flex gap-3">
                        <a href={contact.linkedin} target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">LinkedIn</a>
                        <a href={contact.github} target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">GitHub</a>
                      </div>
                    )},
                  ].map(({ label, content }) => (
                    <div key={label}>
                      <p className="overline mb-2">{label}</p>
                      {content}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {activeTab === "projects" && (
              <div className="space-y-5">
                {projects.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="card p-5 sm:p-7">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="subheading text-xl mb-1">{p.title}</h3>
                        <span className="tag text-xs" style={{ borderColor: `${p.accent}40`, color: p.accent, background: `${p.accent}12` }}>{p.category}</span>
                      </div>
                    </div>
                    <div className="space-y-3 mb-4">
                      {[
                        { label: "Problem", text: p.problem },
                        { label: "Built",   text: p.built   },
                        { label: "Result",  text: p.result  },
                      ].map(({ label, text }) => (
                        <div key={label}>
                          <span className="inline-block text-xs font-bold uppercase tracking-widest mb-1 px-2 py-0.5"
                            style={{ color: p.accent, background: `${p.accent}12`, border: `1px solid ${p.accent}25` }}>
                            {label}
                          </span>
                          <p className="label text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                      {p.tech.split(", ").map((t, ti) => <span key={ti} className="tag">{t}</span>)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Resume */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                {/* Professional Summary */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="card p-5 sm:p-7">
                  <h3 className="subheading text-lg mb-3">Professional Summary</h3>
                  <p className="label text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {resumeContent.summary}
                  </p>
                </motion.div>

                {/* Key Highlights */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 sm:p-7">
                  <h3 className="subheading text-lg mb-4">Key Highlights</h3>
                  <div className="space-y-3">
                    {resumeContent.highlights.map((highlight, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-accent-primary text-lg flex-shrink-0">•</span>
                        <p className="label text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{highlight}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Experience */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 sm:p-7">
                  <h3 className="subheading text-lg mb-4">Experience</h3>
                  <div className="space-y-6">
                    {resumeContent.experience.map((exp, i) => (
                      <div key={i} className={i !== 0 ? "border-t pt-6" : ""} style={i !== 0 ? { borderColor: "var(--border-color)" } : {}}>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                          <div>
                            <h4 className="label font-semibold" style={{ color: "var(--accent-primary)" }}>{exp.title}</h4>
                            <p className="label text-sm">{exp.company}</p>
                          </div>
                          <span className="tag text-xs whitespace-nowrap">{exp.period}</span>
                        </div>
                        <ul className="space-y-2 mt-3">
                          {exp.bullets.map((bullet, bi) => (
                            <li key={bi} className="flex gap-2">
                              <span className="text-accent-primary flex-shrink-0">◆</span>
                              <p className="label text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{bullet}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Technical Skills */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5 sm:p-7">
                  <h3 className="subheading text-lg mb-4">Technical Skills</h3>
                  <div className="space-y-3">
                    {Object.entries(resumeContent.technicalSkills).map(([category, skills], i) => (
                      <div key={i}>
                        <p className="overline text-xs mb-1.5" style={{ color: "var(--accent-primary)" }}>{category}</p>
                        <p className="label text-sm" style={{ color: "var(--text-secondary)" }}>{skills}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Resume PDF Upload Section */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5 sm:p-7">
                  <h3 className="subheading text-lg mb-4">Resume PDF</h3>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        if (!uploadTokenRef.current) {
                          console.error("[Resume Upload] No token available");
                          setUploadError("Session expired. Please verify OTP again.");
                          e.target.value = "";
                          return;
                        }
                        validateAndUploadResume(e.target.files[0], uploadTokenRef.current);
                        // Reset input so the same file can be re-selected if needed
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />

                  {uploadError && (
                    <div className="mb-4 p-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}>
                      {uploadError}
                    </div>
                  )}
                  {uploadSuccess && (
                    <div className="mb-4 p-3 text-sm" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                      ✓ Resume uploaded successfully and is now live everywhere!
                    </div>
                  )}
                  {uploading && !uploadError && (
                    <div className="mb-4 p-3 text-sm" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "rgb(147,149,255)" }}>
                      Uploading your resume to the server...
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="overline mb-2">File Status</p>
                    {resumeFileName ? (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2" style={{ background: "var(--accent-green)" }} />
                        <p className="label text-sm" style={{ color: "var(--text-primary)" }}>{resumeFileName}</p>
                      </div>
                    ) : (
                      <p className="label text-sm">No resume uploaded yet</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn-primary text-xs py-2 px-4"
                      onClick={() => {
                        window.open("/api/resume-download", "_blank", "noopener,noreferrer");
                      }}
                    >
                      Download Resume
                    </button>

                    <button
                      className="btn-outline text-xs py-2 px-4 flex items-center gap-2"
                      onClick={handleUpdateResumeClick}
                      disabled={uploading}
                      style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "not-allowed" : "pointer" }}
                    >
                      {uploading ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                          </svg>
                          Update Resume
                        </>
                      )}
                    </button>
                  </div>

                  <p className="label mt-3" style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                    🔒 Resume updates require OTP verification sent to your email
                  </p>
                </motion.div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── OTP Modal ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            onClick={e => { if (e.target === e.currentTarget) closeOtpModal(); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.22 }}
              className="card p-6 sm:p-8 w-full max-w-sm mx-4"
              style={{ border: "1px solid rgba(99,102,241,0.3)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--accent-primary)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="subheading" style={{ fontSize: "18px" }}>OTP Verification</h3>
                  <p className="label" style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                    {otpStep === "idle"        && "Verify your identity to update the resume"}
                    {otpStep === "sending"     && "Sending verification code…"}
                    {otpStep === "enter_code"  && "Enter the code sent to your email"}
                    {otpStep === "verifying"   && "Verifying code…"}
                    {otpStep === "verified"    && "✓ Verified! Opening file picker…"}
                  </p>
                </div>
              </div>

              {/* Error banner */}
              {otpError && (
                <div className="mb-4 p-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171" }}>
                  {otpError}
                </div>
              )}

              {/* Success state */}
              {otpStep === "verified" && (
                <div className="mb-4 p-3 text-sm text-center" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                  ✓ Identity verified successfully
                </div>
              )}

              {/* Idle: explain & send button */}
              {otpStep === "idle" && (
                <>
                  <p className="label mb-5" style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                    A 6-digit verification code will be sent to{" "}
                    <span style={{ color: "var(--accent-primary)" }}>muneebniaz258@gmail.com</span>.
                    Enter it here to proceed with the upload.
                  </p>
                  <div className="flex gap-3">
                    <button onClick={handleSendOtp} className="btn-primary text-xs py-2.5 px-5 flex-1 justify-center">
                      Send OTP to Email
                    </button>
                    <button onClick={closeOtpModal} className="btn-outline text-xs py-2.5 px-4">Cancel</button>
                  </div>
                </>
              )}

              {/* Sending spinner */}
              {otpStep === "sending" && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--accent-primary)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  <span className="label" style={{ fontSize: "13px" }}>Sending code to your email…</span>
                </div>
              )}

              {/* Enter code */}
              {otpStep === "enter_code" && (
                <>
                  <div className="mb-5">
                    <label className="overline block mb-2">Verification Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={e => handleOtpInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && otpCode.length === 6) handleVerifyOtp(); }}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      className="w-full px-4 py-3 text-center text-2xl tracking-[0.4em] font-mono outline-none transition-all"
                      style={{
                        background: "var(--surface-lighter)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        letterSpacing: "0.5em",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border-color)")}
                    />
                    <p className="label mt-2" style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                      Code expires in 10 minutes. Check your inbox (and spam folder).
                    </p>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpCode.length < 6}
                      className="btn-primary text-xs py-2.5 px-5 flex-1 justify-center"
                      style={{ opacity: otpCode.length < 6 ? 0.5 : 1 }}
                    >
                      Verify Code
                    </button>
                    <button onClick={closeOtpModal} className="btn-outline text-xs py-2.5 px-4">Cancel</button>
                  </div>
                  {/* Resend */}
                  <div className="text-center">
                    {resendCountdown > 0 ? (
                      <p className="label" style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                        Resend available in {resendCountdown}s
                      </p>
                    ) : (
                      <button
                        onClick={() => { setOtpStep("idle"); setOtpCode(""); setOtpError(""); handleSendOtp(); }}
                        className="label underline"
                        style={{ fontSize: "11px", color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer" }}
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Verifying spinner */}
              {otpStep === "verifying" && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--accent-primary)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  <span className="label" style={{ fontSize: "13px" }}>Verifying…</span>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "HBL Car Loan Calculator",
    category: "Financial Tool",
    number: "01",
    problem: "Car buyers lacked a transparent way to compare financing scenarios — standard bank tools showed one static EMI with no insight into how rates could shift over time.",
    built: "Built a browser-based loan simulation tool for HBL car financing with real-time EMI computation, AI-driven forecast charts, and downloadable PDF summaries.",
    result: "Enables side-by-side comparison of 3 interest trajectories (static, increasing, decreasing) with sub-100ms chart updates and one-click PDF export for offline reference.",
    tech: ["HTML", "CSS", "JavaScript", "Chart.js", "jsPDF"],
    image: "/projects/hbl-calculator.png",
    accent: "#ffbb00",
  },
  {
    title: "Eye Disease Classification",
    category: "AI & Deep Learning",
    number: "02",
    problem: "Ophthalmology clinics in under-resourced settings struggle with early diagnosis of 4 common retinal diseases — delayed detection leads to preventable vision loss.",
    built: "Built a diagnostic web tool classifying Diabetic Retinopathy, Glaucoma, Cataracts, and Normal retinas from uploaded fundus images, deployable in any browser without GPU hardware.",
    result: "Achieved 90%+ accuracy across all 4 disease classes on a 5,000+ image dataset — live inference via a lightweight Flask API delivers results in under 2 seconds.",
    tech: ["Python", "TensorFlow", "Flask", "NumPy", "Pillow"],
    image: "/projects/eye-disease.png",
    accent: "#22d3ee",
  },
  {
    title: "Analytics Dashboard",
    category: "Data Visualization",
    number: "03",
    problem: "Marketing teams without dedicated BI tools had no unified view of web performance — metrics like bounce rate, session length, and traffic sources were scattered across spreadsheets.",
    built: "Built a React analytics dashboard consolidating website KPIs into a single live interface — visits, demographics, traffic sources, and trend lines all in one composable view.",
    result: "Reduces reporting time and enables non-technical stakeholders to self-serve full site performance snapshots without needing analyst support.",
    tech: ["React.js", "Recharts", "JavaScript ES6+", "CSS3"],
    image: "/projects/analytics-dashboard.png",
    accent: "#0579fd",
  },
  {
    title: "Career & Counseling Portal",
    category: "Educational Platform",
    number: "04",
    problem: "University students had no structured way to explore career paths or book counseling sessions — guidance was informal, untracked, and inaccessible outside office hours.",
    built: "Built a full-stack portal where students browse career tracks, schedule counseling appointments, and access curated resources — with role-based admin management.",
    result: "Centralised career guidance for an entire student cohort, replacing ad-hoc email coordination with a trackable, searchable appointment system.",
    tech: ["HTML", "CSS", "PHP", "MySQL"],
    image: "/projects/career-portal.png",
    accent: "#4ade80",
  },
  {
    title: "FinLedger",
    category: "Digital Wallet System",
    number: "05",
    problem: "Users lacked a secure, comprehensive platform to manage multiple wallets, process transactions, and track financial history — existing solutions were fragmented and lacked robust administrative controls.",
    built: "Built a Java-based digital wallet and financial management system in NetBeans with secure authentication, multi-wallet support, real-time transaction processing, integrated payment gateway, and administrative dashboard for system monitoring.",
    result: "Delivers secure user management, seamless wallet operations across departments, real-time transaction tracking with refund capabilities, and comprehensive admin controls for staff and system monitoring.",
    tech: ["Java", "NetBeans", "Payment Gateway", "User Authentication", "Database"],
    image: "/projects/FinLedger.png",
    accent: "#f97316",
  },
  {
    title: "Blockchain CMS",
    category: "Blockchain & Web3",
    number: "06",
    problem: "Traditional content management systems rely on centralised databases, making them vulnerable to censorship, data tampering, and single points of failure — with no verifiable content authenticity.",
    built: "Built a blockchain-based CMS leveraging decentralised storage and smart contracts to ensure immutable content records, transparent versioning, and tamper-proof publishing workflows.",
    result: "Provides verifiable content authenticity, eliminates centralised control risks, and enables trustless collaboration with on-chain audit trails for every content change.",
    tech: ["Blockchain", "Smart Contracts", "Web3", "Solidity", "IPFS"],
    image: "/projects/Blockchain.jpg",
    accent: "#9F1239",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="section section-light relative z-20">
      <div className="max-w-[1280px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10 sm:mb-14">
          <h2 className="heading">Projects</h2>
          <p className="label mt-3" style={{ color: "var(--text-secondary)" }}>Real problems solved — not just a list of tools used.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden flex flex-col"
              style={{
                border: "1px solid var(--border-color)",
                background: "var(--surface)",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              whileHover={{ y: -4 }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${project.accent}50`;
                el.style.boxShadow = `0 20px 60px ${project.accent}22`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-color)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div className="relative w-full overflow-hidden h-40 sm:h-48 md:h-52"
                style={{ background: `${project.accent}15` }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: 0.85 }}
                  onError={(e) => {
                    // If image fails to load, show a gradient placeholder
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, transparent 40%, var(--surface) 100%)` }}
                />
                <div className="absolute top-4 right-4 font-bold text-4xl select-none"
                  style={{ fontFamily: "var(--font-display)", color: `${project.accent}30`, lineHeight: 1 }}>
                  {project.number}
                </div>
                <div className="absolute top-4 left-4">
                  <span className="tag text-xs" style={{ borderColor: `${project.accent}40`, color: project.accent, background: `${project.accent}15` }}>
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 sm:p-6 pt-3 sm:pt-4">
                <h3 className="subheading mb-4" style={{ fontSize: "clamp(17px,2vw,21px)" }}>{project.title}</h3>

                <div className="space-y-3 flex-1 mb-5">
                  {[
                    { label: "Problem", text: project.problem },
                    { label: "Built", text: project.built },
                    { label: "Result", text: project.result },
                  ].map(({ label, text }) => (
                    <div key={label}>
                      <span className="inline-block text-xs font-bold uppercase tracking-widest mb-1 px-2 py-0.5"
                        style={{ color: project.accent, background: `${project.accent}12`, border: `1px solid ${project.accent}25` }}>
                        {label}
                      </span>
                      <p className="label text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>{text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
                  {project.tech.map((t, ti) => (
                    <span key={ti} className="text-xs px-2.5 py-1 font-medium"
                      style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

interface ExperienceEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

const ExperienceTimeline = () => {
  // Experience data sorted chronologically (oldest to newest)
  const experiences: ExperienceEntry[] = [
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
    {
      title: "Backend Developer Intern",
      company: "Rizq Tech, Karachi",
      period: "Dec 2025 – Feb 2026",
      bullets: [
        "Built and maintained 10+ RESTful API endpoints using PHP/Laravel, reducing data-exchange latency ~30% while integrating backend services with React.js frontend clients.",
        "Optimized 3+ MySQL schemas cutting query speed ~25%; implemented JWT authentication with role-based access control — writing clean, scalable code following Laravel MVC architecture.",
        "Debugged and resolved complex backend issues, implementing comprehensive error handling and logging mechanisms to improve application stability and reduce production incidents.",
      ],
    },
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
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="experience"
      className="section section-light relative z-20"
      style={{
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8 sm:mb-12"
        >
          <h2 className="heading">Professional Experience</h2>
          <p className="label" style={{ color: "var(--text-secondary)", marginTop: "12px" }}>
            A chronological overview of my professional journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="space-y-8"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative pl-8"
            >
              {/* Timeline dot */}
              <div
                className="absolute left-0 top-0 w-4 h-4 rounded-full border-4 shadow-lg"
                style={{
                  background: "var(--accent-primary)",
                  borderColor: "var(--background)",
                  boxShadow: "0 0 0 2px var(--accent-glow), inset 0 0 8px var(--accent-primary)",
                }}
              ></div>

              {/* Timeline line (not on last item) */}
              {index < experiences.length - 1 && (
                <div
                  className="absolute left-1.5 top-6 bottom-0 w-1"
                  style={{
                    background: "linear-gradient(180deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)",
                    opacity: 0.3,
                  }}
                ></div>
              )}

              {/* Experience card */}
              <motion.div
                className="rounded-lg p-6 transition-all duration-300"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-color)",
                }}
                whileHover={{ y: -4 }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--accent-primary)";
                  el.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-color)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                  <h3
                    className="title"
                    style={{
                      color: "var(--text-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {exp.title}
                  </h3>
                </div>

                <p
                  className="label"
                  style={{
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {exp.company}
                </p>

                <p
                  className="label"
                  style={{
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    marginBottom: "16px",
                  }}
                >
                  {exp.period}
                  {exp.period.includes("Present") && (
                    <span
                      style={{
                        marginLeft: "12px",
                        display: "inline-block",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        background: "var(--accent-green)",
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Active
                    </span>
                  )}
                </p>

                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: bulletIndex < exp.bullets.length - 1 ? "12px" : "0",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent-primary)",
                          fontWeight: 700,
                          marginTop: "4px",
                          flexShrink: 0,
                        }}
                      >
                        •
                      </span>
                      <span
                        style={{
                          color: "var(--text-secondary)",
                          lineHeight: "1.6",
                          fontSize: "var(--label-size)",
                        }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;

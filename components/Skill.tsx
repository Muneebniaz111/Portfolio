"use client";

import { motion } from "framer-motion";

const skillCategories = [
  {
    name: "Frontend",
    color: "#22d3ee",
    icon: "◈",
    skills: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Bootstrap", "Responsive Design", "Tailwind CSS"],
  },
  {
    name: "Backend",
    color: "#fb923c",
    icon: "◉",
    skills: ["Python", "Django", "Node.js", "ASP.NET Core", "Java", "C#", "PHP", "RESTful APIs", "MVC Architecture"],
  },
  {
    name: "Database",
    color: "#a78bfa",
    icon: "◆",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "SQL Server", "Database Design"],
  },
  {
    name: "DevOps & Tools",
    color: "#4ade80",
    icon: "◎",
    skills: ["Git", "GitHub", "Linux", "Bash", "Agile", "VS Code", "Figma", "Jupyter Notebook", "Google Colab"],
  },
  {
    name: "Data & AI",
    color: "#f472b6",
    icon: "◇",
    skills: ["TensorFlow", "NumPy", "Pandas", "Pillow", "Chart.js", "Recharts", "Data Visualization", "LLMs", "ML", "NLP"],
  },
  {
    name: "Specializations",
    color: "#6366f1",
    icon: "★",
    skills: ["Back-End Developer", "Front-End Developer", "API Design", "Deep Learning", "CNN / Image Classification", "System Design", "Data Visualization"],
  },
];

export default function Experience() {
  return (
    <section id="skills" className="section section-light relative z-20" style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
      <div className="max-w-[1280px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8 sm:mb-12">
          
          <h2 className="heading">Technical Skills</h2>
          <p className="label mt-3" style={{ color: "var(--text-secondary)" }}>
            Technologies grouped by domain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: ci * 0.07 }}
              viewport={{ once: true }}
              className="card p-4 sm:p-6 group"
              style={{
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${cat.color}40`;
                el.style.boxShadow = `0 12px 40px ${cat.color}15`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-color)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4 pb-3" style={{ borderBottom: `1px solid ${cat.color}25` }}>
                <span className="text-lg font-bold" style={{ color: cat.color }}>{cat.icon}</span>
                <h3 className="overline" style={{ color: cat.color, fontSize: "11px" }}>{cat.name}</h3>
              </div>

              {/* Chip grid */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill, si) => (
                  <motion.span
                    key={si}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: si * 0.03 + ci * 0.04 }}
                    viewport={{ once: true }}
                    className="text-xs font-medium px-3 py-1.5"
                    style={{
                      background: `${cat.color}10`,
                      color: "var(--text-secondary)",
                      border: `1px solid ${cat.color}28`,
                      transition: "background 0.2s, color 0.2s",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = `${cat.color}22`;
                      el.style.color = cat.color;
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = `${cat.color}10`;
                      el.style.color = "var(--text-secondary)";
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

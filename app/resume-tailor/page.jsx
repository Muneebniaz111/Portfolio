"use client";

import { useState, useRef, useCallback } from "react";

const PROMPT_A = `You are an expert Technical Recruiter, ATS Resume Writer, and Career Coach.

Objective
Analyze my resume against the provided job description(s) and return an ATS-optimized, one-page resume that maximizes my chances of getting shortlisted.

Instructions
1. Analyze the Job Description
Identify the required technical skills, soft skills, tools, frameworks, programming languages, certifications, and responsibilities.
Extract the most important ATS keywords.
Compare these requirements with my existing resume.

2. Optimize My Resume
Keep the resume to one page.
Do NOT change the original layout, formatting, section headings, or subheadings.
Preserve the overall design and order of sections.
Improve only the content inside each section.

3. Experience Section
Do not change the job titles, company names, employment dates, or locations.
Rewrite only the bullet points to better align with the target role.
Use strong action verbs where appropriate.
Naturally incorporate ATS keywords from the job description only if they accurately reflect my existing experience.

4. Projects Section
Include or prioritize at least two projects that are highly relevant to the target role.
Rewrite project descriptions to emphasize:
- Technologies used
- Technical implementation
- Business or user impact (only if supported by the original content)
Do not create new projects or invent project details.

5. Skills Section
Reorganize skills according to relevance.
Add only skills that are already demonstrated in my resume, projects, or experience.
Do not introduce new skills that I have not mentioned.

6. ATS Optimization
Naturally integrate important keywords from the job description.
Avoid keyword stuffing.
Ensure compatibility with Applicant Tracking Systems (ATS).

7. Resume Quality Rules
Never include information that cannot be defended during an interview.
Do NOT add, assume, infer, exaggerate, or fabricate any information.
Do NOT create fake projects, work experience, internships, certifications, achievements, technical skills, responsibilities, metrics, percentages, or accomplishments.
Only use information that already exists in my resume or is explicitly stated in the job description and genuinely matches my experience.
If required information is missing, leave it unchanged rather than inventing content.
Remove redundant or low-value content if necessary to fit one page.

Output
Return only the modified resume while:
Keeping the original headings and subheadings unchanged.
Preserving the original layout and formatting.
Ensuring the resume fits on a single page.
Making the resume ATS-friendly and tailored to the target job description.
Do not add any information from your own knowledge or assumptions. Every modification must be traceable to the content already present in my resume.`;

const PROMPT_B = `You are an expert Technical Recruiter, ATS Resume Writer, and Career Coach.

Objective
Analyze my resume against the provided job description(s) and return an ATS-optimized, detailed resume that maximizes my chances of getting shortlisted.

Instructions
1. Analyze the Job Description
Identify the required technical skills, soft skills, tools, frameworks, programming languages, certifications, and responsibilities.
Extract the most important ATS keywords.
Compare these requirements with my existing resume.

2. Optimize My Resume
Create a detailed version of my resume that fully showcases my qualifications while remaining concise and professional.
Do NOT change the original layout, formatting, section headings, or subheadings.
Preserve the overall design and order of sections.
Improve only the content inside each section.

3. Experience Section
Do not change the job titles, company names, employment dates, or locations.
Rewrite only the bullet points to better align with the target role.
Use strong action verbs where appropriate.
Naturally incorporate ATS keywords from the job description only if they accurately reflect my existing experience.
Expand existing bullet points where appropriate to better highlight responsibilities, technical contributions, and achievements without inventing new information.

4. Projects Section
Include or prioritize all relevant projects, ensuring at least two projects closely match the target role.
Rewrite project descriptions to emphasize:
- Technologies used
- Technical implementation
- Business or user impact (only if supported by the original content)
- Challenges solved and key features (only if present in the original resume)
Do not create new projects or invent project details.

5. Skills Section
Reorganize skills according to relevance.
Add only skills that are already demonstrated in my resume, projects, or experience.
Do not introduce new skills that I have not mentioned.

6. ATS Optimization
Naturally integrate important keywords from the job description.
Avoid keyword stuffing.
Ensure compatibility with Applicant Tracking Systems (ATS).

7. Resume Quality Rules
Never include information that cannot be defended during an interview.
Do NOT add, assume, infer, exaggerate, or fabricate any information.
Do NOT create fake projects, work experience, internships, certifications, achievements, technical skills, responsibilities, metrics, percentages, or accomplishments.
Only use information that already exists in my resume or is explicitly stated in the job description and genuinely matches my experience.
If required information is missing, leave it unchanged rather than inventing content.
Preserve all relevant and valuable information; do not remove content solely to reduce the resume length.

Output
Return only the modified detailed resume while:
Keeping the original headings and subheadings unchanged.
Preserving the original layout and formatting.
Maintaining a detailed yet professional structure (length may exceed one page if necessary).
Making the resume ATS-friendly and tailored to the target job description.
Do not add any information from your own knowledge or assumptions. Every modification must be traceable to the content already present in my resume.`;

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("Read failed"));
    r.readAsDataURL(file);
  });
}

function getMediaType(file) {
  if (file.name.endsWith(".pdf")) return "application/pdf";
  if (file.name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "text/plain";
}

const STEPS = [
  "Validating inputs",
  "Extracting resume content",
  "Analyzing job description",
  "Comparing & matching skills",
  "Generating tailored resume",
  "Validating output",
  "Finalizing document",
];

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [jdMode, setJdMode] = useState("text");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const resumeInputRef = useRef();
  const jdFileInputRef = useRef();

  const handleDrop = useCallback((e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setter(file);
  }, []);

  const runAgent = async (buttonType) => {
    setError(null);
    setResult(null);
    setActiveButton(buttonType);

    if (!resumeFile) { setError("Please upload your resume."); return; }
    const hasJD = jdMode === "file" ? !!jdFile : jdText.trim().length > 10;
    if (!hasJD) { setError("Please provide a job description."); return; }

    setLoading(true);
    setCurrentStep(0);

    try {
      setCurrentStep(1);
      let resumeContent = [];
      const resumeBase64 = await fileToBase64(resumeFile);
      const rmt = getMediaType(resumeFile);
      if (rmt === "application/pdf") {
        resumeContent = [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: resumeBase64 } }];
      } else {
        resumeContent = [{ type: "document", source: { type: "base64", media_type: rmt, data: resumeBase64 } }];
      }

      setCurrentStep(2);
      let jdContent = "";
      if (jdMode === "text") {
        jdContent = jdText.trim();
      } else {
        await fileToBase64(jdFile);
        jdContent = `[Attached job description file: ${jdFile.name}]`;
      }

      setCurrentStep(3);
      await new Promise(r => setTimeout(r, 500));
      setCurrentStep(4);

      const prompt = buttonType === "single" ? PROMPT_A : PROMPT_B;
      let userMessageContent = [];
      userMessageContent.push(...resumeContent);

      if (jdMode === "file" && jdFile) {
        const jdBase64 = await fileToBase64(jdFile);
        const jmt = getMediaType(jdFile);
        if (jmt === "application/pdf") {
          userMessageContent.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: jdBase64 } });
        } else {
          userMessageContent.push({ type: "document", source: { type: "base64", media_type: jmt, data: jdBase64 } });
        }
        userMessageContent.push({ type: "text", text: `Here is my resume (first attached document) and the job description (second attached document).\n\n${prompt}` });
      } else {
        userMessageContent.push({
          type: "text",
          text: `Here is my resume (attached above) and the job description below:\n\n---JOB DESCRIPTION---\n${jdContent}\n---END JOB DESCRIPTION---\n\n${prompt}`
        });
      }

      const response = await fetch("/api/resume-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          messages: [{ role: "user", content: userMessageContent }],
        }),
      });

      setCurrentStep(5);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "API error");
      }

      setCurrentStep(6);
      const text = data.content.map(b => b.text || "").join("\n");
      await new Promise(r => setTimeout(r, 400));

      setResult({ text, type: buttonType });
      setCurrentStep(-1);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setCurrentStep(-1);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const blob = new Blob([result.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.type === "single" ? "tailored_resume_single_page.txt" : "tailored_resume_detailed.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", color: "#e8e8f0", fontFamily: "'Inter', system-ui, sans-serif", padding: "0" }}>
      <div style={{ borderBottom: "1px solid #1e2030", padding: "20px 32px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Resume Tailor Agent</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>ATS-optimized resume generation</div>
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Your Resume</label>
            <div
              onDrop={e => handleDrop(e, setResumeFile)}
              onDragOver={e => e.preventDefault()}
              onClick={() => resumeInputRef.current.click()}
              style={{
                border: `2px dashed ${resumeFile ? "#6366f1" : "#2d2f45"}`,
                borderRadius: 12,
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: resumeFile ? "rgba(99,102,241,0.06)" : "#131520",
                transition: "all 0.2s",
              }}
            >
              <input ref={resumeInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={e => setResumeFile(e.target.files[0])} />
              {resumeFile ? (
                <div>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>{resumeFile.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{(resumeFile.size / 1024).toFixed(1)} KB · Click to change</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#d1d5db" }}>Drop resume here</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>PDF, DOCX, or TXT</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Description</label>
              <div style={{ display: "flex", gap: 4 }}>
                {["text", "file"].map(m => (
                  <button key={m} onClick={() => setJdMode(m)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: jdMode === m ? "#6366f1" : "#1e2030", color: jdMode === m ? "#fff" : "#9ca3af", fontWeight: 500, transition: "all 0.15s" }}>
                    {m === "text" ? "Paste" : "Upload"}
                  </button>
                ))}
              </div>
            </div>

            {jdMode === "text" ? (
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                style={{ width: "100%", height: 120, background: "#131520", border: "2px solid #2d2f45", borderRadius: 12, padding: "14px 16px", color: "#e8e8f0", fontSize: 13, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 }}
              />
            ) : (
              <div
                onDrop={e => handleDrop(e, setJdFile)}
                onDragOver={e => e.preventDefault()}
                onClick={() => jdFileInputRef.current.click()}
                style={{ border: `2px dashed ${jdFile ? "#6366f1" : "#2d2f45"}`, borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: jdFile ? "rgba(99,102,241,0.06)" : "#131520", height: 120, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", transition: "all 0.2s" }}
              >
                <input ref={jdFileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: "none" }} onChange={e => setJdFile(e.target.files[0])} />
                {jdFile ? (
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>📋</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#a5b4fc" }}>{jdFile.name}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Click to change</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>⬆️</div>
                    <div style={{ fontSize: 12, color: "#d1d5db" }}>Drop JD file here</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>PDF, DOCX, or TXT</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          <button
            onClick={() => runAgent("single")}
            disabled={loading}
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #6366f1",
              background: loading && activeButton === "single" ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading && activeButton !== "single" ? 0.5 : 1,
              transition: "all 0.2s",
              textAlign: "left",
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>📄</div>
            <div>Single-Page Resume</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>Concise, ATS-optimized, one page</div>
          </button>

          <button
            onClick={() => runAgent("detailed")}
            disabled={loading}
            style={{
              padding: "18px 20px",
              borderRadius: 14,
              border: "1px solid #059669",
              background: loading && activeButton === "detailed" ? "rgba(5,150,105,0.2)" : "linear-gradient(135deg, #059669, #0d9488)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading && activeButton !== "detailed" ? 0.5 : 1,
              transition: "all 0.2s",
              textAlign: "left",
              lineHeight: 1.4,
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>📋</div>
            <div>Detailed Resume</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>Full detail, preserves structure</div>
          </button>
        </div>

        {loading && (
          <div style={{ background: "#131520", border: "1px solid #1e2030", borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc", marginBottom: 16 }}>
              {activeButton === "single" ? "Generating Single-Page Resume..." : "Generating Detailed Resume..."}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((step, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done || active ? 1 : 0.35 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${done ? "#6366f1" : active ? "#a5b4fc" : "#2d2f45"}`, background: done ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s" }}>
                      {done && <span style={{ fontSize: 11, color: "#fff" }}>✓</span>}
                      {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a5b4fc", animation: "pulse 1s infinite" }} />}
                    </div>
                    <span style={{ fontSize: 13, color: done ? "#d1d5db" : active ? "#e8e8f0" : "#6b7280", fontWeight: active ? 600 : 400 }}>{step}</span>
                    {active && <div style={{ marginLeft: "auto", fontSize: 11, color: "#6b7280" }}>in progress...</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result && !loading && (
          <div style={{ background: "#131520", border: "1px solid #1e2030", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2030", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#d1d5db" }}>
                  {result.type === "single" ? "Single-Page" : "Detailed"} Resume — Ready
                </span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={downloadResult}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  ⬇ Download .txt
                </button>
                <button
                  onClick={() => { setResult(null); setCurrentStep(-1); }}
                  style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #2d2f45", background: "transparent", color: "#9ca3af", fontSize: 12, cursor: "pointer" }}
                >
                  Clear
                </button>
              </div>
            </div>
            <pre style={{ padding: "20px 24px", margin: 0, fontSize: 13, color: "#d1d5db", whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.7, maxHeight: 480, overflowY: "auto", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              {result.text}
            </pre>
          </div>
        )}

        <div style={{ marginTop: 28, textAlign: "center", fontSize: 11, color: "#4b5563", lineHeight: 1.6 }}>
          The agent never invents skills, experience, or credentials — only rewrites what&apos;s already in your resume.
        </div>
      </div>

      <style>{`\n+        @keyframes pulse {\n+          0%, 100% { opacity: 1; }\n+          50% { opacity: 0.3; }\n+        }\n+        * { box-sizing: border-box; }\n+        textarea:focus { border-color: #6366f1 !important; }\n+        ::-webkit-scrollbar { width: 6px; }\n+        ::-webkit-scrollbar-track { background: #131520; }\n+        ::-webkit-scrollbar-thumb { background: #2d2f45; border-radius: 3px; }\n+      `}</style>
    </div>
  );
}
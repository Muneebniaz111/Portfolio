"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setWidth(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5" style={{ background: "transparent" }}>
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${width}%`,
          background: "linear-gradient(to right, var(--accent-primary), var(--accent-cyan))",
          boxShadow: "0 0 6px var(--accent-primary)",
        }}
      />
    </div>
  );
}

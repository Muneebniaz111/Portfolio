"use client";

import { useCanvasCursor } from "@/hooks/useCanvasCursor";

export default function CanvasCursor() {
  const { canvasRef } = useCanvasCursor();

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 z-[999] pointer-events-none hidden md:block"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

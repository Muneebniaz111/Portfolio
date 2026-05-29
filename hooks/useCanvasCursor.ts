import { useEffect, useRef, useState } from "react";

interface CursorPosition {
  x: number;
  y: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const useCanvasCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<CursorPosition>({ x: 0, y: 0 });
  const canvasCursorPos = useRef<CursorPosition>({ x: 0, y: 0 });
  const prevCursorPos = useRef<CursorPosition>({ x: 0, y: 0 });
  const animationId = useRef<number | null>(null);
  const trailParticles = useRef<TrailParticle[]>([]);
  const lastParticleTime = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Create trail particles
    const createTrailParticle = (x: number, y: number) => {
      const now = Date.now();
      // Create particle every 6ms for smooth trails
      if (now - lastParticleTime.current < 6) return;
      lastParticleTime.current = now;

      // Calculate velocity based on cursor movement
      const vx = mousePos.current.x - prevCursorPos.current.x;
      const vy = mousePos.current.y - prevCursorPos.current.y;

      const particle: TrailParticle = {
        x,
        y,
        vx: vx * 0.25,
        vy: vy * 0.25,
        life: 1,
        maxLife: 0.7,
      };

      trailParticles.current.push(particle);

      // Limit particle pool to 150 particles for performance
      if (trailParticles.current.length > 150) {
        trailParticles.current.shift();
      }
    };

    // Animation loop for smooth cursor movement
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth easing towards mouse position
      const ease = 0.18;
      canvasCursorPos.current.x +=
        (mousePos.current.x - canvasCursorPos.current.x) * ease;
      canvasCursorPos.current.y +=
        (mousePos.current.y - canvasCursorPos.current.y) * ease;

      const x = canvasCursorPos.current.x;
      const y = canvasCursorPos.current.y;

      // Create trail particles
      createTrailParticle(x, y);

      // Update and draw trail particles
      for (let i = trailParticles.current.length - 1; i >= 0; i--) {
        const particle = trailParticles.current[i];

        // Update particle position with velocity and deceleration
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Fade out particle
        particle.life -= 0.04;

        if (particle.life <= 0) {
          trailParticles.current.splice(i, 1);
          continue;
        }

        // Calculate opacity based on life
        const opacity = Math.max(0, particle.life / particle.maxLife);
        const radius = 2 * opacity;

        // Draw trail particle with gradient
        ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle outer glow
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw main cursor - outer ring
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dot
      ctx.fillStyle = "rgba(99, 102, 241, 0.9)";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair with glow effect
      ctx.shadowColor = "rgba(99, 102, 241, 0.3)";
      ctx.shadowBlur = 3;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 8, y);
      ctx.lineTo(x - 4, y);
      ctx.moveTo(x + 4, y);
      ctx.lineTo(x + 8, y);
      ctx.moveTo(x, y - 8);
      ctx.lineTo(x, y - 4);
      ctx.moveTo(x, y + 4);
      ctx.lineTo(x, y + 8);
      ctx.stroke();
      ctx.shadowColor = "transparent";

      // Update previous cursor position for next velocity calculation
      prevCursorPos.current = { x, y };

      animationId.current = requestAnimationFrame(animate);
    };

    // Handle visibility to pause animation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationId.current) {
          cancelAnimationFrame(animationId.current);
        }
      } else {
        animate();
      }
    };

    animate();
    setIsInitialized(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      // Clear particle pool
      trailParticles.current = [];
    };
  }, []);

  return { canvasRef, isInitialized };
};

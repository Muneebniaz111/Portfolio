"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Theme = "light" | "dark";

const HOVER_ZONE_HEIGHT = 60; // px from top that triggers show on desktop
const HIDE_DELAY_MS = 50;     // minimal delay for responsiveness

const Navbar = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start visible on load
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHeroInView, setIsHeroInView] = useState(true); // Track Hero visibility
  const lastScrollY = useRef(0);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroObserverRef = useRef<IntersectionObserver | null>(null);

  // Theme init
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const init = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(init);
    document.documentElement.setAttribute("data-theme", init);
  }, []);

  // Setup Intersection Observer to track Hero section visibility
  useEffect(() => {
    const heroElement = document.getElementById("hero");
    if (!heroElement) return;

    // Create observer to detect when Hero section is mostly out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting is true only when at least 10% of Hero is in viewport
        setIsHeroInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Fire when 10% of Hero is visible
        rootMargin: "0px",
      }
    );

    observer.observe(heroElement);
    heroObserverRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, []);

  // Detect mobile / touch device and keep navbar always visible on mobile
  useEffect(() => {
    const check = () => {
      const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      setIsMobile(touch);
      // Keep navbar always visible on mobile
      if (touch) {
        setIsVisible(true);
      }
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimer.current = setTimeout(() => {
      setIsVisible(false);
      setMobileOpen(false);
    }, HIDE_DELAY_MS);
  }, [cancelHide]);

  // Ensure navbar stays visible on mobile at all times
  useEffect(() => {
    if (!isMobile) return;

    // Force navbar to always be visible on mobile
    setIsVisible(true);

    // Cancel any pending hide operations
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    // Return cleanup - cancel any timers
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
        hideTimer.current = null;
      }
    };
  }, [isMobile]);

  // Desktop hover & scroll logic
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Always show navbar if mouse is near the top (instant, no delay)
      if (e.clientY <= HOVER_ZONE_HEIGHT) {
        cancelHide();
        setIsVisible(true);
      } else if (isHeroInView) {
        // Hero is in view, keep navbar visible regardless of cursor position
        cancelHide();
        setIsVisible(true);
      } else {
        // Hero is out of view and cursor is not near top, schedule hide
        scheduleHide();
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      // If Hero is in view, navbar should always be visible
      if (isHeroInView) {
        cancelHide();
        setIsVisible(true);
      } else {
        // Hero is out of view - navbar can hide unless user moves mouse near top
        // The handleMouseMove will keep it visible if cursor is near top
        // Otherwise, it will hide after a small delay
        scheduleHide();
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelHide();
    };
  }, [isMobile, cancelHide, scheduleHide, isHeroInView]);

  const handleNavMouseEnter = useCallback(() => {
    if (isMobile) return;
    cancelHide();
    setIsVisible(true);
  }, [isMobile, cancelHide]);

  const handleNavMouseLeave = useCallback(() => {
    if (isMobile) return;
    scheduleHide();
  }, [isMobile, scheduleHide]);

  useEffect(() => () => cancelHide(), [cancelHide]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    cancelHide(); // Keep navbar visible during navigation
    // Small timeout to let mobile menu close first
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 10);
  };

  const navItems = [
    { label: "Home",    id: "hero" },
    { label: "About",   id: "resume" },
    { label: "Skills",  id: "skills" },
    { label: "Contact", id: "contact" },
    { label: "Projects",    id: "projects" },
  ];

  if (!mounted) return null;

  // Light mode navbar background
  const navBg = theme === "light"
    ? scrolled ? "rgba(243,245,253,0.95)" : "rgba(243,245,253,0.88)"
    : scrolled ? "rgba(7,9,15,0.88)" : "rgba(7,9,15,0.65)";

  const navBorder = theme === "light"
    ? scrolled ? "1px solid rgba(79,82,232,0.18)" : "1px solid transparent"
    : scrolled ? "1px solid rgba(99,102,241,0.18)" : "1px solid transparent";

  return (
    <>
      {/* Invisible trigger strip at top edge (desktop only) */}
      {!isMobile && (
        <div
          aria-hidden="true"
          onMouseEnter={() => { cancelHide(); setIsVisible(true); }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: `${HOVER_ZONE_HEIGHT}px`,
            zIndex: 49,
            pointerEvents: "auto",
          }}
        />
      )}

      <motion.nav
        ref={navRef}
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isMobile ? 0 : (isVisible ? 0 : -100),
          opacity: isMobile ? 1 : (isVisible ? 1 : 0),
        }}
        transition={{
          duration: 0.15,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="fixed top-0 left-0 right-0 z-50 md:rounded-none"
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
        style={{
          background: navBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: navBorder,
          pointerEvents: isMobile ? "auto" : (isVisible ? "auto" : "none"),
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div
              className="relative w-9 h-9 overflow-hidden flex-shrink-0"
              style={{ border: "1px solid rgba(99,102,241,0.35)" }}
            >
              <Image src="/logo-mn.png" alt="MN" fill sizes="36px" className="object-cover" />
            </div>
            <span
              className="font-semibold text-sm tracking-wide"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Muneeb Niaz
            </span>
          </motion.button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ y: -1 }}
                className="px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-200"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ background: "var(--surface-light)", color: "var(--accent-primary)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </g>
                </svg>
              )}
            </motion.button>

            {/* Hire Me */}
            <motion.button
              onClick={() => scrollToSection("contact")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:flex btn-primary text-xs py-2 px-5"
            >
              Hire Me
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
              whileTap={{ scale: 0.93 }}
              aria-label="Menu"
            >
              <span
                className="block w-5 h-0.5"
                style={{
                  background: "var(--text-primary)",
                  transition: "all 0.2s",
                  transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none",
                }}
              />
              <span
                className="block w-5 h-0.5"
                style={{
                  background: "var(--text-primary)",
                  opacity: mobileOpen ? 0 : 1,
                  transition: "all 0.2s",
                }}
              />
              <span
                className="block w-5 h-0.5"
                style={{
                  background: "var(--text-primary)",
                  transition: "all 0.2s",
                  transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none",
                }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
              style={{
                background: theme === "light" ? "rgba(243,245,253,0.98)" : "rgba(7,9,15,0.97)",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left py-3 px-2 text-sm font-medium border-b"
                    style={{
                      color: "var(--text-primary)",
                      borderColor: "var(--border-color)",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection("contact")}
                  className="btn-primary mt-3 justify-center text-xs py-3"
                >
                  Hire Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

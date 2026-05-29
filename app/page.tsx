import Projects from "@/components/Projects";
import Experience from "@/components/Skill";
import Resume from "@/components/Resume";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollIndicator from "@/components/ScrollIndicator";
import CanvasCursor from "../components/CanvasCursor";

export default function Home() {
  return (
    <>
      <CanvasCursor />
      <Navbar />
      <main
        className="min-h-screen transition-colors duration-300"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        <ScrollIndicator />
        <div id="hero">
          <Hero />
        </div>
        <div id="resume">
          <Resume />
        </div>
        <div id="skills">
          <Experience />
        </div>
        <div id="contact">
          <Contact />
        </div>
        <div id="projects">
          <Projects />
        </div>
      </main>
      <Footer />
    </>
  );
}

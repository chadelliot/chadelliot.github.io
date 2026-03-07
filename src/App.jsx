import React, { useEffect, useMemo, useState } from "react";
import Nav from "./components/Nav.jsx";
import About from "./components/sections/About.jsx";
import Approach from "./components/sections/Approach.jsx";
import Career from "./components/sections/Career.jsx";
import Skills from "./components/sections/Skills.jsx";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "approach", label: "Approach" },
  { id: "career", label: "Career" },
  { id: "skills", label: "Skills" },
];

export default function App() {
  const [active, setActive] = useState("about");

  const sectionRefs = useMemo(() => {
    const refs = {};
    SECTIONS.forEach((s) => (refs[s.id] = React.createRef()));
    return refs;
  }, []);

  useEffect(() => {
    const els = SECTIONS.map((s) => sectionRefs[s.id].current).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sectionRefs]);

  const scrollTo = (id) => {
    const el = sectionRefs[id]?.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    const hash = (window.location.hash || "").replace("#", "");
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      setTimeout(() => scrollTo(hash), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <Nav sections={SECTIONS} active={active} onNavigate={scrollTo} />
      <main>
        <section id="about" ref={sectionRefs.about} className="section">
          <About />
        </section>

        <section id="approach" ref={sectionRefs.approach} className="section section-alt">
          <Approach />
        </section>

        <section id="career" ref={sectionRefs.career} className="section">
          <Career />
        </section>

        <section id="skills" ref={sectionRefs.skills} className="section section-alt">
          <Skills />
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <div className="footer-name">Chad <em>Parker</em></div>
          <div className="footer-loc">Glen Burnie, Maryland</div>
        </div>
        <div className="footer-links">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(s.id);
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

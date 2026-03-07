import React from "react";

export default function Nav({ sections, active, onNavigate }) {
  return (
    <nav className="site-nav">
      <a
        href="#about"
        className="name-logo"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("about");
        }}
      >
        Chad <em>Parker</em>
      </a>

      <ul className="nav-links" role="list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={active === s.id ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(s.id);
              }}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

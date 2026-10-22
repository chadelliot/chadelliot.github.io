import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

type NavChild = { label: string; href: string; description: string };
type NavItem = { label: string; href: string; staticPage?: boolean; children?: NavChild[] };

const navItems: NavItem[] = [
  { label: "About", href: "/" },
  {
    label: "My Approach",
    href: "/approach/",
    staticPage: true,
    children: [
      { label: "Growth Engine", href: "/approach/", description: "A signal-based marketing system" },
      { label: "GTM Strategy", href: "/gtm-strategy/", description: "One market, built end to end" },
    ],
  },
  { label: "Career", href: "/career" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

const isApproachPath = (pathname: string) =>
  pathname.startsWith("/approach") || pathname.startsWith("/gtm-strategy");

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-20 py-4 md:py-6"
      style={{
        background: "rgba(248,249,250,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(var(--border))",
      }}
    >
      <div className="flex items-center">
        <Link to="/" className="font-display text-[22px] md:text-[28px] font-extrabold tracking-tight text-foreground no-underline">
          About <em className="text-primary">Chad</em>
        </Link>
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex gap-8 list-none">
        {navItems.map((item) => (
          <li key={item.label} className={item.children ? "relative group" : undefined}>
            {item.children ? (
              <>
                <a
                  href={item.href}
                  className={`no-underline text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                    isApproachPath(location.pathname) ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                  style={{ fontSize: "11px" }}
                >
                  {item.label} <span className="text-[9px] ml-0.5">▾</span>
                </a>
                <div className="absolute left-[-16px] top-full pt-4 min-w-[250px] opacity-0 invisible -translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                  <ul className="list-none bg-white rounded-md overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                    {item.children.map((child, i) => (
                      <li key={child.label} style={i > 0 ? { borderTop: "1px solid hsl(var(--border))" } : undefined}>
                        <a
                          href={child.href}
                          className={`block no-underline px-4 py-3 text-[11px] font-medium tracking-[0.12em] uppercase transition-colors hover:text-primary ${
                            location.pathname.startsWith(child.href.replace(/\/$/, "")) ? "text-primary" : "text-muted-foreground"
                          }`}
                          style={{ fontSize: "11px" }}
                        >
                          {child.label}
                          <span className="block normal-case tracking-normal text-[10px] font-normal mt-0.5 text-muted-foreground">
                            {child.description}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Link
                to={item.href}
                className={`no-underline text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                style={{ fontSize: "11px" }}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex items-center justify-center w-10 h-10 text-foreground cursor-pointer bg-transparent border-none"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute top-full left-0 right-0 md:hidden flex flex-col py-4 px-6 gap-1"
          style={{
            background: "rgba(248,249,250,0.98)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid hsl(var(--border))",
          }}
        >
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                <div
                  className="text-[11px] font-medium tracking-[0.12em] uppercase py-3 px-2 text-muted-foreground"
                  style={{ fontSize: "11px" }}
                >
                  {item.label}
                </div>
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block no-underline text-[11px] font-medium tracking-[0.12em] uppercase py-2.5 pl-6 pr-2 transition-colors ${
                      location.pathname.startsWith(child.href.replace(/\/$/, ""))
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    style={{ fontSize: "11px" }}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`no-underline text-[11px] font-medium tracking-[0.12em] uppercase py-3 px-2 transition-colors ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                style={{ borderBottom: "1px solid hsl(var(--border))", fontSize: "11px" }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

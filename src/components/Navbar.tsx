import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/" },
  { label: "My Approach", href: "/approach" },
  { label: "Career", href: "/career" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

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
          <li key={item.label}>
            <Link
              to={item.href}
              className={`no-underline text-[11px] font-medium tracking-[0.15em] uppercase transition-colors ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`no-underline text-[12px] font-medium tracking-[0.12em] uppercase py-3 px-2 transition-colors ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

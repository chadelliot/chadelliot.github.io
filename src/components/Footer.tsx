import { Link } from "react-router-dom";

const Footer = () => (
  <footer
    className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 md:p-20"
    style={{
      background: "hsl(var(--charcoal))",
      borderTop: "1px solid #444",
    }}
  >
    <div className="text-center md:text-left">
      <div className="font-display text-[28px] font-extrabold" style={{ color: "#fff" }}>
        Chad <em className="text-primary">Parker</em>
      </div>
      <div className="font-sans text-[11px] tracking-[0.15em] uppercase mt-1.5" style={{ color: "#888" }}>
        Washington, D.C. Metro Area
      </div>
    </div>
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {[
        { label: "About", href: "/" },
        { label: "My Approach", href: "/approach" },
        { label: "Career", href: "/career" },
        { label: "Skills", href: "/skills" },
        { label: "Contact", href: "/contact" },
      ].map((link) => (
        <Link
          key={link.label}
          to={link.href}
          className="font-sans text-[11px] tracking-[0.12em] uppercase no-underline transition-all pb-0.5 hover:text-primary hover:border-b hover:border-primary"
          style={{ color: "#888", borderBottom: "1px solid transparent" }}
        >
          {link.label}
        </Link>
      ))}
    </div>
  </footer>
);

export default Footer;

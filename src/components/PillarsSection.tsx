import { Link } from "react-router-dom";
import michaelsLogo from "@/assets/michaels-logo.svg";
import gapLogo from "@/assets/gap-logo.svg";
const pillars = [
  {
    num: "01",
    tag: "Career",
    title: "Corporate",
    subtitle: "Growth",
    org: "QXO · Brad Jacobs Company",
    description:
      "I lead digital marketing and marketing operations strategy focused on scalable demand generation, segmentation, marketing intelligence, lifecycle activation, and cross-functional revenue orchestration.",
    bullets: [
      "Built the infrastructure behind digital growth in an $800B industry with no mature digital playbook.",
      "Scaled performance across acquisition, loyalty, pricing, promotions, and branch-driven customer activation.",
      "Connected marketing strategy, analytics, CRM, and sales workflows into one measurable engine.",
    ],
    stat: "$1B+",
    statLabel: "Digital Revenue Influence",
    link: "/approach",
    linkLabel: "View My Approach →",
  },
  {
    num: "02",
    tag: "Consulting",
    title: "Advisory",
    subtitle: "& AI Strategy",
    org: "Michaels · Gap",
    logos: [michaelsLogo, gapLogo],
    description:
      "I advise select brands on customer lifetime value analysis, segmentation design, lifecycle strategy, and marketing operations modernization with an emphasis on AI-enabled activation.",
    bullets: [
      "Developed strategic approaches to CLV-based segmentation and precision marketing.",
      "Helped frame the operating model needed to move from broad campaigns to smarter customer activation.",
      "Applied the same analytical rigor used in enterprise environments to retail and ecommerce contexts.",
    ],
    stat: "2",
    statLabel: "National Retail Advisory Clients",
  },
  {
    num: "03",
    tag: "Entrepreneurship",
    title: "Founder",
    subtitle: "& Ecommerce",
    org: "Hidden Gems · Amazon & Walmart",
    description:
      "I own Hidden Gems, a multi-platform ecommerce business selling on Amazon and Walmart, and I built The Blueprint course to teach entrepreneurs the sourcing systems and operating discipline behind that growth.",
    bullets: [
      "Generated $250K+ in annual ecommerce revenue through replenishable product sourcing and marketplace operations.",
      "Built a brand and education offer around the real systems used inside the business.",
      "Created The Blueprint to help others source profitably and scale with data-driven decision making.",
    ],
    stat: "$250K+",
    statLabel: "Annual Ecommerce Revenue",
    link: "https://hiddengemsmd.com/courses/blueprint/",
    linkLabel: "View The Blueprint →",
    external: true,
  },
];

const SectionHeader = ({ num, title, em }: { num: string; title: string; em: string }) => (
  <div className="flex items-center gap-3 md:gap-5 mb-8 md:mb-16">
    <span className="font-mono text-[11px] text-primary tracking-[0.1em]">{num}</span>
    <h2
      className="font-display font-extrabold leading-none tracking-[-0.025em]"
      style={{ fontSize: "clamp(28px, 4vw, 54px)" }}
    >
      {title} <em className="text-primary">{em}</em>
    </h2>
    <div className="flex-1 h-[1px] bg-border" />
  </div>
);

const PillarsSection = () => {
  return (
    <section className="bg-background px-6 py-[60px] md:px-20">
      <SectionHeader num="01" title="Career" em="Pillars" />
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[600px] mb-16">
        My career spans enterprise growth leadership, advisory work for national retail brands, and entrepreneurship—united by a focus on segmentation, marketing intelligence, lifecycle strategy, and building systems that turn insight into measurable revenue growth.
      </p>

      <div
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", borderRadius: 8, overflow: "hidden" }}
      >
        {pillars.map((p) => (
          <div key={p.num} className="bg-card hover:bg-secondary transition-colors relative overflow-hidden group" style={{ padding: "36px 32px" }}>
            {/* Top accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary transform scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />

            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{p.tag}</span>
            <h3 className="font-display text-[22px] font-extrabold mt-2 text-foreground tracking-[-0.02em]">{p.title}</h3>
            <p className="font-display text-[22px] font-extrabold text-primary italic">{p.subtitle}</p>
            {!p.logos && <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-muted-foreground mt-3">{p.org}</p>}
            {p.logos && (
              <div className="flex items-center gap-4 mt-3">
                {p.logos.map((logo, li) => (
                  <img key={li} src={logo} alt="" style={{ height: 36, width: "auto", maxWidth: 160 }} />
                ))}
              </div>
            )}
            <p className="font-sans text-[12px] text-muted-foreground mt-4 leading-[1.7]">{p.description}</p>

            <ul className="mt-4 flex flex-col gap-2.5">
              {p.bullets.map((b, i) => (
                <li key={i} className="font-sans text-[12px] text-muted-foreground flex items-start gap-3 leading-[1.6]">
                  <span className="text-primary flex-shrink-0 mt-[1px] text-[10px]">▸</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6" style={{ borderTop: "1px solid hsl(var(--border))" }}>
              <p className="font-display text-[28px] font-extrabold text-primary leading-none">{p.stat}</p>
              <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">{p.statLabel}</p>
            </div>

            {p.link && (p.external ? (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.12em] uppercase text-primary border border-primary/50 px-[18px] py-[10px] rounded bg-primary/[0.06] hover:bg-primary/[0.14] hover:border-primary transition-all cursor-pointer no-underline"
              >
                {p.linkLabel}
              </a>
            ) : (
              <Link
                to={p.link}
                className="mt-4 inline-flex items-center gap-2 text-[11px] font-sans tracking-[0.12em] uppercase text-primary border border-primary/50 px-[18px] py-[10px] rounded bg-primary/[0.06] hover:bg-primary/[0.14] hover:border-primary transition-all cursor-pointer no-underline"
              >
                {p.linkLabel}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PillarsSection;
export { SectionHeader };

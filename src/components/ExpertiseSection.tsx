import ChapterHeader from "./ChapterHeader";

const expertiseItems = [
  { num: "01", title: "Commercial Strategy & GTM Design", desc: "Connecting segmentation, TAM analysis, signal intelligence, and channel activation into one operating system that tells leadership where to invest next." },
  { num: "02", title: "Customer Segmentation & Tiering", desc: "RFM analysis, customer lifetime value modeling, and account-tier frameworks that turn a broad market into a prioritized, fundable growth plan." },
  { num: "03", title: "Signal Intelligence & Customer Data", desc: "Enterprise CDP architecture and behavioral signal detection — funding events, intent surges, engagement shifts — that tell marketing and sales when to act." },
  { num: "04", title: "Marketing & Sales Alignment", desc: "Building the shared KPI framework and handoff model that connect marketing activation to sales execution around one revenue number." },
  { num: "05", title: "Attribution & Executive Reporting", desc: "Multi-channel attribution and ROI dashboards that translate campaign data into the decisions a CEO or board actually needs to make." },
  { num: "06", title: "Margin & EBITDA Impact Modeling", desc: "Connecting marketing investment directly to margin and EBITDA — not just pipeline — to prove commercial impact in the language finance already speaks." },
];

const ExpertiseSection = () => {
  return (
    <section className="bg-background px-6 py-[50px] md:px-20 md:py-[90px]">
      <ChapterHeader eyebrow="Chapter 01 — Core Expertise" title="Where I create" emphasis="the most value." />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-lg"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))" }}
      >
        {expertiseItems.map((item) => (
          <div
            key={item.num}
            className="bg-card hover:bg-secondary transition-colors relative overflow-hidden group"
            style={{ padding: "28px 26px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary transform scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center mb-4">
              <span className="font-sans text-[11px] font-extrabold" style={{ color: "hsl(var(--primary-foreground))" }}>
                {item.num}
              </span>
            </div>
            <div className="font-sans text-[14px] font-bold mb-2 leading-[1.3]">{item.title}</div>
            <div className="font-sans text-[11.5px] text-muted-foreground leading-[1.65]">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertiseSection;

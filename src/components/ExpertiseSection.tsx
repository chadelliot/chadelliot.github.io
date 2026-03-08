import { SectionHeader } from "./PillarsSection";

const expertiseItems = [
  { num: "01", title: "AI-Driven Marketing Systems", desc: "Designing and deploying AI-powered ecosystems including predictive segmentation, next-best-action engines, and automated lifecycle campaigns." },
  { num: "02", title: "Customer Data Platforms", desc: "Enterprise CDP architecture, customer identity resolution, and unified data infrastructure powering personalization and real-time activation." },
  { num: "03", title: "Marketing Operations & RevOps", desc: "Building full-funnel marketing operations frameworks that align marketing, sales, and analytics teams around shared revenue metrics." },
  { num: "04", title: "CLV & Segmentation Modeling", desc: "RFM analysis, customer lifetime value modeling, and behavioral segmentation frameworks that drive differentiated lifecycle strategies." },
  { num: "05", title: "Revenue Attribution", desc: "Multi-channel attribution systems and Marketing ROI dashboards connecting digital campaigns, branch sales, loyalty, and partner channels." },
  { num: "06", title: "Ecommerce & Digital Commerce", desc: "Built and operate a fully autonomous ecommerce business generating $250K+ annually across multiple marketplaces using data-driven automation." },
];

const ExpertiseSection = () => {
  return (
    <section className="bg-background px-6 py-[60px] md:px-20 md:py-[120px]">
      <SectionHeader num="05" title="Core" em="Expertise" />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden rounded-lg"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))" }}
      >
        {expertiseItems.map((item) => (
          <div
            key={item.num}
            className="bg-card hover:bg-secondary transition-colors relative overflow-hidden group"
            style={{ padding: "36px 32px" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary transform scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
            <div
              className="font-display text-[48px] font-extrabold leading-none mb-4 transition-colors duration-300"
              style={{ color: "hsl(var(--border))" }}
            >
              {item.num}
            </div>
            <div className="font-display text-[15px] font-bold mb-2.5 leading-[1.3]">{item.title}</div>
            <div className="font-sans text-[12px] text-muted-foreground leading-[1.7]">{item.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertiseSection;

import { SectionHeader } from "./PillarsSection";

const tools = [
  "Salesforce",
  "Einstein Analytics",
  "Pardot",
  "Google Ads",
  "Google Analytics",
  "HubSpot",
  "Terminus",
  "Moz",
];

const ToolsSection = () => {
  return (
    <section className="bg-background px-6 py-[60px] md:px-20">
      <SectionHeader num="07" title="Tools &" em="Platforms" />
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[600px] mb-16">
        The systems I've actually operated inside — not just studied — across CRM, marketing automation, attribution, and paid acquisition.
      </p>

      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", borderRadius: 8, overflow: "hidden" }}
      >
        {tools.map((tool) => (
          <div
            key={tool}
            className="bg-card hover:bg-secondary transition-colors text-center"
            style={{ padding: "26px 16px" }}
          >
            <div className="font-display text-[14px] font-bold">{tool}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;

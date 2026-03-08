const skills = [
  "AI-Driven Marketing",
  "Revenue Attribution",
  "Customer Data Platforms",
  "MarTech Architecture",
  "CLV Modeling",
  "Zero-Based Budgeting",
  "Growth Lab Innovation",
  "Demand Generation",
  "Ecommerce Automation",
  "Segmentation Strategy",
];

const MarqueeStrip = () => {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderTop: "1px solid hsl(var(--border))",
        borderBottom: "1px solid hsl(var(--border))",
        padding: "16px 0",
        background: "hsl(var(--charcoal))",
      }}
    >
      <div className="flex animate-marquee" style={{ width: "max-content", gap: 0 }}>
        {[...skills, ...skills].map((skill, i) => (
          <div
            key={i}
            className="flex items-center font-sans text-[10px] tracking-[0.2em] uppercase text-[#888] whitespace-nowrap"
            style={{ gap: 32, padding: "0 40px" }}
          >
            {skill}
            <span className="text-primary text-[14px]">·</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;

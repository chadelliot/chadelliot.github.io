import { SectionHeader } from "./PillarsSection";

const proofPoints = [
  { value: "3.1x", label: "Digital Revenue Growth" },
  { value: "$2.5B", label: "Branch Sales Influenced" },
  { value: "72%", label: "EBITDA ROI Improvement" },
  { value: "392%", label: "MQL Growth" },
];

const TrackRecordSection = () => {
  return (
    <section className="bg-background px-6 py-[60px] md:px-20">
      <SectionHeader num="06" title="Backed by a" em="Track Record" />
      <p className="font-sans text-[14px] text-muted-foreground leading-[1.8] max-w-[600px] mb-16">
        Every category above is a demonstrated result, not a claim — compounded across five roles at QXO, CIC Plus, and CCC Information Services.
      </p>

      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))", borderRadius: 8, overflow: "hidden" }}
      >
        {proofPoints.map((stat) => (
          <div
            key={stat.label}
            className="bg-card hover:bg-secondary transition-colors text-center"
            style={{ padding: "40px 24px" }}
          >
            <div className="font-display text-[40px] font-extrabold text-primary leading-none mb-2">
              {stat.value}
            </div>
            <div className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground leading-[1.5]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrackRecordSection;

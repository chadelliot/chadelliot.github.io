import { SectionHeader } from "./PillarsSection";

const certifications = [
  { icon: "☁️", name: "Salesforce Certified Pardot Consultant" },
  { icon: "⚡", name: "Salesforce Certified Pardot Specialist" },
  { icon: "🎯", name: "HubSpot Digital Marketing Certification" },
  { icon: "📊", name: "Google Analytics Certification" },
  { icon: "🔄", name: "HubSpot Inbound Marketing Certification" },
];

const EducationSection = () => {
  return (
    <section className="bg-background px-6 pb-[60px] md:px-20">
      <SectionHeader num="06" title="Education &" em="Credentials" />

      {/* Education cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 mb-16"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))" }}
      >
        {[
          { school: "Illinois Institute of Technology", degree: "Master of Science", field: "Marketing Analytics & Communications", years: "2013 – 2016" },
          { school: "Illinois Institute of Technology", degree: "Bachelor of Science", field: "Business Administration – Marketing Management", years: "2008 – 2012" },
        ].map((edu) => (
          <div key={edu.degree} className="bg-card flex gap-6 items-start" style={{ padding: 48, borderLeft: "3px solid transparent" }}>
            <div className="flex-1">
              <div className="font-display text-[22px] font-extrabold text-primary mb-1.5">{edu.school}</div>
              <div className="font-display text-[15px] font-bold mb-1">{edu.degree}</div>
              <div className="font-sans text-[12px] text-muted-foreground tracking-[0.08em]">{edu.field}</div>
              <div className="font-mono text-[11px] text-muted-foreground mt-2 tracking-[0.05em]">{edu.years}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div
        className="grid grid-cols-2 md:grid-cols-5"
        style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))" }}
      >
        {certifications.map((cert) => (
          <div key={cert.name} className="bg-card hover:bg-secondary transition-colors text-center" style={{ padding: "20px 16px" }}>
            <div className="text-[22px] mb-2.5">{cert.icon}</div>
            <div className="font-sans text-[10px] text-muted-foreground tracking-[0.08em] leading-[1.5]">{cert.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;

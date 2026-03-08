import chadHeadshot from "@/assets/chad-headshot.png";

const stats = [
  { value: "$1.25B", label: "Digital Revenue Scaled" },
  { value: "15+", label: "Years Experience" },
  { value: "30K", label: "Leads per Quarter" },
  { value: "$250K", label: "Ecommerce Revenue" },
];

const HeroSection = () => {
  return (
    <section
      className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden bg-background pt-[2.5rem]"
      id="home"
    >
      {/* Left */}
      <div
        className="flex flex-col justify-center relative z-[1] bg-background px-6 py-12 md:px-20 md:py-20"
      >
        {/* Greeting */}
        <div
          className="font-sans text-[15px] font-medium tracking-[0.12em] uppercase mb-3 animate-fadeUp-delay-1"
          style={{ color: "hsl(var(--charcoal))" }}
        >
          Hello, <span className="text-primary font-bold" style={{ fontStyle: "normal" }}>my name is</span>
        </div>

        {/* Name */}
        <h1
          className="font-display font-extrabold leading-[0.92] tracking-[-0.03em] mb-7 animate-fadeUp-delay-2"
          style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
        >
          Chad
          <br />
          <em className="text-primary">Parker</em>
        </h1>

        {/* Title */}
        <p className="font-sans text-[13px] font-semibold tracking-[0.08em] uppercase text-muted-foreground mb-10 max-w-[380px] leading-[1.8] animate-fadeUp-delay-3">
          Marketing Operations & AI Strategy Leader · Digital Transformation Executive · Ecommerce Entrepreneur
        </p>

        {/* Stats Grid */}
        <div
          className="grid grid-cols-2 max-w-[400px] animate-fadeUp-delay-4"
          style={{ gap: "1px", background: "hsl(var(--border))", border: "1px solid hsl(var(--border))" }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-card hover:bg-secondary transition-colors"
              style={{ padding: "20px 24px" }}
            >
              <div className="font-display text-[28px] font-extrabold text-primary leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-6 md:left-[80px] hidden md:flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-muted-foreground animate-fadeIn-delay"
        >
          <div className="w-[60px] h-[1px] bg-border relative overflow-hidden">
            <div
              className="absolute top-0 h-full w-full bg-primary"
              style={{ animation: "scanline 2s ease-in-out infinite", left: "-100%" }}
            />
          </div>
          Scroll to explore
        </div>
      </div>

      {/* Right */}
      <div className="relative flex items-center justify-center overflow-hidden bg-background min-h-[400px] lg:min-h-0">
        {/* Grid background */}
        <div
          className="absolute inset-0 animate-gridPan"
          style={{
            backgroundImage:
              "linear-gradient(rgba(47,163,127,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,163,127,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Orb */}
        <div
          className="absolute rounded-full animate-orb"
          style={{
            width: 480,
            height: 480,
            background: "radial-gradient(ellipse at center, rgba(47,163,127,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Photo wrap */}
        <div className="relative z-[2] flex flex-col items-center" style={{ opacity: 0, animation: "fadeIn 1s ease 0.8s forwards" }}>
          <div className="relative w-[280px] h-[340px] md:w-[380px] md:h-[460px]">
            {/* Corner accent */}
            <div
              className="absolute z-[3] top-0 left-0"
              style={{ width: 32, height: 32, borderTop: "2px solid hsl(var(--primary))", borderLeft: "2px solid hsl(var(--primary))" }}
            />
            <img
              src={chadHeadshot}
              alt="Chad Parker"
              className="w-full h-full object-cover block"
              style={{
                objectPosition: "center top",
                filter: "contrast(1.04) brightness(1.01)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                WebkitMaskComposite: "destination-in" as any,
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                maskComposite: "intersect" as any,
              }}
            />

            {/* Company badge */}
            <div
              className="absolute z-10 animate-fadeIn-badge"
              style={{
                top: 24,
                right: 0,
                background: "hsl(var(--charcoal))",
                border: "1px solid hsl(var(--charcoal-light))",
                borderLeft: "3px solid hsl(var(--primary))",
                padding: "10px 18px",
                borderRadius: "0 4px 4px 0",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            >
              <div className="font-sans text-[9px] text-[#aaa] tracking-[0.1em] uppercase" style={{ marginBottom: 2 }}>
                Most Recent Employer
              </div>
              <div className="font-display text-[18px] font-extrabold text-primary leading-none tracking-[-0.01em]">
                QXO Building
              </div>
              <div className="font-display text-[13px] font-extrabold text-primary leading-none mt-[1px]">
                Products, Inc.
              </div>
            </div>
          </div>

          {/* Tag below photo */}
          <div
            className="flex items-center gap-2 mt-3"
            style={{
              padding: "8px 18px",
              background: "rgba(47,163,127,0.07)",
              border: "1px solid rgba(47,163,127,0.2)",
              borderRadius: 4,
            }}
          >
            <span
              className="animate-blink"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "hsl(var(--primary))",
                boxShadow: "0 0 8px rgba(47,163,127,0.5)",
                flexShrink: 0,
              }}
            />
            <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-primary">
              Director · Digital Marketing & Ops
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

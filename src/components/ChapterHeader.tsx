// Header treatment matching the Commercial Strategy / My Approach page's chapter
// style — small uppercase green eyebrow, plain black headline (italic accent,
// not colored), thin rule beneath. Used only within the Skills page's own
// sections so Home/Career keep their existing numbered-card header untouched.

const ChapterHeader = ({
  eyebrow,
  title,
  emphasis,
}: {
  eyebrow: string;
  title: string;
  emphasis?: string;
}) => (
  <div className="mb-10 md:mb-14">
    <div className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
      {eyebrow}
    </div>
    <h2
      className="font-sans font-extrabold text-foreground leading-[1.1] tracking-[-0.02em]"
      style={{ fontSize: "clamp(26px, 3.6vw, 40px)" }}
    >
      {title}
      {emphasis && <em className="italic">{" " + emphasis}</em>}
    </h2>
    <div className="w-full h-px bg-border mt-6" />
  </div>
);

export default ChapterHeader;

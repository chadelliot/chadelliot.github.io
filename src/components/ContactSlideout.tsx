import { useState } from "react";
import { Send, Linkedin, MapPin, Mail, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

const ContactSlideout = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadTime, setLoadTime] = useState(Date.now());

  const resetForm = () => {
    setLoadTime(Date.now());
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot
    if (formData.get("website")) return;

    // Time-based bot check
    const loaded = Number(formData.get("_loaded"));
    if (Date.now() - loaded < 3000) {
      toast({ title: "Please wait a moment before submitting.", variant: "destructive" });
      return;
    }

    const name = (formData.get("name") as string || "").trim();
    const email = (formData.get("email") as string || "").trim();
    const company = (formData.get("company") as string || "").trim();
    const subject = (formData.get("subject") as string || "").trim();
    const message = (formData.get("message") as string || "").trim();

    if (!name || !email || !message) {
      toast({ title: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (message.length < 10) {
      toast({ title: "Message is too short.", variant: "destructive" });
      return;
    }

    setSending(true);

    const subjectLine = subject || `Contact from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}${company ? `\nCompany: ${company}` : ""}\n\n${message}`;
    const mailtoLink = `mailto:cparker@audaption.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      setSending(false);
      setOpen(false);
      form.reset();
      resetForm();
      toast({
        title: "✓ Message prepared!",
        description: "Your email client should have opened. If not, email cparker@audaption.com directly.",
      });
    }, 600);
  };

  return (
    <>
      {/* Fixed side tab button */}
      <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (v) resetForm(); }}>
        <SheetTrigger asChild>
          <button
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[200] hidden md:flex items-center gap-1.5 px-3 py-4 rounded-l-lg border border-r-0 border-primary/40 bg-primary text-primary-foreground font-sans text-[11px] tracking-[0.1em] uppercase font-medium cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <Mail size={14} />
            Contact Chad
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:w-[440px] p-0 border-l border-border bg-background overflow-y-auto z-[201]">
          <div className="px-6 md:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] mb-4">
                <Mail size={13} className="text-primary" />
                <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-primary font-medium">Get in Touch</span>
              </div>
              <h2 className="font-display text-[28px] font-extrabold text-foreground leading-[1.1] mb-2">
                Let's <em className="text-primary not-italic">Connect</em>
              </h2>
              <p className="font-sans text-[13px] text-muted-foreground leading-[1.7]">
                Whether you're exploring a strategic marketing challenge or just want to exchange ideas — I'd love to hear from you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
              <input type="hidden" name="_loaded" value={loadTime} />

              <div>
                <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                  Name <span className="text-primary">*</span>
                </label>
                <input
                  name="name" type="text" required maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  name="email" type="email" required maxLength={255}
                  className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  placeholder="you@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Company</label>
                  <input
                    name="company" type="text" maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Subject</label>
                  <input
                    name="subject" type="text" maxLength={200}
                    className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    placeholder="Topic"
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  name="message" required maxLength={2000} rows={5}
                  className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-foreground font-sans text-[13px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-y"
                  placeholder="Tell me about your project, challenge, or idea..."
                />
              </div>

              <button
                type="submit" disabled={sending}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-md bg-primary text-primary-foreground font-sans text-[12px] tracking-[0.1em] uppercase font-medium hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50"
              >
                {sending ? "Opening email…" : "Send Message"}
                <Send size={14} />
              </button>

              <p className="font-sans text-[10px] text-muted-foreground text-center">
                Opens your default email client with the message pre-filled.
              </p>
            </form>

            {/* Quick links */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              <a
                href="https://www.linkedin.com/in/chadelliot/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[12px] font-medium hover:border-primary hover:text-primary transition-colors no-underline"
              >
                <Linkedin size={15} className="text-primary" />
                LinkedIn Profile
                <span className="ml-auto text-[11px] text-muted-foreground">→</span>
              </a>
              <div className="flex items-center gap-2 px-4 py-2.5">
                <MapPin size={13} className="text-primary" />
                <span className="font-sans text-[11px] text-muted-foreground">Washington, D.C. Metro Area</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ContactSlideout;

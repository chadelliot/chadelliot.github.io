import { useState } from "react";
import { Send, Linkedin, MapPin, Mail, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadTime] = useState(Date.now());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website")) return;

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
    window.location.href = `mailto:cparker@audaption.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />

      <div className="animate-fadeUp px-6 md:px-20 py-16 md:py-24 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/[0.06] mb-6">
            <Mail size={13} className="text-primary" />
            <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-primary font-medium">Get in Touch</span>
          </div>
          <h1 className="font-display text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.1] mb-4">
            Let's <em className="text-primary not-italic">Connect</em>
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-muted-foreground max-w-[520px] leading-[1.85]">
            Whether you're exploring a strategic marketing challenge, considering a partnership, or just want to exchange ideas — I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-12 md:gap-20">
          {/* Form */}
          <div>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-primary" />
                </div>
                <h2 className="font-display text-[24px] font-bold text-foreground mb-2">Message Prepared</h2>
                <p className="font-sans text-[14px] text-muted-foreground max-w-[360px]">
                  Your email client should have opened with the message ready to send. If it didn't, feel free to reach out directly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 font-sans text-[11px] tracking-[0.12em] uppercase text-primary border border-primary/40 px-5 py-2.5 rounded hover:bg-primary/[0.06] transition-colors cursor-pointer bg-transparent"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px", opacity: 0 }} />
                <input type="hidden" name="_loaded" value={loadTime} />

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                      Name <span className="text-primary">*</span>
                    </label>
                    <input name="name" type="text" required maxLength={100} className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                      Email <span className="text-primary">*</span>
                    </label>
                    <input name="email" type="email" required maxLength={255} className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="you@company.com" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Company</label>
                    <input name="company" type="text" maxLength={100} className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="Your company" />
                  </div>
                  <div>
                    <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Subject</label>
                    <input name="subject" type="text" maxLength={200} className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" placeholder="What's this about?" />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Message <span className="text-primary">*</span>
                  </label>
                  <textarea name="message" required maxLength={2000} rows={6} className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground font-sans text-[14px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-y" placeholder="Tell me about your project, challenge, or idea..." />
                </div>

                <button type="submit" disabled={sending} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md bg-primary text-primary-foreground font-sans text-[12px] tracking-[0.1em] uppercase font-medium hover:opacity-90 transition-opacity cursor-pointer border-none disabled:opacity-50">
                  {sending ? "Opening email…" : "Send Message"}
                  <Send size={14} />
                </button>

                <p className="font-sans text-[11px] text-muted-foreground mt-2">
                  This will open your default email client with the message pre-filled.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Location */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display text-[15px] font-bold text-foreground mb-3 flex items-center gap-2">
                <MapPin size={15} className="text-primary" />
                Location
              </h3>
              <p className="font-sans text-[13px] text-muted-foreground leading-[1.7]">
                Washington, D.C. Metro Area<br />
                <span className="text-[12px]">Open to remote & hybrid opportunities</span>
              </p>
            </div>

            {/* Social */}
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-display text-[15px] font-bold text-foreground mb-4">Connect</h3>
              <a
                href="https://www.linkedin.com/in/chadelliot/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-md border border-border bg-background text-foreground font-sans text-[13px] font-medium hover:border-primary hover:text-primary transition-colors no-underline w-full"
              >
                <Linkedin size={18} />
                LinkedIn Profile
                <span className="ml-auto text-[11px] text-muted-foreground">→</span>
              </a>
            </div>

            {/* Availability */}
            <div className="p-6 rounded-lg border border-primary/30" style={{ background: "linear-gradient(135deg, rgba(47,163,127,0.06), rgba(47,163,127,0.02))" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-sans text-[11px] tracking-[0.12em] uppercase text-primary font-medium">Available</span>
              </div>
              <p className="font-sans text-[13px] text-muted-foreground leading-[1.7]">
                Currently open to consulting engagements, advisory roles, and strategic partnerships.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;

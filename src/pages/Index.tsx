import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeStrip from "@/components/MarqueeStrip";
import PillarsSection from "@/components/PillarsSection";
import Footer from "@/components/Footer";
import PublicReadableStyles from "@/components/PublicReadableStyles";

const AboutPage = () => {
  return (
    <div className="public-readable min-h-screen bg-background">
      <PublicReadableStyles />
      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <PillarsSection />
      <Footer />
    </div>
  );
};

export default AboutPage;

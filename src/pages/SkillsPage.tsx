import Navbar from "@/components/Navbar";
import ExpertiseSection from "@/components/ExpertiseSection";
import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";
import PublicReadableStyles from "@/components/PublicReadableStyles";

const SkillsPage = () => {
  return (
    <div className="public-readable min-h-screen bg-background pt-16">
      <PublicReadableStyles />
      <Navbar />
      <div className="animate-fadeUp">
        <ExpertiseSection />
        <EducationSection />
      </div>
      <Footer />
    </div>
  );
};

export default SkillsPage;

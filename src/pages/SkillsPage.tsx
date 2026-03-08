import Navbar from "@/components/Navbar";
import ExpertiseSection from "@/components/ExpertiseSection";
import EducationSection from "@/components/EducationSection";
import Footer from "@/components/Footer";

const SkillsPage = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
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

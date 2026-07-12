import Navbar from "@/components/Navbar";
import ExpertiseSection from "@/components/ExpertiseSection";
import TrackRecordSection from "@/components/TrackRecordSection";
import ToolsSection from "@/components/ToolsSection";
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
        <TrackRecordSection />
        <ToolsSection />
        <EducationSection />
      </div>
      <Footer />
    </div>
  );
};

export default SkillsPage;

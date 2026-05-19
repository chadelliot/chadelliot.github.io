import Navbar from "@/components/Navbar";
import QxoStorySection from "@/components/QxoStorySection";
import Footer from "@/components/Footer";
import PublicReadableStyles from "@/components/PublicReadableStyles";

const ApproachPage = () => {
  return (
    <div className="public-readable min-h-screen bg-background pt-16">
      <PublicReadableStyles />
      <Navbar />
      <div className="animate-fadeUp">
        <QxoStorySection />
      </div>
      <Footer />
    </div>
  );
};

export default ApproachPage;

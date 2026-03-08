import Navbar from "@/components/Navbar";
import QxoStorySection from "@/components/QxoStorySection";
import Footer from "@/components/Footer";

const ApproachPage = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />
      <div className="animate-fadeUp">
        <QxoStorySection />
      </div>
      <Footer />
    </div>
  );
};

export default ApproachPage;

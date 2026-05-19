import Navbar from "@/components/Navbar";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";
import PublicReadableStyles from "@/components/PublicReadableStyles";

const CareerPage = () => {
  return (
    <div className="public-readable min-h-screen bg-background pt-16">
      <PublicReadableStyles />
      <Navbar />
      <div className="animate-fadeUp">
        <TimelineSection />
      </div>
      <Footer />
    </div>
  );
};

export default CareerPage;

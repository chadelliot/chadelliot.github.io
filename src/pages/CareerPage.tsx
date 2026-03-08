import Navbar from "@/components/Navbar";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

const CareerPage = () => {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Navbar />
      <div className="animate-fadeUp">
        <TimelineSection />
      </div>
      <Footer />
    </div>
  );
};

export default CareerPage;

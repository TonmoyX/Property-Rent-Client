import BannerSection from "@/component/BannerSection";
import CustomerReviews from "@/component/CustomerReview";
import PopulerCity from "@/component/PopulerCity";
import RentalStatistics from "@/component/RentalStatistics";
import WhyChooseSection from "@/component/WhyChooseSection";

export default function Home() {
  return (
    <div>
    <BannerSection></BannerSection>
    <div className="my-20">
      <WhyChooseSection></WhyChooseSection>
      <PopulerCity></PopulerCity>
      <CustomerReviews></CustomerReviews>
      <RentalStatistics></RentalStatistics>
    </div>
    </div>
  );
}

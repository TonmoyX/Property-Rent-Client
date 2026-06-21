import { Suspense } from 'react';
import BannerSection from "@/component/BannerSection";
import CustomerReviews from "@/component/CustomerReview";
import PopulerCity from "@/component/PopulerCity";
import RentalStatistics from "@/component/RentalStatistics";
import WhyChooseSection from "@/component/WhyChooseSection";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div className="h-96 bg-gray-100" />}>
        <BannerSection />
      </Suspense>
      <div className="my-20">
        <WhyChooseSection></WhyChooseSection>
        <PopulerCity></PopulerCity>
        <CustomerReviews></CustomerReviews>
        <RentalStatistics></RentalStatistics>
      </div>
    </div>
  );
}

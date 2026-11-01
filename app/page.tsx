
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import BrowseCategories from "@/components/home/BrowseCategories";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <FeaturedStudios />
      <BrowseCategories />
      <HowItWorks />
    </main>
  );
}

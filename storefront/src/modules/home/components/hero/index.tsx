import AboutSection from "./AboutSection"
import BlogCarousel from "./BlogSection"
import CategoriesAndAges from "./CategoriesAndAges"
import FeatureStrip from "./FeatureStrip"
import HeroSlider from "./HeroSlider"
import PopularProducts from "./PopularProducts"
import Testimonials from "./TestimonialSection"
import WhatsAppButton from "./WhatsAppButton"
import { HttpTypes } from "@medusajs/types"

const Hero = ({ region }: { region: HttpTypes.StoreRegion }) => {
  return (
    <main className="w-full">
      <HeroSlider />
      <CategoriesAndAges />
      <AboutSection />
      <PopularProducts region={region} />
      <FeatureStrip />
      <Testimonials />
      <BlogCarousel />
      <WhatsAppButton
        phoneNumber="919321791644"
        message="Hello from The Joy Junction! .m interested in learning more about your educational toys."
      />
    </main>
  )
}

export default Hero

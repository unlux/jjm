import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import AboutSection from "./AboutSection"
import BlogCarousel from "./BlogSection"
import CategoriesAndAges from "./CategoriesAndAges"
import FeatureStrip from "./FeatureStrip"
// import Footer from "./Footer";
import HeroSlider from "./HeroSlider"
// import Navbar from "./Navbar";
import PopularProducts from "./PopularProducts"
import Testimonials from "./TestimonialSection"
import WhatsAppButton from "./WhatsAppButton"

const Hero = () => {
  return (
    <main className="w-full">
      {/* <Marquee /> */}
      {/* <Navbar /> */}
      <HeroSlider />
      <CategoriesAndAges />
      <AboutSection />
      <PopularProducts />
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

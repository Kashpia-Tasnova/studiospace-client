"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { authClient } from "@/lib/auth-client";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    subtitle: "FIND YOUR CREATIVE SPACE",
    title: "Where Your Creative Vision Comes to Life",
    description:
      "Discover inspiring studios and professional workspaces designed to bring your ideas to life.",
    buttonText: "Explore Studios",
    image: "/images/hero-slider-1.avif",
  },
  {
    id: 2,
    subtitle: "CREATE WITHOUT LIMITS",
    title: "The Perfect Space for Every Story",
    description:
      "From photography and filmmaking to podcasts, find the perfect environment for your next project.",
    buttonText: "Find Your Studio",
    image: "/images/hero-slider-2.avif",
  },
  {
    id: 3,
    subtitle: "TURN YOUR SPACE INTO OPPORTUNITY",
    title: "Share Your Studio with the Creative World",
    description:
      "List your creative space, connect with talented creators, and turn your studio into an opportunity.",
    buttonText: "Become a Host",
    image: "/images/hero-slider-3.avif",
  },
];

export default function HeroSlider() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        className="hero-swiper"
      >
        {slides.map((slide) => {
          const buttonHref =
            slide.id === 3
              ? session?.user
                ? "/add-studio"
                : "/login?callbackURL=%2Fadd-studio"
              : "/studios";

          return (
            <SwiperSlide key={slide.id}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `url("${encodeURI(slide.image)}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="hero-overlay">
                  <div className="hero-content">
                    <span className="hero-subtitle">
                      {slide.subtitle}
                    </span>

                    <h1>{slide.title}</h1>

                    <p>{slide.description}</p>

                    <Link href={buttonHref} className="hero-button">
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const categories = [
  {
    name: "Photography Studios",
    value: "Photography",
    description: "Capture your vision in the perfect setting.",
    image:
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=900&auto=format&fit=crop",
  },
  {
    name: "Music Studios",
    value: "Music",
    description: "Create, record, and bring your sound to life.",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900&auto=format&fit=crop",
  },
  {
    name: "Podcast Rooms",
    value: "Podcast",
    description: "Find the right space for your next conversation.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&auto=format&fit=crop",
  },
  {
    name: "Art Workshops",
    value: "Art & Design",
    description: "Explore inspiring spaces for artistic expression.",
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&auto=format&fit=crop",
  },
  {
    name: "Dance Studios",
    value: "Dance",
    description: "Move freely in spaces designed for movement.",
    image:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&auto=format&fit=crop",
  },
];

export default function BrowseCategories() {
  return (
    <section className="overflow-hidden bg-white px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-[#F5F0E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
              Explore by category
            </span>

            <h2 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl lg:text-5xl">
              Spaces for Every
              <span className="font-serif italic font-medium text-[#A67C63]">
                {" "}Creative Vision.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#71665F] sm:text-base">
              Whatever you're creating, discover a space designed to inspire
              your best work.
            </p>
          </div>

          <Link
            href="/studios"
            className="!inline-flex !w-fit !items-center !justify-center !rounded-xl !bg-[#A67C63] !px-7 !py-3.5 !text-sm !font-semibold !text-white !no-underline transition-all duration-300 hover:!bg-[#202020]"
          >
            Explore All Categories
          </Link>
        </div>

        {/* Swipeable Category Carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1.1}
          loop={true}
          grabCursor={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="!overflow-visible"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.value}>
              <Link
                href={`/studios?category=${encodeURIComponent(category.value)}`}
                className="group relative block h-[300px] overflow-hidden rounded-2xl bg-[#202020] sm:h-[340px]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-all duration-300 group-hover:from-black/90" />

                {/* Card Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    {category.name}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-white/75">
                    {category.description}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <p className="mt-7 text-center text-xs font-medium tracking-wide text-[#81756D]">
          SWIPE TO EXPLORE MORE CATEGORIES
        </p>
      </div>
    </section>
  );
}

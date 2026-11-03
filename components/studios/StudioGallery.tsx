
"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface StudioGalleryProps {
  images: string[];
  studioName: string;
}

export default function StudioGallery({
  images,
  studioName,
}: StudioGalleryProps) {
  const galleryImages = images.filter(Boolean);

  if (galleryImages.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-3xl bg-[#E8D9CC] text-sm text-[#795548] sm:h-[360px] lg:h-[480px]">
        No studio images available.
      </div>
    );
  }

  return (
    <div className="studio-gallery relative overflow-hidden rounded-2xl sm:rounded-3xl">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={galleryImages.length > 1}
        autoplay={
          galleryImages.length > 1
            ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        pagination={{
          clickable: true,
        }}
        className="studio-gallery-swiper"
      >
        {galleryImages.map((image, index) => (
          <SwiperSlide key={`${image}-${index}`}>
            <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[360px] lg:h-[480px]">
              <div className="relative h-full w-[80%] overflow-hidden rounded-xl bg-[#E8D9CC] sm:rounded-2xl">
                <Image
                  src={image}
                  alt={`${studioName} - Gallery image ${index + 1}`}
                  fill
                  priority={index === 0}
                  quality={100}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 72vw, 960px"
                  className="object-contain p-2 sm:p-3"
                  unoptimized
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-5 right-5 z-10 rounded-full bg-black/45 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
        {galleryImages.length} {galleryImages.length === 1 ? "Photo" : "Photos"}
      </div>

      <style jsx global>{`
        .studio-gallery .swiper-pagination {
          bottom: 18px !important;
          left: 12% !important;
          width: auto !important;
          text-align: left !important;
        }

        .studio-gallery .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          margin: 0 4px !important;
          background: #795548;
          opacity: 0.65;
        }

        .studio-gallery .swiper-pagination-bullet-active {
          width: 22px;
          border-radius: 10px;
          background: #795548;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

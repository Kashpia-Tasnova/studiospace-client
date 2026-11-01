
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Star } from "lucide-react";
import { getFeaturedStudios, type Studio } from "@/lib/studios";

const studioImages: Record<string, string> = {
  Photography:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop",
  Music:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop",
  Podcast:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&auto=format&fit=crop",
  "Art & Design":
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop",
  Dance:
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&auto=format&fit=crop",
  Workshop:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop",
};

export default async function FeaturedStudios() {
  let studios: Studio[] = [];

  try {
    studios = await getFeaturedStudios();
  } catch (error) {
    console.error("Failed to load featured studios:", error);
  }

  return (
    <section
       id="featured-studios"
       className="scroll-mt-24 bg-[#F5F0E8] px-5 py-20 sm:px-8 lg:px-16 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-[#E8D9CC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
              Curated spaces for creators
            </span>

            <h2 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl lg:text-5xl">
              Find Your Perfect
              <span className="font-serif italic font-medium text-[#A67C63]">
                {" "}Creative Space.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#71665F] sm:text-base">
              Discover inspiring studios designed to bring your ideas to life.
              From photography to music, find a space that fits your vision.
            </p>
          </div>

          <Link
            href="/studios"
            className="!inline-flex !w-fit !items-center !justify-center !rounded-xl !bg-[#A67C63] !px-7 !py-3.5 !text-sm !font-semibold !text-white !no-underline transition-all duration-300 hover:!bg-[#202020] hover:!text-white"
          >
            <span className="!text-white">Explore All Studios</span>
          </Link>
        </div>

        {/* Studio Cards */}
        {studios.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <Link
                key={studio._id}
                href={`/studios/${studio._id}`}
                className="group overflow-hidden rounded-2xl border border-[#E8D9CC] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(32,32,32,0.12)]"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-[#E8D9CC]">
                  <Image
                    src={
                      studioImages[studio.category] ||
                      studioImages.Photography
                    }
                    alt={studio.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#795548] shadow-sm">
                    {studio.category}
                  </div>

                  <div className="absolute right-4 top-4 rounded-full bg-[#F5F0E8] px-3 py-2 text-xs font-semibold text-[#795548]">
                    Available
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-[#202020] transition-colors group-hover:text-[#795548]">
                      {studio.name}
                    </h3>

                    {/* Rating Badge */}
                    {typeof studio.rating === "number" && (
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF4D8] px-3 py-2 text-xs font-bold text-[#8A641B]">
                        <Star size={14} fill="currentColor" />
                        {studio.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <p className="mt-3 flex items-center gap-2 text-sm text-[#81756D]">
                    <MapPin size={16} className="shrink-0 text-[#A67C63]" />
                    {studio.location}
                  </p>

                  <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#71665F]">
                    {studio.description}
                  </p>

                  <div className="my-5 border-t border-[#E8D9CC]" />

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#81756D]">
                        Starting from
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#795548]">
                        ${studio.price.toLocaleString("en-US")}
                        <span className="text-xs font-normal text-[#81756D]">
                          {" "}/ hour
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-[#F5F0E8] px-3 py-2 text-xs font-medium text-[#795548]">
                      <Users size={15} />
                      {studio.capacity} people
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-center rounded-xl bg-[#F5F0E8] px-4 py-3 text-sm font-semibold text-[#795548] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
                    View Studio Details
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E8D9CC] bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-[#202020]">
              Studios are temporarily unavailable
            </h3>
            <p className="mt-2 text-sm text-[#81756D]">
              Please check back soon to discover our creative spaces.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

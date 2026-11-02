
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  Star,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Wifi,
  Snowflake,
  Lightbulb,
  Camera,
  Car,
  Mic,
  Volume2,
  Headphones,
  SlidersHorizontal,
  Palette,
  Sun,
  Warehouse,
  Music,
  Projector,
  Presentation,
  Monitor,
  CheckCircle2,
} from "lucide-react";

import { getStudioById } from "@/lib/studios";
import StudioGallery from "@/components/studios/StudioGallery";

const studioImages: Record<string, string> = {
  Photography:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop",
  Music:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop",
  Podcast:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fit=crop",
  "Art & Design":
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop",
  Dance:
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=1200&auto=format&fit=crop",
  Workshop:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop",
};

const amenityIcons = [
  { keywords: ["wi-fi", "wifi", "internet"], icon: Wifi },
  { keywords: ["air conditioning", "air-conditioned"], icon: Snowflake },
  { keywords: ["lighting", "light"], icon: Lightbulb },
  { keywords: ["photography", "camera"], icon: Camera },
  { keywords: ["parking"], icon: Car },
  { keywords: ["microphone", "mic"], icon: Mic },
  { keywords: ["sound", "audio"], icon: Volume2 },
  { keywords: ["headphone"], icon: Headphones },
  { keywords: ["mixer", "mixing"], icon: SlidersHorizontal },
  { keywords: ["art", "painting", "drawing"], icon: Palette },
  { keywords: ["natural"], icon: Sun },
  { keywords: ["storage"], icon: Warehouse },
  { keywords: ["music"], icon: Music },
  { keywords: ["projector"], icon: Projector },
  { keywords: ["presentation", "whiteboard"], icon: Presentation },
  { keywords: ["equipment"], icon: Monitor },
];

function getAmenityIcon(amenity: string) {
  const normalizedAmenity = amenity.toLowerCase();

  const matchedAmenity = amenityIcons.find((item) =>
    item.keywords.some((keyword) => normalizedAmenity.includes(keyword))
  );

  return matchedAmenity?.icon || CheckCircle2;
}

interface StudioDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudioDetailsPage({
  params,
}: StudioDetailsPageProps) {
  const { id } = await params;

  let studio;

  try {
    studio = await getStudioById(id);
  } catch (error) {
    console.error("Failed to load studio details:", error);
    notFound();
  }

  const studioImage =
    studioImages[studio.category] || studioImages.Photography;

  const galleryImages =
    studio.images && studio.images.length > 0
      ? studio.images
      : [studioImage];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F5F0] px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-14 xl:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/studios"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#795548] transition-colors hover:text-[#202020] sm:mb-8"
        >
          <ArrowLeft size={18} />
          Back to Explore Studios
        </Link>

        {/* Studio Image Gallery */}
        <StudioGallery
          images={galleryImages}
          studioName={studio.name}
        />

        {/* Studio Information */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_350px] xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 xl:gap-14">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Studio Title and Rating */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A67C63] sm:text-xs">
                  Your Creative Destination
                </span>

                <h1 className="mt-2 break-words text-2xl font-bold leading-tight text-[#202020] sm:text-3xl md:text-4xl xl:text-5xl">
                  {studio.name}
                </h1>
              </div>

              {typeof studio.rating === "number" && (
                <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[#FFF4D8] px-4 py-3 text-sm font-bold text-[#8A641B]">
                  <Star size={18} fill="currentColor" />
                  {studio.rating.toFixed(1)}
                  <span className="font-normal">/ 5</span>
                </div>
              )}
            </div>

            {/* Location and Capacity */}
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#71665F] sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="shrink-0 text-[#A67C63]" />
                <span>{studio.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={18} className="shrink-0 text-[#A67C63]" />
                <span>Up to {studio.capacity} guests</span>
              </div>
            </div>

            <div className="my-8 border-t border-[#E8D9CC] sm:my-10" />

            {/* About This Studio */}
            <section>
              <h2 className="text-xl font-bold text-[#202020] sm:text-2xl">
                About This Studio
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#71665F] sm:mt-5 sm:text-base sm:leading-8">
                {studio.description}
              </p>
            </section>

            {/* Studio Highlights */}
            <section className="mt-10 sm:mt-12">
              <h2 className="text-xl font-bold text-[#202020] sm:text-2xl">
                Studio Highlights
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-4 sm:p-5">
                  <div className="shrink-0 rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <Users size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#202020]">
                      Guest Capacity
                    </p>
                    <p className="mt-1 text-xs text-[#81756D]">
                      Up to {studio.capacity} people
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-4 sm:p-5">
                  <div className="shrink-0 rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <Clock size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#202020]">
                      Flexible Booking
                    </p>
                    <p className="mt-1 text-xs text-[#81756D]">
                      Hourly rental pricing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-4 sm:col-span-2 sm:p-5">
                  <div className="shrink-0 rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <ShieldCheck size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#202020]">
                      Studio Availability
                    </p>
                    <p className="mt-1 text-xs capitalize text-[#81756D]">
                      {studio.status}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Studio Amenities */}
            <section className="mt-10 sm:mt-12">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A67C63] sm:text-xs">
                  What's Included
                </span>

                <h2 className="mt-2 text-xl font-bold text-[#202020] sm:text-2xl">
                  Studio Amenities
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#81756D]">
                  Enjoy the facilities and equipment available to make your
                  creative experience comfortable and productive.
                </p>
              </div>

              {studio.amenities && studio.amenities.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:mt-6 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {studio.amenities.map((amenity, index) => {
                    const AmenityIcon = getAmenityIcon(amenity);

                    return (
                      <div
                        key={`${amenity}-${index}`}
                        className="group flex min-h-[104px] items-center gap-3 rounded-2xl border border-[#E8D9CC] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#C7A58E] hover:shadow-[0_10px_25px_rgba(121,85,72,0.08)] sm:min-h-[116px] sm:flex-col sm:items-start sm:justify-center sm:gap-3 sm:p-5"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E8] text-[#A67C63] transition-colors duration-300 group-hover:bg-[#795548] group-hover:text-white">
                          <AmenityIcon size={21} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-5 text-[#202020]">
                            {amenity}
                          </p>
                          <p className="mt-1 text-xs text-[#A0958D]">
                            Included facility
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-[#E8D9CC] bg-white p-5 text-sm text-[#81756D]">
                  No amenities information is available for this studio yet.
                </p>
              )}
            </section>
          </div>

          {/* Booking Price Card */}
          <aside className="min-w-0 lg:self-start">
            <div className="rounded-3xl border border-[#E8D9CC] bg-white p-5 shadow-[0_15px_40px_rgba(32,32,32,0.06)] sm:p-7 lg:sticky lg:top-28">
              <p className="text-sm font-medium text-[#81756D]">
                Starting from
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-2">
                <span className="text-3xl font-bold text-[#795548] sm:text-4xl">
                  ${studio.price.toLocaleString("en-US")}
                </span>

                <span className="pb-1 text-sm text-[#81756D]">
                  / hour
                </span>
              </div>

              <div className="my-5 border-t border-[#E8D9CC] sm:my-6" />

              <div className="space-y-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#81756D]">Category</span>
                  <span className="text-right font-semibold text-[#202020]">
                    {studio.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#81756D]">Capacity</span>
                  <span className="text-right font-semibold text-[#202020]">
                    {studio.capacity} people
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#81756D]">Availability</span>
                  <span className="text-right font-semibold capitalize text-[#795548]">
                    {studio.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={studio.status !== "available"}
                className="mt-7 w-full rounded-xl bg-[#A67C63] px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Book This Studio
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-[#81756D]">
                Booking functionality will be available soon.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

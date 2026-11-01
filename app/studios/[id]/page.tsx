
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
} from "lucide-react";
import { getStudioById } from "@/lib/studios";

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

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/studios"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#795548] transition-colors hover:text-[#202020]"
        >
          <ArrowLeft size={18} />
          Back to Explore Studios
        </Link>

        {/* Studio Image - Without Category and Availability Badges */}
        <div className="relative h-[280px] overflow-hidden rounded-3xl bg-[#E8D9CC] sm:h-[400px] lg:h-[500px]">
          <Image
            src={studioImage}
            alt={studio.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Studio Information */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C63]">
                  Your Creative Destination
                </span>

                <h1 className="mt-3 text-3xl font-bold text-[#202020] sm:text-4xl lg:text-5xl">
                  {studio.name}
                </h1>
              </div>

              {typeof studio.rating === "number" && (
                <div className="flex items-center gap-2 rounded-xl bg-[#FFF4D8] px-4 py-3 text-sm font-bold text-[#8A641B]">
                  <Star size={18} fill="currentColor" />
                  {studio.rating.toFixed(1)}
                  <span className="font-normal">/ 5</span>
                </div>
              )}
            </div>

            {/* Location and Capacity */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#71665F]">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#A67C63]" />
                {studio.location}
              </div>

              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#A67C63]" />
                Up to {studio.capacity} guests
              </div>
            </div>

            <div className="my-10 border-t border-[#E8D9CC]" />

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-[#202020]">
                About This Studio
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#71665F] sm:text-base">
                {studio.description}
              </p>
            </section>

            {/* Studio Features */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-[#202020]">
                Studio Highlights
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-5">
                  <div className="rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <Users size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#202020]">
                      Guest Capacity
                    </p>
                    <p className="mt-1 text-xs text-[#81756D]">
                      Up to {studio.capacity} people
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-5">
                  <div className="rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <Clock size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#202020]">
                      Flexible Booking
                    </p>
                    <p className="mt-1 text-xs text-[#81756D]">
                      Hourly rental pricing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-5 sm:col-span-2">
                  <div className="rounded-xl bg-[#F5F0E8] p-3 text-[#A67C63]">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
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
          </div>

          {/* Booking Price Card */}
          <aside>
            <div className="sticky top-28 rounded-3xl border border-[#E8D9CC] bg-white p-7 shadow-[0_15px_40px_rgba(32,32,32,0.06)]">
              <p className="text-sm font-medium text-[#81756D]">
                Starting from
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-bold text-[#795548]">
                  ${studio.price.toLocaleString("en-US")}
                </span>

                <span className="pb-1 text-sm text-[#81756D]">
                  / hour
                </span>
              </div>

              <div className="my-6 border-t border-[#E8D9CC]" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#81756D]">Category</span>
                  <span className="font-semibold text-[#202020]">
                    {studio.category}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#81756D]">Capacity</span>
                  <span className="font-semibold text-[#202020]">
                    {studio.capacity} people
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#81756D]">Availability</span>
                  <span className="font-semibold capitalize text-[#795548]">
                    {studio.status}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={studio.status !== "available"}
                className="mt-8 w-full rounded-xl bg-[#A67C63] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-50"
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

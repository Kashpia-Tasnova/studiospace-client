
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Loader2,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  securityDeposit: number;
  capacity: number;
  images?: string[];
  status: string;
};

export default function StudioBookingPage() {
  const params = useParams();
  const router = useRouter();
  const studioId = params.id as string;

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState("1");

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      router.replace(
        `/login?callbackURL=${encodeURIComponent(
          `/studios/${studioId}/book`
        )}`
      );
    }
  }, [session, sessionLoading, router, studioId]);

  useEffect(() => {
    if (sessionLoading || !session || !studioId) return;

    const fetchStudio = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(
          `${API_URL}/api/studios/${studioId}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Studio not found.");
        }

        setStudio(result.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load studio details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudio();
  }, [session, sessionLoading, studioId]);

  const duration = useMemo(() => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (end <= start) return 0;

    return (end - start) / 60;
  }, [startTime, endTime]);

  const totalPrice = studio ? duration * studio.price : 0;
  const securityDeposit = studio?.securityDeposit ?? 0;
  const totalAmount = totalPrice + securityDeposit;

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studio) return;

    if (!bookingDate || !startTime || !endTime) {
      toast.error("Please complete all booking details.");
      return;
    }

    if (bookingDate < minDate) {
      toast.error("Please select today or a future date.");
      return;
    }

    if (duration <= 0) {
      toast.error("End time must be later than start time.");
      return;
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > studio.capacity
    ) {
      toast.error(
        `Guest count must be between 1 and ${studio.capacity}.`
      );
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId,
          bookingDate,
          startTime,
          endTime,
          guests: guestCount,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Booking could not be completed.");
      }

      toast.success("Your studio booking request has been submitted!");
      router.push("/my-bookings");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionLoading || (!session && !loading)) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F5F0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#795548]" />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F5F0]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#795548]" />
          <p className="mt-4 text-sm text-[#81756D]">
            Loading booking details...
          </p>
        </div>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F5F0] px-5">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-[#A67C63]" />
          <h1 className="mt-4 text-2xl font-bold text-[#30251F]">
            Studio Not Found
          </h1>
          <p className="mt-2 text-sm text-[#81756D]">
            We could not find the studio you want to book.
          </p>
          <Link
            href="/studios"
            className="mt-6 inline-block rounded-xl bg-[#A67C63] px-6 py-3 text-sm font-semibold !text-white hover:bg-[#202020]"
          >
            Explore Studios
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/studios/${studioId}`}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#795548] transition hover:text-[#30251F]"
        >
          <ArrowLeft size={17} />
          Back to Studio Details
        </Link>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C63]">
            Complete Your Reservation
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#30251F] sm:text-4xl">
            Book Your Studio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81756D]">
            Choose your preferred date and time, provide the number of
            guests, and submit your booking request.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-[#E5DDD5] bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#30251F]">
              Booking Information
            </h2>
            <p className="mt-2 text-sm text-[#81756D]">
              Fill in the details for your studio reservation.
            </p>

            <form onSubmit={handleBooking} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="bookingDate"
                  className="mb-2 block text-sm font-semibold text-[#30251F]"
                >
                  Booking Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C63]"
                  />
                  <input
                    id="bookingDate"
                    type="date"
                    min={minDate}
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E5DDD5] bg-[#FCFAF8] py-3.5 pl-11 pr-4 text-sm text-[#30251F] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="startTime"
                    className="mb-2 block text-sm font-semibold text-[#30251F]"
                  >
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C63]"
                    />
                    <input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#E5DDD5] bg-[#FCFAF8] py-3.5 pl-11 pr-4 text-sm text-[#30251F] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="endTime"
                    className="mb-2 block text-sm font-semibold text-[#30251F]"
                  >
                    End Time
                  </label>
                  <div className="relative">
                    <Clock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C63]"
                    />
                    <input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      required
                      className="w-full rounded-xl border border-[#E5DDD5] bg-[#FCFAF8] py-3.5 pl-11 pr-4 text-sm text-[#30251F] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-semibold text-[#30251F]"
                >
                  Number of Guests
                </label>
                <div className="relative">
                  <Users
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C63]"
                  />
                  <input
                    id="guests"
                    type="number"
                    min="1"
                    max={studio.capacity}
                    value={guests}
                    onChange={(event) => setGuests(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#E5DDD5] bg-[#FCFAF8] py-3.5 pl-11 pr-4 text-sm text-[#30251F] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                  />
                </div>
                <p className="mt-2 text-xs text-[#81756D]">
                  Maximum capacity: {studio.capacity} guests
                </p>
              </div>

              <div className="rounded-xl bg-[#F8F5F0] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Booking duration</span>
                  <span className="font-semibold text-[#30251F]">
                    {duration > 0 ? `${duration} hours` : "Not selected"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Hourly rate</span>
                  <span className="font-semibold text-[#30251F]">
                    ${studio.price.toLocaleString("en-US")} / hour
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Studio rental</span>
                  <span className="font-semibold text-[#30251F]">
                    ${totalPrice.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Security deposit</span>
                  <span className="font-semibold text-[#30251F]">
                    ${securityDeposit.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="my-4 border-t border-[#E5DDD5]" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#30251F]">
                    Estimated Total
                  </span>
                  <span className="text-xl font-bold text-[#795548]">
                    ${totalAmount.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#81756D]">
                  This is an estimated amount. Your booking request will be
                  submitted for confirmation.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || studio.status !== "available"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A67C63] px-5 py-4 text-sm font-semibold !text-white transition-all duration-300 hover:bg-[#202020] hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting Booking...
                  </>
                ) : (
                  "Confirm Booking Request"
                )}
              </button>

              {studio.status !== "available" && (
                <p className="text-center text-sm text-red-600">
                  This studio is currently unavailable for booking.
                </p>
              )}
            </form>
          </section>

          <aside className="h-fit overflow-hidden rounded-2xl border border-[#E5DDD5] bg-white shadow-sm">
            {studio.images?.[0] ? (
              <img
                src={studio.images[0]}
                alt={studio.name}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 items-center justify-center bg-[#EDE5DD]">
                <Building2 size={48} className="text-[#A67C63]" />
              </div>
            )}

            <div className="p-6">
              <span className="rounded-full bg-[#F3ECE6] px-3 py-1 text-xs font-semibold text-[#795548]">
                {studio.category}
              </span>

              <h2 className="mt-4 text-xl font-bold text-[#30251F]">
                {studio.name}
              </h2>

              <p className="mt-3 flex items-center gap-2 text-sm text-[#81756D]">
                <MapPin size={17} className="shrink-0 text-[#A67C63]" />
                {studio.location}
              </p>

              <div className="mt-5 border-t border-[#E5DDD5] pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Hourly price</span>
                  <span className="font-bold text-[#795548]">
                    ${studio.price.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#81756D]">Guest capacity</span>
                  <span className="font-semibold text-[#30251F]">
                    {studio.capacity} people
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 rounded-xl bg-[#F8F5F0] p-4">
                <ShieldCheck
                  size={22}
                  className="shrink-0 text-[#A67C63]"
                />
                <p className="text-xs leading-5 text-[#81756D]">
                  Your booking request will be saved to your account. You
                  can track its status from My Bookings.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

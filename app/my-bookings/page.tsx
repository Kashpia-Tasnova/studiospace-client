
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Wallet,
  Building2,
  Loader2,
  XCircle,
  ArrowRight,
  CalendarCheck,
  X,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Booking {
  _id: string;
  studioId: string;
  studioName: string;
  studioImage?: string;
  studioLocation?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  guests: number;
  hourlyRate: number;
  totalPrice: number;
  securityDeposit: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusStyle(status: Booking["status"]) {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Confirmed":
      return "bg-green-100 text-green-800";
    case "Completed":
      return "bg-blue-100 text-blue-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Count only bookings that have not been cancelled.
  const activeBookingsCount = bookings.filter(
    (booking) => booking.status !== "Cancelled"
  ).length;

  const fetchBookings = useCallback(async () => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/bookings/my-bookings`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings");
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load your bookings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    fetchBookings();
  }, [session, isPending, router, fetchBookings]);

  const handleCancelBooking = async () => {
    if (!selectedBooking || !API_URL) return;

    const bookingId = selectedBooking._id;

    try {
      setCancellingId(bookingId);

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully");
      setSelectedBooking(null);

      await fetchBookings();
    } catch (error) {
      console.error("Cancel booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not cancel booking"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F5F0]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#795548]" />
          <p className="text-sm font-medium text-[#795548]">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#A67C63]">
            Your Reservations
          </p>

          <h1 className="text-3xl font-semibold text-[#30251F] sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#786B62] sm:text-base">
            Keep track of your studio reservations, booking details, and
            reservation status in one place.
          </p>
        </div>

        {/* Booking count */}
        <div className="mb-7 flex items-center justify-between rounded-xl border border-[#E8DED5] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F3EAE2]">
              <CalendarCheck className="h-5 w-5 text-[#795548]" />
            </div>

            <div>
              <p className="text-sm text-[#786B62]">Total Reservations</p>
              <p className="text-xl font-semibold text-[#30251F]">
                {activeBookingsCount}
              </p>
            </div>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-xl bg-[#A67C63] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#30251F] hover:!text-white"
          >
            Explore Studios
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-[#E8DED5] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F3EAE2]">
              <CalendarDays className="h-9 w-9 text-[#A67C63]" />
            </div>

            <h2 className="text-xl font-semibold text-[#30251F]">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#786B62]">
              You haven't reserved any creative spaces yet. Explore our
              studios and find the perfect place for your next project.
            </p>

            <Link
              href="/studios"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#A67C63] px-6 py-3 text-sm font-semibold !text-white transition hover:bg-[#30251F] hover:!text-white"
            >
              Explore Studios
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Booking cards */
          <div className="space-y-6">
            {bookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-[#E8DED5] bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="grid md:grid-cols-[260px_1fr]">
                  {/* Studio image */}
                  <div className="relative h-56 bg-[#EDE5DD] md:h-full">
                    {booking.studioImage ? (
                      <img
                        src={booking.studioImage}
                        alt={booking.studioName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-56 items-center justify-center">
                        <Building2 className="h-14 w-14 text-[#A67C63]" />
                      </div>
                    )}
                  </div>

                  {/* Booking details */}
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A67C63]">
                          Studio Reservation
                        </p>

                        <h2 className="text-xl font-semibold text-[#30251F]">
                          {booking.studioName}
                        </h2>

                        {booking.studioLocation && (
                          <p className="mt-2 flex items-center gap-2 text-sm text-[#786B62]">
                            <MapPin size={15} />
                            {booking.studioLocation}
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="my-6 grid grid-cols-1 gap-4 border-y border-[#EFE8E2] py-5 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-5 w-5 text-[#A67C63]" />
                        <div>
                          <p className="text-xs text-[#96877D]">
                            Booking Date
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#30251F]">
                            {formatDate(booking.bookingDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 text-[#A67C63]" />
                        <div>
                          <p className="text-xs text-[#96877D]">
                            Booking Time
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#30251F]">
                            {formatTime(booking.startTime)} –{" "}
                            {formatTime(booking.endTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users className="mt-0.5 h-5 w-5 text-[#A67C63]" />
                        <div>
                          <p className="text-xs text-[#96877D]">Guests</p>
                          <p className="mt-1 text-sm font-medium text-[#30251F]">
                            {booking.guests} Guests
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price summary */}
                    <div className="flex flex-wrap items-end justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[#786B62]">
                          <Wallet size={16} />
                          <span>Booking Summary</span>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-[#786B62]">
                          <p>
                            {booking.durationHours} hours × $
                            {booking.hourlyRate}/hour
                          </p>
                          <p>
                            Security Deposit: ${booking.securityDeposit}
                          </p>
                        </div>

                        <p className="mt-3 text-xl font-semibold text-[#795548]">
                          Total: $
                          {(
                            booking.totalPrice + booking.securityDeposit
                          ).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/studios/${booking.studioId}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#D9C9BC] px-4 py-2.5 text-sm font-semibold text-[#795548] transition hover:bg-[#F8F5F0]"
                        >
                          View Studio
                        </Link>

                        {booking.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <XCircle size={16} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Custom cancellation confirmation modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onClick={(event) => {
            if (
              event.target === event.currentTarget &&
              !cancellingId
            ) {
              setSelectedBooking(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-booking-title"
            className="relative w-full max-w-md rounded-2xl border border-[#E8DED5] bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              disabled={cancellingId !== null}
              aria-label="Close confirmation"
              className="absolute right-4 top-4 rounded-full p-2 text-[#786B62] transition hover:bg-[#F3EAE2] hover:text-[#30251F] disabled:opacity-50"
            >
              <X size={20} />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <div className="text-center">
              <h2
                id="cancel-booking-title"
                className="text-xl font-semibold text-[#30251F]"
              >
                Cancel This Booking?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#786B62]">
                Are you sure you want to cancel your reservation for{" "}
                <span className="font-semibold text-[#30251F]">
                  {selectedBooking.studioName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                disabled={cancellingId !== null}
                className="flex-1 rounded-xl border border-[#D9C9BC] px-5 py-3 text-sm font-semibold text-[#795548] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancellingId !== null}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingId !== null ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    Yes, Cancel Booking
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

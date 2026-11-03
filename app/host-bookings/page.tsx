
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Users,
  X,
  XCircle,
  Building2,
  RefreshCw,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

interface Booking {
  _id: string;
  studioId: string;
  studioName: string;
  studioImage?: string;
  studioLocation?: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  guests: number;
  hourlyRate: number;
  totalPrice: number;
  securityDeposit: number;
  status: BookingStatus;
  createdAt: string;
  cancelledBy?: "customer" | "host";
}

const statusStyles: Record<BookingStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-green-100 text-green-800",
  Completed: "bg-blue-100 text-blue-800",
  Cancelled: "bg-red-100 text-red-800",
};

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount: number) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

export default function HostBookingsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!API_URL) {
      toast.error("API URL is not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/bookings/host-bookings`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to retrieve bookings"
        );
      }

      setBookings(result.data || []);
    } catch (error) {
      console.error("Host bookings error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load bookings"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      window.location.replace("/login");
      return;
    }

    fetchBookings();
  }, [session, sessionLoading, fetchBookings]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;

    return bookings.filter(
      (booking) => booking.status === activeFilter
    );
  }, [bookings, activeFilter]);

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "Confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const updateBookingStatus = async (
    booking: Booking,
    status: BookingStatus
  ) => {
    if (status === "Pending") return;

    try {
      setUpdatingId(booking._id);

      const response = await fetch(
        `${API_URL}/api/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update booking"
        );
      }

      toast.success(result.message || "Booking status updated");

      setSelectedBooking(null);

      await fetchBookings();
    } catch (error) {
      console.error("Booking status update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filters = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
  ];

  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-9 h-9 animate-spin text-[#795548]" />
          <p className="text-sm text-[#796b62]">
            Loading your booking requests...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
        

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-[#a67c63] mb-2">
                Host Dashboard
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-[#30251f]">
                Booking Management
              </h1>

              <p className="text-[#796b62] mt-2">
                Manage customer reservations for your studios.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8c9bd] bg-white px-4 py-2.5 text-sm font-medium text-[#604438] hover:bg-[#f1eae4] transition disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Bookings
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white border border-[#e8dfd7] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#796b62]">
                  Pending Requests
                </p>
                <h2 className="text-3xl font-bold text-[#30251f] mt-2">
                  {pendingCount}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#e8dfd7] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#796b62]">
                  Confirmed Bookings
                </p>
                <h2 className="text-3xl font-bold text-[#30251f] mt-2">
                  {confirmedCount}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-[#e8dfd7] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#796b62]">
                  Completed Bookings
                </p>
                <h2 className="text-3xl font-bold text-[#30251f] mt-2">
                  {completedCount}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <Check size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Filters */}
        <div className="bg-white border border-[#e8dfd7] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <h2 className="font-semibold text-[#30251f]">
              All Reservations
            </h2>

            <span className="text-sm text-[#796b62]">
              {filteredBookings.length} booking
              {filteredBookings.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-[#604438] text-white"
                    : "bg-[#f5f0eb] text-[#796b62] hover:bg-[#eae0d8]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-[#e8dfd7] rounded-xl py-16 px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#f5f0eb] flex items-center justify-center mx-auto mb-4">
              <Inbox size={30} className="text-[#a67c63]" />
            </div>

            <h3 className="text-xl font-semibold text-[#30251f]">
              {bookings.length === 0
                ? "No bookings yet"
                : "No bookings found"}
            </h3>

            <p className="text-sm text-[#796b62] mt-2 max-w-md mx-auto">
              {bookings.length === 0
                ? "When customers book one of your studios, their reservations will appear here."
                : `There are no ${activeFilter.toLowerCase()} bookings right now.`}
            </p>

            {activeFilter !== "All" && bookings.length > 0 && (
              <button
                onClick={() => setActiveFilter("All")}
                className="mt-5 text-sm font-semibold text-[#795548] hover:underline"
              >
                View all bookings
              </button>
            )}

            {bookings.length === 0 && (
              <Link
                href="/my-listings"
                className="inline-flex items-center gap-2 mt-5 rounded-lg bg-[#604438] px-5 py-3 text-sm font-semibold text-white hover:bg-[#493329] transition"
              >
                <Building2 size={17} />
                View My Studios
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border border-[#e8dfd7] rounded-xl overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-5">

                    {/* Studio Image */}
                    <div className="w-full lg:w-48 h-48 lg:h-40 shrink-0 rounded-lg overflow-hidden bg-[#f1eae4]">
                      {booking.studioImage ? (
                        <img
                          src={booking.studioImage}
                          alt={booking.studioName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#a67c63]">
                          <Building2 size={40} />
                        </div>
                      )}
                    </div>

                    {/* Booking Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[booking.status]}`}
                        >
                          {booking.status}
                        </span>

                        <span className="text-xs text-[#9b8b80]">
                          Booking ID: {booking._id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#30251f]">
                        {booking.studioName}
                      </h3>

                      {booking.studioLocation && (
                        <p className="flex items-center gap-1.5 text-sm text-[#796b62] mt-1">
                          <MapPin size={15} />
                          {booking.studioLocation}
                        </p>
                      )}

                      {/* Customer Information */}
                      <div className="mt-4 rounded-lg bg-[#f8f5f0] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#a67c63] mb-2">
                          Customer Information
                        </p>

                        <p className="text-sm font-semibold text-[#30251f]">
                          {booking.customerName}
                        </p>

                        <p className="text-sm text-[#796b62] break-all">
                          {booking.customerEmail}
                        </p>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-[#796b62]">
                          <CalendarDays size={17} className="text-[#a67c63]" />
                          {formatDate(booking.bookingDate)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#796b62]">
                          <Clock size={17} className="text-[#a67c63]" />
                          {formatTime(booking.startTime)} –{" "}
                          {formatTime(booking.endTime)}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#796b62]">
                          <Users size={17} className="text-[#a67c63]" />
                          {booking.guests} guests
                        </div>

                        <div className="flex items-center gap-2 text-sm text-[#796b62]">
                          <Clock size={17} className="text-[#a67c63]" />
                          {booking.durationHours} hours
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="lg:w-44 lg:border-l lg:border-[#e8dfd7] lg:pl-5 flex lg:flex-col justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#796b62]">
                          Rental Amount
                        </p>

                        <p className="text-2xl font-bold text-[#604438] mt-1">
                          {formatCurrency(booking.totalPrice)}
                        </p>

                        <p className="text-xs text-[#796b62] mt-2">
                          Deposit: {formatCurrency(booking.securityDeposit)}
                        </p>

                        <p className="text-xs text-[#796b62] mt-1">
                          Rate: {formatCurrency(booking.hourlyRate)}/hr
                        </p>
                      </div>

                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="inline-flex items-center justify-center rounded-lg border border-[#d8c9bd] px-4 py-2 text-sm font-medium text-[#604438] hover:bg-[#f5f0eb] transition"
                      >
                        View Studio
                      </Link>
                    </div>
                  </div>

                  {/* Host Actions */}
                  <div className="mt-5 pt-5 border-t border-[#eee7e1]">
                    {booking.status === "Pending" && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() =>
                            updateBookingStatus(booking, "Confirmed")
                          }
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#604438] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#493329] transition disabled:opacity-50"
                        >
                          {updatingId === booking._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={17} />
                          )}
                          Confirm Booking
                        </button>

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {booking.status === "Confirmed" && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() =>
                            updateBookingStatus(booking, "Completed")
                          }
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#604438] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#493329] transition disabled:opacity-50"
                        >
                          {updatingId === booking._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={17} />
                          )}
                          Mark as Completed
                        </button>

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          disabled={updatingId === booking._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <XCircle size={17} />
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {booking.status === "Completed" && (
                      <p className="flex items-center gap-2 text-sm font-medium text-blue-700">
                        <CheckCircle2 size={17} />
                        This booking has been completed.
                      </p>
                    )}

                    {booking.status === "Cancelled" && (
                      <p className="flex items-center gap-2 text-sm font-medium text-red-600">
                        <XCircle size={17} />
                        This booking was cancelled
                        {booking.cancelledBy === "customer"
                          ? " by the customer."
                          : booking.cancelledBy === "host"
                            ? " by you."
                            : "."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <X size={24} />
            </div>

            <h2 className="text-xl font-bold text-[#30251f]">
              Cancel this booking?
            </h2>

            <p className="text-sm text-[#796b62] mt-2 leading-6">
              Are you sure you want to cancel the booking for{" "}
              <strong className="text-[#604438]">
                {selectedBooking.studioName}
              </strong>
              ? The customer will also see the updated Cancelled status.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={updatingId === selectedBooking._id}
                className="flex-1 rounded-lg border border-[#d8c9bd] px-4 py-2.5 text-sm font-semibold text-[#604438] hover:bg-[#f5f0eb] transition"
              >
                Keep Booking
              </button>

              <button
                onClick={() =>
                  updateBookingStatus(selectedBooking, "Cancelled")
                }
                disabled={updatingId === selectedBooking._id}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {updatingId === selectedBooking._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

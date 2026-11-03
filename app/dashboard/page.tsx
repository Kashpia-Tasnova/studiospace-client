
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Aperture,
  Building2,
  CalendarDays,
  Clock,
  PlusCircle,
  Search,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Studio {
  _id: string;
  title?: string;
  name?: string;
  location?: string;
  images?: string[];
  image?: string;
}

interface Booking {
  _id: string;
  studioId?: string;
  studioName?: string;
  studioTitle?: string;
  bookingDate?: string;
  startTime?: string;
  endTime?: string;
  status: string;
  totalPrice?: number;
  customerName?: string;
}

interface DashboardData {
  studios: Studio[];
  bookings: Booking[];
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-50 text-amber-700";
    case "Confirmed":
      return "bg-green-50 text-green-700";
    case "Completed":
      return "bg-blue-50 text-blue-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    studios: [],
    bookings: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!session?.user) return;

      if (!API_URL) {
        toast.error("API URL is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        const [studiosResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/api/studios/my-listings`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/bookings/my-bookings`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [studiosResult, bookingsResult] = await Promise.all([
          studiosResponse.json(),
          bookingsResponse.json(),
        ]);

        if (!studiosResponse.ok || !bookingsResponse.ok) {
          throw new Error("Failed to load dashboard information.");
        }

        if (!studiosResult.success || !bookingsResult.success) {
          throw new Error("Could not retrieve dashboard information.");
        }

        if (isMounted) {
          setDashboardData({
            studios: Array.isArray(studiosResult.data)
              ? studiosResult.data
              : [],
            bookings: Array.isArray(bookingsResult.data)
              ? bookingsResult.data
              : [],
          });
        }
      } catch (error) {
        if (isMounted) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not load dashboard information."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [session]);

  if (isPending || !session || isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f8f5f1]">
        <Loader2 className="h-8 w-8 animate-spin text-[#604438]" />
      </main>
    );
  }

  const user = session.user;

  const activeBookings = dashboardData.bookings.filter(
    (booking) => booking.status !== "Cancelled"
  );

  const pendingBookings = dashboardData.bookings.filter(
    (booking) => booking.status === "Pending"
  );

  const recentBookings = [...dashboardData.bookings]
    .sort((a, b) => {
      return (
        new Date(b.bookingDate || "").getTime() -
        new Date(a.bookingDate || "").getTime()
      );
    })
    .slice(0, 5);

  const statistics = [
    {
      title: "My Studios",
      value: dashboardData.studios.length,
      icon: Building2,
      description: "Studios you have listed",
      color: "bg-[#f3ece6] text-[#604438]",
    },
    {
      title: "Total Bookings",
      value: activeBookings.length,
      icon: CalendarDays,
      description: "Non-cancelled reservations",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.length,
      icon: Clock,
      description: "Awaiting confirmation",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  const quickActions = [
    {
      title: "Add New Studio",
      description: "List your creative space",
      href: "/add-studio",
      icon: PlusCircle,
    },
    {
      title: "Explore Studios",
      description: "Discover creative spaces",
      href: "/studios",
      icon: Search,
    },
    {
      title: "My Listings",
      description: "Manage your studios",
      href: "/my-listings",
      icon: Building2,
    },
    {
      title: "Manage Bookings",
      description: "Review customer reservations",
      href: "/host-bookings",
      icon: CalendarCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8f5f1] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Welcome Section */}
        <section className="overflow-hidden rounded-xl bg-[#604438] px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-[#eee2d9]">
                <LayoutDashboard size={17} />
                <span>My Dashboard</span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Welcome back, {user.name || "Creator"}!
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#eee2d9]">
                Manage your studios, keep track of reservations, and
                make the most of your creative spaces.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Profile"}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-full border-2 border-white/40 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-white/15 text-xl font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <div>
                <p className="text-sm font-semibold">
                  {user.name || "StudioSpace User"}
                </p>
                <p className="mt-1 text-xs text-[#eee2d9]">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#30251f]">
              Overview
            </h2>
            <p className="mt-1 text-sm text-[#84776e]">
              A quick look at your StudioSpace activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statistics.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-[#e8ded5] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#84776e]">
                        {stat.title}
                      </p>

                      <p className="mt-3 text-3xl font-bold text-[#30251f]">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.color}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-[#99877b]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#30251f]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#84776e]">
              Quickly access the features you use most.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-[#e8ded5] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#a67c63] hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3ece6] text-[#604438] transition group-hover:bg-[#604438] group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#49372e]">
                      {action.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#84776e]">
                      {action.description}
                    </p>
                  </div>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-[#a8988c] transition group-hover:translate-x-1 group-hover:text-[#604438]"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-xl border border-[#e8ded5] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-[#eee7e1] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#30251f]">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-[#84776e]">
                Your latest workspace reservations.
              </p>
            </div>

            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#604438] transition hover:text-[#30251f]"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-[#99877b]">
                No recent bookings to display.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#eee7e1]">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3ece6] text-[#604438]">
                      <Aperture size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#49372e]">
                        {booking.studioName ||
                          booking.studioTitle ||
                          "Studio Booking"}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#84776e]">
                        {booking.bookingDate && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={13} />
                            {new Date(
                              `${booking.bookingDate}T00:00:00`
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}

                        {booking.startTime && booking.endTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={13} />
                            {booking.startTime} - {booking.endTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <Link
                      href="/my-bookings"
                      className="text-xs font-semibold text-[#604438] transition hover:text-[#30251f]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Studios */}
        <section className="rounded-xl border border-[#e8ded5] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f3ece6] text-[#604438]">
                <Building2 size={21} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#30251f]">
                  Your Creative Spaces
                </h2>

                <p className="mt-1 text-sm text-[#84776e]">
                  You currently have {dashboardData.studios.length} studio
                  {dashboardData.studios.length !== 1 ? "s" : ""} listed.
                </p>
              </div>
            </div>

            <Link
              href="/my-listings"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#604438] px-5 py-2.5 text-sm font-semibold text-[#604438] transition hover:bg-[#604438] hover:!text-white"
            >
              View My Listings
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

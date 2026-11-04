
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  MessageSquare,
  CalendarDays,
  MapPin,
  Loader2,
  MessageCircle,
  Building2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ReceivedReview {
  _id: string;
  studioId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
  studio: {
    name: string;
    category: string;
    location: string;
  } | null;
}

export default function StudioReviewsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [reviews, setReviews] = useState<ReceivedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchReceivedReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/reviews/received`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load studio reviews");
        }

        if (active) setReviews(result.data || []);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading reviews"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchReceivedReviews();

    return () => {
      active = false;
    };
  }, [session, sessionLoading]);

  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-[#F8F5F0] px-5 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-[#A67C63]" />
          <p className="mt-4 text-sm font-medium text-[#81756D]">
            Loading studio reviews...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0] px-5">
        <div className="w-full max-w-md rounded-2xl border border-[#E8D9CC] bg-white p-8 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-[#A67C63]" />
          <h1 className="mt-5 text-2xl font-bold text-[#202020]">
            Login Required
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#81756D]">
            Please log in to view reviews received for your studios.
          </p>
          <Link
            href="/login?callbackURL=%2Fstudio-reviews"
            className="mt-7 inline-flex rounded-xl bg-[#A67C63] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#795548] hover:!text-white"
          >
            Log In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#795548] transition hover:text-[#A67C63]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <span className="inline-block rounded-full bg-[#E8D9CC] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#795548]">
            Customer Feedback
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#202020] sm:text-4xl">
            Reviews for My Studios
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81756D] sm:text-base">
            See what customers are saying about your creative spaces.
            Read their ratings and feedback to understand their experiences.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E8]">
            <MessageSquare size={27} className="text-[#A67C63]" />
          </div>
          <div>
            <p className="text-sm text-[#81756D]">Total Customer Reviews</p>
            <h2 className="mt-1 text-2xl font-bold text-[#202020]">
              {reviews.length}
            </h2>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && reviews.length === 0 && (
          <div className="rounded-2xl border border-[#E8D9CC] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8]">
              <MessageCircle size={30} className="text-[#A67C63]" />
            </div>

            <h2 className="mt-6 text-xl font-bold text-[#202020]">
              No Customer Reviews Yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#81756D]">
              You have not received any reviews for your studios yet.
              Customer feedback will appear here after they complete
              bookings and submit reviews.
            </p>

            <Link
              href="/my-listings"
              style={{ color: "#FFFFFF" }}
              className="mt-7 inline-flex items-center justify-center rounded-xl border border-[#A67C63] bg-[#A67C63] px-7 py-3 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#292522] hover:bg-[#292522] hover:!text-white hover:shadow-lg focus-visible:!text-white"
            >
              View My Studios
            </Link>
          </div>
        )}

        {!error && reviews.length > 0 && (
          <div className="space-y-6">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="overflow-hidden rounded-2xl border border-[#E8D9CC] bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                      <span className="inline-block rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs font-semibold text-[#795548]">
                        {review.studio?.category || "Creative Space"}
                      </span>

                      <h2 className="mt-3 flex items-center gap-2 text-xl font-bold text-[#202020]">
                        <Building2 size={19} className="shrink-0 text-[#A67C63]" />
                        {review.studio?.name || "Studio no longer available"}
                      </h2>

                      {review.studio?.location && (
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#81756D]">
                          <MapPin size={15} className="shrink-0 text-[#A67C63]" />
                          {review.studio.location}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 self-start rounded-full bg-[#FFF4D8] px-4 py-2 text-sm font-bold text-[#8A641B]">
                      <Star size={17} fill="currentColor" />
                      {review.rating.toFixed(1)} / 5
                    </div>
                  </div>

                  <div className="mt-7 flex items-center gap-3 border-t border-[#E8D9CC] pt-6">
                    {review.customerImage ? (
                      <Image
                        src={review.customerImage}
                        alt={review.customerName}
                        width={44}
                        height={44}
                        unoptimized
                        className="h-11 w-11 rounded-full border border-[#E8D9CC] object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8D9CC] text-lg font-bold text-[#795548]">
                        {review.customerName?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-bold text-[#202020]">
                        {review.customerName || "Customer"}
                      </p>
                      <p className="text-xs text-[#81756D]">
                        Verified booking review
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={19}
                        fill={index < review.rating ? "currentColor" : "none"}
                        className={
                          index < review.rating
                            ? "text-[#E5A83B]"
                            : "text-[#D8CEC5]"
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-[#F8F5F0] p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A67C63]">
                      <MessageSquare size={15} />
                      Customer Feedback
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#514840]">
                      {review.comment || "No written comment was provided."}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#E8D9CC] pt-5 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-xs text-[#81756D]">
                      <CalendarDays size={15} />
                      Reviewed on{" "}
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    {review.studioId && (
                      <Link
                        href={`/studios/${review.studioId}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#795548] transition hover:text-[#A67C63]"
                      >
                        View Studio
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

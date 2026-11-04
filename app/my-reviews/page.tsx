
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Star,
  MessageSquare,
  CalendarDays,
  MapPin,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MyReview {
  _id: string;
  studioId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customerName: string;
  studio: {
    name: string;
    category: string;
    location: string;
  } | null;
}

export default function MyReviewsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      setLoading(false);
      return;
    }

    let active = true;

    async function fetchMyReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/reviews/my-reviews`,
          { credentials: "include" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load reviews");
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

    fetchMyReviews();

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
            Loading your reviews...
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
            Please log in to view the reviews you have written.
          </p>
          <Link
            href="/login?callbackURL=%2Fmy-reviews"
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
            Your Feedback
          </span>
          <h1 className="mt-4 text-3xl font-bold text-[#202020] sm:text-4xl">
            My Reviews
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#81756D] sm:text-base">
            All the reviews and ratings you have shared for the creative
            spaces you have experienced.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[#E8D9CC] bg-white p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E8]">
            <MessageSquare size={27} className="text-[#A67C63]" />
          </div>
          <div>
            <p className="text-sm text-[#81756D]">
              Total Reviews Submitted
            </p>
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
              No Reviews Yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#81756D]">
              You have not submitted any reviews yet. Complete a studio
              booking and share your experience with other creators.
            </p>

            <Link
              href="/studios"
              style={{ color: "#FFFFFF" }}
              className="mt-7 inline-flex items-center justify-center rounded-xl border border-[#A67C63] bg-[#A67C63] px-7 py-3 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#292522] hover:bg-[#292522] hover:!text-white hover:shadow-lg focus-visible:!text-white"
            >
              Explore Studios
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
                      <h2 className="mt-3 text-xl font-bold text-[#202020]">
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

                  <div className="mt-6 flex items-center gap-1">
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
                      Your Feedback
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
                        <Star size={16} />
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

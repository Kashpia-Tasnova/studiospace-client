"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, Send, Loader2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Review {
  _id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface EligibleBooking {
  _id: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  alreadyReviewed: boolean;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: Review[];
}

interface EligibilityResponse {
  success: boolean;
  message: string;
  data: EligibleBooking[];
}

interface StudioReviewsProps {
  studioId: string;
}

export default function StudioReviews({ studioId }: StudioReviewsProps) {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<EligibleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const loadReviews = useCallback(async () => {
    if (!API_URL) {
      toast.error("API configuration is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/studio/${studioId}`,
        { cache: "no-store" }
      );

      const result: ReviewsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load reviews.");
      }

      setReviews(result.data);
    } catch (error) {
      console.error("Review loading error:", error);
      toast.error("Could not load studio reviews.");
    } finally {
      setLoading(false);
    }
  }, [studioId]);

  const loadEligibility = useCallback(async () => {
    if (!API_URL || !session?.user) {
      setBookings([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/eligibility/${studioId}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: EligibilityResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not check review eligibility.");
      }

      setBookings(result.data);
    } catch (error) {
      console.error("Review eligibility error:", error);
      setBookings([]);
    }
  }, [studioId, session?.user]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    if (!sessionLoading) {
      loadEligibility();
    }
  }, [sessionLoading, loadEligibility]);

  const eligibleBookings = bookings.filter(
    (booking) => !booking.alreadyReviewed
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedBooking) {
      toast.error("Please select a completed booking.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a star rating.");
      return;
    }

    if (!API_URL) {
      toast.error("API configuration is missing.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId,
          bookingId: selectedBooking,
          rating,
          comment: comment.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit your review.");
      }

      toast.success("Your review has been submitted successfully!");

      setRating(0);
      setComment("");
      setSelectedBooking("");

      await Promise.all([loadReviews(), loadEligibility()]);
    } catch (error) {
      console.error("Review submission error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t border-[#E8D9CC] pt-10 sm:mt-16 sm:pt-14">
      {/* Section Heading */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A67C63] sm:text-xs">
            Customer Feedback
          </span>

          <h2 className="mt-2 text-2xl font-bold text-[#202020] sm:text-3xl">
            Ratings & Reviews
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#81756D]">
            Discover what customers think about this creative space.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#E8D9CC] bg-white px-5 py-4">
          <Star
            size={27}
            fill="currentColor"
            className="text-[#D9A441]"
          />

          <div>
            <p className="text-2xl font-bold text-[#202020]">
              {reviews.length > 0 ? averageRating.toFixed(1) : "New"}
            </p>

            <p className="text-xs text-[#81756D]">
              {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {session?.user && eligibleBookings.length > 0 && (
        <div className="mt-8 rounded-3xl border border-[#E8D9CC] bg-white p-5 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F0E8] text-[#A67C63]">
              <MessageSquare size={21} />
            </div>

            <div>
              <h3 className="font-bold text-[#202020]">
                Share Your Experience
              </h3>

              <p className="mt-1 text-xs text-[#81756D]">
                Only customers with completed bookings can leave reviews.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            {/* Completed Booking */}
            <div>
              <label
                htmlFor="review-booking"
                className="mb-2 block text-sm font-semibold text-[#202020]"
              >
                Select Completed Booking
              </label>

              <select
                id="review-booking"
                value={selectedBooking}
                onChange={(event) => setSelectedBooking(event.target.value)}
                required
                className="w-full rounded-xl border border-[#E8D9CC] bg-[#FFFCF9] px-4 py-3 text-sm text-[#202020] outline-none transition focus:border-[#A67C63]"
              >
                <option value="">Choose a booking</option>

                {eligibleBookings.map((booking) => (
                  <option key={booking._id} value={booking._id}>
                    {booking.bookingDate} · {booking.startTime} -{" "}
                    {booking.endTime}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <p className="mb-3 text-sm font-semibold text-[#202020]">
                Your Rating
              </p>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    onClick={() => setRating(star)}
                    className="rounded-md p-1 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#A67C63]"
                  >
                    <Star
                      size={30}
                      fill={star <= rating ? "currentColor" : "none"}
                      className={
                        star <= rating
                          ? "text-[#D9A441]"
                          : "text-[#D6C8BD]"
                      }
                    />
                  </button>
                ))}

                <span className="ml-2 text-sm text-[#81756D]">
                  {rating > 0 ? `${rating} / 5` : "Select stars"}
                </span>
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label
                htmlFor="review-comment"
                className="mb-2 block text-sm font-semibold text-[#202020]"
              >
                Your Experience{" "}
                <span className="font-normal text-[#A0958D]">
                  (Optional)
                </span>
              </label>

              <textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="Tell others about your experience at this studio..."
                className="w-full resize-y rounded-xl border border-[#E8D9CC] bg-[#FFFCF9] px-4 py-3 text-sm text-[#202020] outline-none transition placeholder:text-[#B0A49B] focus:border-[#A67C63]"
              />

              <p className="mt-1 text-right text-xs text-[#A0958D]">
                {comment.length}/1000
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#A67C63] px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Signed-in user with no eligible bookings */}
      {session?.user && bookings.length === 0 && !sessionLoading && (
        <div className="mt-8 rounded-2xl border border-[#E8D9CC] bg-white p-6">
          <p className="text-sm leading-7 text-[#81756D]">
            Complete a booking at this studio to share your experience and
            leave a review.
          </p>
        </div>
      )}

      {/* Already Reviewed */}
      {session?.user &&
        bookings.length > 0 &&
        eligibleBookings.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#E8D9CC] bg-white p-6">
            <p className="text-sm leading-7 text-[#81756D]">
              You have already reviewed all your completed bookings for this
              studio. Thank you for sharing your experience!
            </p>
          </div>
        )}

      {/* Reviews List */}
      <div className="mt-10 space-y-5">
        {loading ? (
          <div className="rounded-2xl border border-[#E8D9CC] bg-white p-6 text-sm text-[#81756D]">
            Loading customer reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8C5B7] bg-white px-5 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F0E8] text-[#A67C63]">
              <MessageSquare size={25} />
            </div>

            <h3 className="mt-4 font-bold text-[#202020]">
              No Reviews Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81756D]">
              This studio hasn't received any customer reviews yet. Be the
              first to share your experience after completing a booking.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-2xl border border-[#E8D9CC] bg-white p-5 sm:p-7"
            >
              <div className="flex items-start gap-4">
                {review.customerImage ? (
                  <Image
                    src={review.customerImage}
                    alt={review.customerName}
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] text-[#A67C63]">
                    <UserRound size={23} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-[#202020]">
                        {review.customerName}
                      </h4>

                      <p className="mt-1 text-xs text-[#A0958D]">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          fill={
                            star <= review.rating ? "currentColor" : "none"
                          }
                          className={
                            star <= review.rating
                              ? "text-[#D9A441]"
                              : "text-[#D6C8BD]"
                          }
                        />
                      ))}

                      <span className="ml-1 text-xs font-semibold text-[#795548]">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#71665F]">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
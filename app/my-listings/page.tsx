
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  MapPin,
  Users,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Building2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  securityDeposit: number;
  capacity: number;
  status: string;
  images: string[];
  amenities: string[];
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [studioToDelete, setStudioToDelete] = useState<Studio | null>(null);

  // Fetch the logged-in user's studios
  const fetchMyStudios = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/studios/my-listings`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load your studio listings"
        );
      }

      setStudios(result.data || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your studios";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication and load listings
  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      toast.error("Please log in to view your studio listings");
      router.replace("/login");
      return;
    }

    fetchMyStudios();
  }, [session, sessionLoading, router, fetchMyStudios]);

  // Delete studio
  const handleDeleteStudio = async () => {
    if (!studioToDelete) return;

    try {
      setDeletingId(studioToDelete._id);

      const response = await fetch(
        `${API_URL}/api/studios/${studioToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete studio");
      }

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== studioToDelete._id)
      );

      toast.success("Studio deleted successfully!");
      setStudioToDelete(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete studio"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (sessionLoading || loading) {
    return (
      <main className="min-h-screen bg-[#F8F4EF] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 h-10 w-64 animate-pulse rounded-lg bg-[#E8DDD2]" />

          <div className="mb-10 h-5 w-96 max-w-full animate-pulse rounded bg-[#E8DDD2]" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[#E9DED4] bg-white"
              >
                <div className="h-56 animate-pulse bg-[#E8DDD2]" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#E8DDD2]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#E8DDD2]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E8DDD2]" />
                  <div className="h-10 animate-pulse rounded-lg bg-[#E8DDD2]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F4EF] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#A17B61]">
              Host Dashboard
            </p>

            <h1 className="text-3xl font-bold text-[#35251E] sm:text-4xl">
              My Studio Listings
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#77665B] sm:text-base">
              Manage your creative spaces, update studio information,
              and keep your listings up to date.
            </p>
          </div>

          {/* Add New Studio */}
          <Link
            href="/add-studio"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#76533F] px-6 py-3.5 text-sm font-semibold !text-white transition hover:bg-[#5F4030]"
          >
            <Plus size={19} />
            Add New Studio
          </Link>
        </div>

        {/* Listing summary */}
        <div className="mb-8 rounded-2xl border border-[#E9DED4] bg-white p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F1E7DE] text-[#76533F]">
              <Building2 size={24} />
            </div>

            <div>
              <p className="text-sm text-[#77665B]">
                Total Studio Listings
              </p>

              <p className="text-2xl font-bold text-[#35251E]">
                {studios.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle
              className="mx-auto mb-3 text-red-500"
              size={32}
            />

            <h2 className="text-lg font-semibold text-[#35251E]">
              Unable to load your listings
            </h2>

            <p className="mt-2 text-sm text-[#77665B]">{error}</p>

            <button
              onClick={fetchMyStudios}
              className="mt-5 rounded-lg bg-[#76533F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5F4030]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && studios.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#CDBBAE] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F1E7DE] text-[#76533F]">
              <Building2 size={36} />
            </div>

            <h2 className="text-2xl font-bold text-[#35251E]">
              No Studio Listings Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77665B]">
              You haven't added any studios yet. Start sharing your
              creative space with people looking for the perfect place
              to work.
            </p>

            <Link
              href="/add-studio"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#76533F] px-6 py-3 font-semibold !text-white transition hover:bg-[#5F4030]"
            >
              <Plus size={19} />
              Add Your First Studio
            </Link>
          </div>
        )}

        {/* Studio listing cards */}
        {!error && studios.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-[#E9DED4] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Studio image and badges */}
                <div className="relative h-56 overflow-hidden bg-[#E8DDD2]">
                  {studio.images?.[0] ? (
                    <Image
                      src={studio.images[0]}
                      alt={studio.name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A17B61]">
                      <Building2 size={48} />
                    </div>
                  )}

                  {/* Category badge - upper left */}
                  <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {studio.category}
                  </span>

                  {/* Availability badge - upper right */}
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      studio.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {studio.status === "available"
                      ? "Available"
                      : studio.status}
                  </span>
                </div>

                {/* Studio information */}
                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold text-[#35251E]">
                    {studio.name}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#77665B]">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[#A17B61]"
                    />
                    <span className="line-clamp-1">
                      {studio.location}
                    </span>
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#EEE5DE] pt-4">
                    <div>
                      <p className="text-xs text-[#958477]">
                        Hourly Rate
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#76533F]">
                        ${studio.price}
                        <span className="text-xs font-normal text-[#958477]">
                          {" "}/ hour
                        </span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[#958477]">
                        Capacity
                      </p>

                      <p className="mt-1 flex items-center justify-end gap-1.5 font-semibold text-[#35251E]">
                        <Users size={16} />
                        {studio.capacity} people
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {/* View */}
                    <Link
                      href={`/studios/${studio._id}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E3D6CA] py-2.5 text-xs font-semibold text-[#76533F] transition hover:bg-[#F8F4EF] sm:text-sm"
                    >
                      <Eye size={16} />
                      View
                    </Link>

                    {/* Update */}
                    <Link
                      href={`/studios/edit/${studio._id}`}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-[#76533F] py-2.5 text-xs font-semibold !text-white transition hover:bg-[#5F4030] sm:text-sm"
                    >
                      <Pencil size={15} />
                      Update
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => setStudioToDelete(studio)}
                      disabled={deletingId === studio._id}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:text-sm"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {studioToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setStudioToDelete(null)}
              disabled={deletingId !== null}
              className="absolute right-4 top-4 rounded-full p-2 text-[#77665B] transition hover:bg-[#F8F4EF]"
              aria-label="Close delete confirmation"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={26} />
            </div>

            <h2 className="text-xl font-bold text-[#35251E]">
              Delete Studio?
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#77665B]">
              Are you sure you want to delete{" "}
              <strong className="text-[#35251E]">
                {studioToDelete.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setStudioToDelete(null)}
                disabled={deletingId !== null}
                className="rounded-lg border border-[#E3D6CA] px-5 py-3 text-sm font-semibold text-[#76533F] transition hover:bg-[#F8F4EF] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteStudio}
                disabled={deletingId !== null}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deletingId ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Yes, Delete
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


"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Users,
  Star,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
} from "lucide-react";
import type { Studio } from "@/lib/studios";

interface StudioListingClientProps {
  studios: Studio[];
  initialCategory: string;
  hasError: boolean;
}

const categories = [
  "All",
  "Photography",
  "Music",
  "Podcast",
  "Art & Design",
  "Dance",
  "Workshop",
];

const studioImages: Record<string, string> = {
  Photography:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop",
  Music:
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&auto=format&fit=crop",
  Podcast:
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&auto=format&fit=crop",
  "Art & Design":
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&auto=format&fit=crop",
  Dance:
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&auto=format&fit=crop",
  Workshop:
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop",
};

function normalizeCategory(value: string) {
  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "all") {
    return "All";
  }

  return (
    categories.find(
      (category) => category.toLowerCase() === normalized
    ) ||
    categories.find(
      (category) =>
        category.toLowerCase().replace(/\s+/g, "-") === normalized
    ) ||
    "All"
  );
}

export default function StudioListingClient({
  studios,
  initialCategory,
  hasError,
}: StudioListingClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategory(initialCategory)
  );

  // Search filters results immediately while typing.
  const [searchInput, setSearchInput] = useState("");

  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Update category and URL.
  function handleCategoryChange(category: string) {
    setSelectedCategory(category);

    const query = new URLSearchParams();

    if (category !== "All") {
      query.set("category", category);
    }

    const queryString = query.toString();

    router.replace(
      queryString ? `${pathname}?${queryString}` : pathname,
      { scroll: false }
    );
  }

  // Clear only the price filter.
  function clearPriceFilter() {
    setMinPrice("");
    setMaxPrice("");
  }

  // Return to the complete studio collection.
  function backToStudios() {
    setSearchInput("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setSelectedCategory("All");

    router.replace(pathname, { scroll: false });
  }

  const filteredStudios = useMemo(() => {
    let results = [...studios];

    // Category filtering
    if (selectedCategory !== "All") {
      results = results.filter(
        (studio) => studio.category === selectedCategory
      );
    }

    // Search by studio name or location while typing
    if (searchInput.trim()) {
      const searchValue = searchInput.trim().toLowerCase();

      results = results.filter(
        (studio) =>
          studio.name.toLowerCase().includes(searchValue) ||
          studio.location.toLowerCase().includes(searchValue)
      );
    }

    // Minimum price
    if (minPrice !== "") {
      const minimum = Number(minPrice);

      if (Number.isFinite(minimum)) {
        results = results.filter(
          (studio) => studio.price >= minimum
        );
      }
    }

    // Maximum price
    if (maxPrice !== "") {
      const maximum = Number(maxPrice);

      if (Number.isFinite(maximum)) {
        results = results.filter(
          (studio) => studio.price <= maximum
        );
      }
    }

    // Sorting
    results.sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      switch (sortBy) {
        case "oldest":
          return dateA - dateB;

        case "price-low":
          return a.price - b.price;

        case "price-high":
          return b.price - a.price;

        case "newest":
        default:
          return dateB - dateA;
      }
    });

    return results;
  }, [
    studios,
    selectedCategory,
    searchInput,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const hasPriceFilter = minPrice !== "" || maxPrice !== "";

  return (
    <div>
      {/* SEARCH BAR */}
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mb-9 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            size={21}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A67C63]"
          />

          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search studios by name or location..."
            className="h-14 w-full rounded-xl border border-[#E8D9CC] bg-white pl-14 pr-12 text-sm text-[#202020] shadow-sm outline-none transition placeholder:text-[#A49A92] focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#81756D] hover:text-[#795548]"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-[#795548] px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-[#202020]"
        >
          <Search size={18} />
          Search
        </button>
      </form>

      {/* CATEGORY NAVIGATION */}
      <section className="mb-9">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#202020]">
            Explore Categories
          </h2>

          <p className="mt-1 text-xs text-[#81756D]">
            Choose a category to find your ideal space.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#795548] text-white shadow-sm"
                    : "border border-[#E8D9CC] bg-white text-[#795548] hover:bg-[#EDE3D8]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* SORTING AND PRICE FILTER */}
      <section className="mb-9 rounded-2xl border border-[#E8D9CC] bg-[#F1EAE1] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.5fr]">
          {/* Sorting */}
          <div>
            <label
              htmlFor="studio-sort"
              className="mb-2 flex items-center gap-2 text-sm font-bold text-[#795548]"
            >
              <ArrowUpDown size={16} />
              Sort By
            </label>

            <select
              id="studio-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-12 w-full rounded-xl border border-[#E8D9CC] bg-white px-4 text-sm text-[#795548] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-bold text-[#795548]">
              <SlidersHorizontal size={16} />
              Filter by Hourly Price
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#A67C63]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Min price"
                  aria-label="Minimum hourly price"
                  className="h-12 w-full rounded-xl border border-[#E8D9CC] bg-white pl-8 pr-3 text-sm text-[#795548] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                />
              </div>

              <span className="text-sm text-[#81756D]">to</span>

              <div className="relative min-w-0 flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#A67C63]">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Max price"
                  aria-label="Maximum hourly price"
                  className="h-12 w-full rounded-xl border border-[#E8D9CC] bg-white pl-8 pr-3 text-sm text-[#795548] outline-none transition focus:border-[#A67C63] focus:ring-2 focus:ring-[#A67C63]/15"
                />
              </div>

              {hasPriceFilter && (
                <button
                  type="button"
                  onClick={clearPriceFilter}
                  className="flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-[#D8BFB0] bg-white px-3 text-xs font-semibold text-[#795548] transition hover:bg-[#EDE3D8]"
                >
                  <X size={15} />
                  Clear Price
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS HEADER */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#202020]">
            {selectedCategory === "All"
              ? "Explore All Studios"
              : `${selectedCategory} Studios`}
          </h2>

          <p className="mt-2 text-sm text-[#81756D]">
            Discover the perfect space for your creative projects.
          </p>

          
        </div>

        <span className="rounded-full bg-[#EDE3D8] px-4 py-2 text-sm font-semibold text-[#795548]">
          {filteredStudios.length}{" "}
          {filteredStudios.length === 1 ? "Studio" : "Studios"} Found
        </span>
      </div>

      {/* ERROR STATE */}
      {hasError ? (
        <div className="rounded-2xl border border-[#E8D9CC] bg-white px-6 py-16 text-center">
          <h3 className="text-xl font-semibold text-[#202020]">
            Unable to load studios
          </h3>

          <p className="mt-2 text-sm text-[#81756D]">
            Please check your connection and try again.
          </p>
        </div>
      ) : filteredStudios.length > 0 ? (
        /* STUDIO CARDS */
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudios.map((studio) => (
            <Link
              key={studio._id}
              href={`/studios/${studio._id}`}
              className="group overflow-hidden rounded-2xl border border-[#E8D9CC] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(32,32,32,0.12)]"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden bg-[#E8D9CC]">
                <Image
                  src={
                    studioImages[studio.category] ||
                    studioImages.Photography
                  }
                  alt={studio.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute left-4 top-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#795548] shadow-sm">
                  {studio.category}
                </div>

                <div className="absolute right-4 top-4 rounded-full bg-[#F5F0E8] px-3 py-2 text-xs font-semibold text-[#795548]">
                  {studio.status === "available"
                    ? "Available"
                    : studio.status}
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-[#202020] transition-colors group-hover:text-[#795548]">
                    {studio.name}
                  </h3>

                  {typeof studio.rating === "number" && (
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-[#FFF4D8] px-3 py-2 text-xs font-bold text-[#8A641B]">
                      <Star size={14} fill="currentColor" />
                      {studio.rating.toFixed(1)}
                    </div>
                  )}
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm text-[#81756D]">
                  <MapPin size={16} className="shrink-0 text-[#A67C63]" />
                  {studio.location}
                </p>

                <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#71665F]">
                  {studio.description}
                </p>

                <div className="my-5 border-t border-[#E8D9CC]" />

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#81756D]">
                      Starting from
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#795548]">
                      ${studio.price.toLocaleString("en-US")}
                      <span className="text-xs font-normal text-[#81756D]">
                        {" "}/ hour
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-[#F5F0E8] px-3 py-2 text-xs font-medium text-[#795548]">
                    <Users size={15} />
                    {studio.capacity} people
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center rounded-xl bg-[#F5F0E8] px-4 py-3 text-sm font-semibold text-[#795548] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
                  View Studio Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* NO RESULTS */
        <div className="rounded-3xl border border-[#E8D9CC] bg-white px-6 py-16 text-center sm:py-20">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0E8]">
            <Search size={32} className="text-[#A67C63]" />
          </div>

          <h3 className="text-2xl font-bold text-[#202020]">
            No Matching Studios Found
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#81756D]">
            We couldn&apos;t find any studios matching your search or selected
            filters. Try another search or return to explore all our creative
            spaces.
          </p>

          <button
            type="button"
            onClick={backToStudios}
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#795548] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#202020]"
          >
            <RotateCcw size={17} />
            Back to Studios
          </button>
        </div>
      )}
    </div>
  );
}

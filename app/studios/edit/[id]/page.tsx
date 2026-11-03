
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Aperture,
  Building2,
  Check,
  Loader2,
  MapPin,
  Save,
  X,
  Upload,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGES = 10;

const categories = [
  "Photography",
  "Film Stage",
  "Podcast",
  "Music",
  "Workshop",
  "Art & Design",
  "Dance",
];

const availableAmenities = [
  "Wi-Fi",
  "Air Conditioning",
  "Parking",
  "Soundproofing",
  "Lighting Equipment",
  "Photography Equipment",
  "Audio Equipment",
  "Changing Room",
  "Restroom",
  "Kitchen",
  "Natural Lighting",
  "Projector",
];

interface Studio {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  securityDeposit: number;
  capacity: number;
  images: string[];
  amenities: string[];
  host?: {
    name?: string;
    email?: string;
    profileImage?: string;
    image?: string;
  };
}

export default function EditStudioPage() {
  const router = useRouter();
  const params = useParams();
  const studioId = params.id as string;

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [isLoadingStudio, setIsLoadingStudio] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Generate previews for newly selected images.
  useEffect(() => {
    const previews = selectedImages.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  // Fetch existing studio information.
  const fetchStudio = useCallback(async () => {
    if (!API_URL) {
      setIsLoadingStudio(false);
      toast.error("API URL is not configured.");
      return;
    }

    try {
      setIsLoadingStudio(true);

      const response = await fetch(
        `${API_URL}/api/studios/${studioId}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load studio information."
        );
      }

      const data: Studio = result.data;

      if (!data) {
        throw new Error("Studio information was not found.");
      }

      setStudio(data);

      // Fill all form fields with existing information.
      setName(data.name || "");
      setCategory(data.category || "");
      setPrice(String(data.price ?? ""));
      setSecurityDeposit(String(data.securityDeposit ?? 0));
      setCapacity(String(data.capacity ?? ""));
      setLocation(data.location || "");
      setDescription(data.description || "");
      setAmenities(data.amenities || []);
      setExistingImages(data.images || []);
    } catch (error) {
      console.error("Fetch studio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load studio information."
      );
    } finally {
      setIsLoadingStudio(false);
    }
  }, [studioId]);

  // Authentication and initial data loading.
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      toast.error("Please log in to edit your studio.");
      router.replace("/login");
      return;
    }

    if (studioId) {
      fetchStudio();
    }
  }, [user, isPending, studioId, router, fetchStudio]);

  function toggleAmenity(amenity: string) {
    setAmenities((previous) =>
      previous.includes(amenity)
        ? previous.filter((item) => item !== amenity)
        : [...previous, amenity]
    );
  }

  // Select additional images.
  function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} exceeds the 10 MB limit.`);
        continue;
      }

      validFiles.push(file);
    }

    const remainingSlots =
      MAX_IMAGES - existingImages.length - selectedImages.length;

    if (remainingSlots <= 0) {
      toast.error("You have reached the maximum of 10 images.");
      event.target.value = "";
      return;
    }

    if (validFiles.length > remainingSlots) {
      toast.error(`You can add only ${remainingSlots} more image(s).`);
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      setSelectedImages((previous) => [...previous, ...filesToAdd]);
      toast.success(`${filesToAdd.length} image(s) selected.`);
    }

    event.target.value = "";
  }

  // Remove an existing uploaded image.
  function removeExistingImage(index: number) {
    setExistingImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  // Remove a newly selected image.
  function removeImage(index: number) {
    setSelectedImages((previous) =>
      previous.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  // Upload additional images.
  async function uploadImages(): Promise<string[]> {
    if (selectedImages.length === 0) return [];

    if (!API_URL) {
      throw new Error("API URL is not configured.");
    }

    const formData = new FormData();

    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${API_URL}/api/upload/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Image upload failed.");
    }

    if (!Array.isArray(result.data)) {
      throw new Error("Invalid image upload response.");
    }

    return result.data as string[];
  }

  // Update studio information.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("Please log in to update your studio.");
      router.push("/login");
      return;
    }

    if (!API_URL) {
      toast.error("API URL is not configured.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedDeposit = Number(securityDeposit);
    const parsedCapacity = Number(capacity);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isFinite(parsedDeposit) ||
      parsedDeposit < 0 ||
      !Number.isInteger(parsedCapacity) ||
      parsedCapacity <= 0
    ) {
      toast.error(
        "Please enter valid price, deposit, and capacity values."
      );
      return;
    }

    if (
      !name.trim() ||
      !category ||
      !description.trim() ||
      !location.trim()
    ) {
      toast.error("Please complete all required studio information.");
      return;
    }

    if (description.trim().length < 20) {
      toast.error("Studio overview must contain at least 20 characters.");
      return;
    }

    if (existingImages.length + selectedImages.length === 0) {
      toast.error("Please keep or upload at least one studio image.");
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedImageUrls: string[] = [];

      // Step 1: Upload new images if selected.
      if (selectedImages.length > 0) {
        toast.info(`Uploading ${selectedImages.length} new image(s)...`);
        uploadedImageUrls = await uploadImages();
      }

      // Step 2: Combine retained images and new image URLs.
      const finalImages = [
        ...existingImages,
        ...uploadedImageUrls,
      ];

      // Step 3: Update studio in MongoDB.
      const response = await fetch(
        `${API_URL}/api/studios/${studioId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            price: parsedPrice,
            securityDeposit: parsedDeposit,
            capacity: parsedCapacity,
            images: finalImages,
            amenities,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update studio."
        );
      }

      toast.success("Your studio has been updated successfully!");

      router.push("/my-listings");
      router.refresh();
    } catch (error) {
      console.error("Edit studio error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Loading screen.
  if (isPending || isLoadingStudio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1]">
        <Loader2 className="h-8 w-8 animate-spin text-[#604438]" />
      </main>
    );
  }

  // Studio loading failure.
  if (!studio) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1] px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <Aperture className="mx-auto mb-4 h-10 w-10 text-[#604438]" />

          <h1 className="text-xl font-semibold text-[#30251f]">
            Studio Not Found
          </h1>

          <p className="mt-2 text-sm text-[#81746c]">
            We couldn't load this studio's information.
          </p>

          <button
            type="button"
            onClick={() => router.push("/my-listings")}
            className="mt-5 rounded-lg bg-[#604438] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#493329]"
          >
            Back to My Listings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f1] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/my-listings"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#604438] transition hover:text-[#493329]"
        >
          <ArrowLeft size={17} />
          Back to My Listings
        </Link>

        <div className="overflow-hidden rounded-xl border border-[#eae2da] bg-white shadow-sm">
          {/* Header - same design as Add Studio */}
          <div className="bg-[#604438] px-5 py-6 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15">
                <Building2 size={23} />
              </div>

              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  Edit Your Studio
                </h1>

                <p className="mt-1 text-xs text-white/75 sm:text-sm">
                  Update your studio information and manage your creative space.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
            {/* Studio Information */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-[#30251f]">
                Studio Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Studio Title *
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Modern Photography Studio"
                    className="w-full rounded-lg border border-[#e5ddd5] px-4 py-3 text-sm outline-none transition focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Studio Category *
                  </label>

                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#e5ddd5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  >
                    <option value="">Select a category</option>

                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Studio Overview *
                  </label>

                  <textarea
                    required
                    minLength={20}
                    maxLength={2000}
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your studio, its atmosphere, facilities, and what makes it special..."
                    className="w-full resize-y rounded-lg border border-[#e5ddd5] px-4 py-3 text-sm outline-none transition focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  />

                  <p className="mt-1 text-right text-xs text-[#9a8d84]">
                    {description.length}/2000 characters
                  </p>
                </div>
              </div>
            </section>

            <div className="border-t border-[#eee7e0]" />

            {/* Pricing and Capacity */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-[#30251f]">
                Pricing & Capacity
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Hourly Rate (USD) *
                  </label>

                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25"
                    className="w-full rounded-lg border border-[#e5ddd5] px-4 py-3 text-sm outline-none focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Security Deposit (USD) *
                  </label>

                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-[#e5ddd5] px-4 py-3 text-sm outline-none focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Maximum Capacity *
                  </label>

                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="10"
                    className="w-full rounded-lg border border-[#e5ddd5] px-4 py-3 text-sm outline-none focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                  />
                </div>
              </div>
            </section>

            <div className="border-t border-[#eee7e0]" />

            {/* Location */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-[#30251f]">
                Studio Location
              </h2>

              <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                Full Address *
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3.5 top-3.5 text-[#9a8d84]"
                />

                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. GEC Circle, Chattogram, Bangladesh"
                  className="w-full rounded-lg border border-[#e5ddd5] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8a6a55] focus:ring-2 focus:ring-[#8a6a55]/10"
                />
              </div>
            </section>

            <div className="border-t border-[#eee7e0]" />

            {/* Studio Images */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-[#30251f]">
                Studio Images
              </h2>

              <p className="mb-4 text-xs text-[#81746c]">
                Your existing images are shown below. Keep them, remove
                unwanted images, or upload additional ones. Maximum 10 images.
              </p>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-5">
                  <p className="mb-3 text-sm font-medium text-[#493c34]">
                    Existing Images ({existingImages.length})
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {existingImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="group relative overflow-hidden rounded-lg border border-[#e5ddd5] bg-[#f8f5f1]"
                      >
                        <img
                          src={image}
                          alt={`Existing studio image ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          disabled={isSubmitting}
                          aria-label="Remove existing image"
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          <X size={15} />
                        </button>

                        <div className="p-2">
                          <p className="text-xs font-medium text-[#604438]">
                            Existing Image
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload area */}
              {existingImages.length + selectedImages.length < MAX_IMAGES && (
                <label
                  htmlFor="studio-images"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbbcaf] bg-[#f8f5f1]/70 px-5 py-8 text-center transition hover:border-[#8a6a55] hover:bg-[#f5eee8]"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#604438]/10 text-[#604438]">
                    <Upload size={23} />
                  </div>

                  <span className="text-sm font-semibold text-[#493c34]">
                    Click to upload new images
                  </span>

                  <span className="mt-1 text-xs text-[#81746c]">
                    Select additional images from your device
                  </span>

                  <span className="mt-2 text-[11px] text-[#9a8d84]">
                    JPG, PNG, WEBP · Maximum 10 MB per image
                  </span>

                  <input
                    id="studio-images"
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isSubmitting}
                    onChange={handleImageSelection}
                    className="hidden"
                  />
                </label>
              )}

              {/* New image previews */}
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#493c34]">
                      New Images ({selectedImages.length})
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedImages([])}
                      disabled={isSubmitting}
                      className="text-xs font-medium text-red-600 transition hover:text-red-800 disabled:opacity-50"
                    >
                      Remove All
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedImages.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="group relative overflow-hidden rounded-lg border border-[#e5ddd5] bg-[#f8f5f1]"
                      >
                        {imagePreviews[index] && (
                          <img
                            src={imagePreviews[index]}
                            alt={`New studio image ${index + 1}`}
                            className="h-32 w-full object-cover"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          disabled={isSubmitting}
                          aria-label={`Remove ${file.name}`}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          <X size={15} />
                        </button>

                        <div className="p-2">
                          <p className="truncate text-xs font-medium text-[#493c34]">
                            {file.name}
                          </p>

                          <p className="text-[10px] text-[#81746c]">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-[#9a8d84]">
                {existingImages.length + selectedImages.length} of {MAX_IMAGES} images selected
              </p>
            </section>

            <div className="border-t border-[#eee7e0]" />

            {/* Amenities */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-[#30251f]">
                Studio Amenities
              </h2>

              <p className="mb-4 text-xs text-[#81746c]">
                Your current amenities are already selected. Update them if needed.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {availableAmenities.map((amenity) => {
                  const selected = amenities.includes(amenity);

                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition sm:text-sm ${
                        selected
                          ? "border-[#604438] bg-[#604438]/5 text-[#604438]"
                          : "border-[#e5ddd5] text-[#76665d] hover:border-[#b6a294]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-[#604438] bg-[#604438] text-white"
                            : "border-[#cfc4ba]"
                        }`}
                      >
                        {selected && <Check size={11} />}
                      </span>

                      {amenity}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="border-t border-[#eee7e0]" />

            {/* Host Information */}
            <section>
              <h2 className="mb-2 text-base font-semibold text-[#30251f]">
                Host Information
              </h2>

              <p className="mb-4 text-xs text-[#81746c]">
                Your account information is displayed here and cannot be changed.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Host Name
                  </label>

                  <input
                    type="text"
                    value={studio.host?.name || user?.name || ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-[#e5ddd5] bg-[#f8f5f1] px-4 py-3 text-sm text-[#81746c] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#493c34]">
                    Host Email
                  </label>

                  <input
                    type="email"
                    value={studio.host?.email || user?.email || ""}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border border-[#e5ddd5] bg-[#f8f5f1] px-4 py-3 text-sm text-[#81746c] outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Form buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eee7e0] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/my-listings")}
                disabled={isSubmitting}
                className="rounded-lg border border-[#e5ddd5] px-6 py-3 text-sm font-medium text-[#604438] transition hover:bg-[#f8f5f1] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#604438] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#493329] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[#9a8d84]">
          Keep your studio information accurate and up to date for the
          StudioSpace community.
        </p>
      </div>
    </main>
  );
}

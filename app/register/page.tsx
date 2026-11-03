
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Aperture,
  Sparkles,
  Camera,
  X,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Create and clean up the selected image preview
  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage("");
      return;
    }

    const imageUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [selectedImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 10MB or less.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    return "";
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const validationError = validatePassword(password);

    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }

    setPasswordError("");

    try {
      setLoading(true);

      // Step 1: Create the account
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      // Step 2: Upload the selected image after account creation
      if (selectedImage) {
        try {
          if (!API_URL) {
            throw new Error("Backend URL is not configured.");
          }

          const formData = new FormData();
          formData.append("images", selectedImage);

          const uploadResponse = await fetch(
            `${API_URL}/api/upload/images`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          const uploadResult = await uploadResponse.json();

          if (!uploadResponse.ok || !uploadResult.success) {
            throw new Error(
              uploadResult.message || "Profile photo upload failed."
            );
          }

          const uploadedImageUrl = uploadResult.data?.[0];

          if (!uploadedImageUrl) {
            throw new Error("Uploaded image URL was not returned.");
          }

          // Step 3: Save uploaded image to the user profile
          const { error: updateError } = await authClient.updateUser({
            image: uploadedImageUrl,
          });

          if (updateError) {
            throw new Error(
              updateError.message || "Unable to update profile photo."
            );
          }
        } catch (imageError) {
          console.error("Registration photo upload error:", imageError);

          toast.warning(
            "Account created, but the profile photo could not be uploaded. You can upload it later from My Profile."
          );
        }
      }

      // Step 4: Sign out and redirect to login
      try {
        await authClient.signOut();
      } catch (signOutError) {
        console.error("Registration sign-out error:", signOutError);
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register`,
      });

      if (error) {
        toast.error(error.message || "Google registration failed.");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to connect with Google.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] bg-[#F8F5F0] px-4 py-7 sm:px-6 lg:py-8">
      <div className="mx-auto grid w-full max-w-[850px] overflow-hidden rounded-xl border border-[#E8D9CC] bg-white shadow-[0_12px_40px_rgba(78,52,46,0.08)] lg:grid-cols-[0.8fr_1.2fr]">

        {/* Left Introduction Panel */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#604438] p-5 text-white sm:p-7 lg:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Aperture size={21} />
              </span>

              <span className="text-base font-bold tracking-tight">
                StudioSpace
              </span>
            </Link>

            <div className="mt-9 lg:mt-12">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-[#F1DFCF]">
                <Sparkles size={12} />
                YOUR CREATIVE JOURNEY STARTS HERE
              </span>

              <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-[28px]">
                Make Space for
                <br />
                Your Creativity.
              </h1>

              <p className="mt-4 max-w-sm text-xs leading-6 text-white/75 sm:text-sm">
                Discover inspiring studios, connect with creative
                professionals, and find the perfect space to bring your next
                idea to life.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-8 border-t border-white/15 pt-4">
            <p className="text-xs font-medium text-[#F1DFCF] sm:text-sm">
              Find your space. Create your story.
            </p>

            <p className="mt-1.5 text-[11px] text-white/55">
              Join the StudioSpace creative community.
            </p>
          </div>
        </section>

        {/* Right Registration Form */}
        <section className="min-w-0 px-5 py-7 sm:px-7 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-md">

            {/* Registration Heading */}
            <div className="mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#96715D]">
                Join StudioSpace
              </span>

              <h2 className="mt-1.5 text-2xl font-bold text-[#29231F]">
                Create Your Account
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#796E66] sm:text-sm">
                Fill in your details to get started.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">

              {/* Name and Email */}
              <div className="space-y-3.5">
                <div className="min-w-0">
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-xs font-semibold text-[#40352F] sm:text-sm"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    autoComplete="name"
                    required
                    className="w-full min-w-0 rounded-lg border border-[#E5D8CD] bg-[#FFFEFC] px-3.5 py-2.5 text-xs text-[#29231F] outline-none transition placeholder:text-[#A69A91] focus:border-[#795548] focus:ring-2 focus:ring-[#795548]/10 sm:text-sm"
                  />
                </div>

                <div className="min-w-0">
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-[#40352F] sm:text-sm"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full min-w-0 rounded-lg border border-[#E5D8CD] bg-[#FFFEFC] px-3.5 py-2.5 text-xs text-[#29231F] outline-none transition placeholder:text-[#A69A91] focus:border-[#795548] focus:ring-2 focus:ring-[#795548]/10 sm:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-[#40352F] sm:text-sm"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      const value = event.target.value;
                      setPassword(value);

                      if (passwordError) {
                        setPasswordError(validatePassword(value));
                      }
                    }}
                    placeholder="Create your password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    aria-invalid={!!passwordError}
                    aria-describedby={
                      passwordError ? "password-requirements" : undefined
                    }
                    className="w-full rounded-lg border border-[#E5D8CD] bg-[#FFFEFC] px-3.5 py-2.5 pr-11 text-xs text-[#29231F] outline-none transition placeholder:text-[#A69A91] focus:border-[#795548] focus:ring-2 focus:ring-[#795548]/10 [&::-ms-reveal]:hidden sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A7C72] transition hover:text-[#795548]"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {passwordError && (
                  <p
                    id="password-requirements"
                    className="mt-1.5 text-xs font-medium text-red-600"
                  >
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Profile Photo Upload - After Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#40352F] sm:text-sm">
                  Profile Photo{" "}
                  <span className="font-normal text-[#95877D]">
                    (Optional)
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-[#DCCABD] bg-[#FFFEFC] p-3.5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E5D8CD] bg-[#F8F5F0]">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Selected profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound
                        size={29}
                        className="text-[#A67C63]"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#40352F]">
                      {selectedImage
                        ? selectedImage.name
                        : "Choose a profile photo"}
                    </p>

                    <p className="mt-1 text-[11px] text-[#95877D]">
                      JPG, PNG or other image formats · Maximum 10MB
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <label
                        htmlFor="profilePhoto"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#795548] px-3 py-2 text-xs font-semibold !text-white transition hover:bg-[#604438]"
                      >
                        <Camera size={14} />
                        {selectedImage ? "Change Photo" : "Upload Photo"}
                      </label>

                      {selectedImage && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#E5D8CD] px-3 py-2 text-xs font-semibold text-[#795548] transition hover:bg-[#F8F5F0]"
                        >
                          <X size={14} />
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#795548] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#604438] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#EAE1D9]" />

              <span className="text-[10px] font-medium text-[#A3978E]">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#EAE1D9]" />
            </div>

            {/* Google Registration */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#E5D8CD] bg-white px-4 py-2.5 text-xs font-semibold text-[#40352F] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 48 48"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                    transform="translate(0 3)"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.67 5.95c4.48-4.14 7.1-10.24 7.1-17.6Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.67-5.95c-2.13 1.43-4.86 2.27-8.23 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z"
                  />
                </svg>
              )}

              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Login Link */}
            <p className="mt-5 text-center text-xs text-[#796E66] sm:text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#795548] transition hover:text-[#4E342E]"
              >
                Log In
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

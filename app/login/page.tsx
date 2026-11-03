
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Aperture,
  Sparkles,
  Mail,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Email and password login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "http://localhost:3000/",
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back! Login successful.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/",
        errorCallbackURL: "http://localhost:3000/login",
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Google login failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  // Forgot password - UI only
  const handleForgotPassword = () => {
    toast.info("Password recovery is not available yet.");
  };

  return (
    <main className="min-h-[85vh] bg-[#F8F5F0] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-[0.8fr_1.2fr]">

        {/* Left Introduction Panel */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#604438] p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Aperture size={25} />
              </span>

              <span className="text-xl font-bold tracking-tight">
                StudioSpace
              </span>
            </Link>

            <div className="mt-12 lg:mt-20">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-[#F1DFCF]">
                <Sparkles size={14} />
                YOUR CREATIVE JOURNEY STARTS HERE
              </span>

              <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl">
                Make Space for
                <br />
                Your Creativity.
              </h1>
            </div>
          </div>

          <div className="relative z-10 mt-12">
            <p className="max-w-sm text-sm leading-7 text-[#E8DDD4] sm:text-base">
              Sign in to discover inspiring studios, manage your bookings, and
              bring your creative ideas to life.
            </p>

            <div className="mt-10 border-t border-white/20 pt-6">
              <p className="text-sm text-[#E8DDD4]">
                Find your space. Create your story.
              </p>
            </div>
          </div>
        </section>

        {/* Right Login Form */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">

            {/* Login Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#9A7865]">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold text-[#352820]">
                Log In
              </h2>

              <p className="mt-2 text-sm text-[#82766F]">
                Enter your details to access your account.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#49382E]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9A887C]" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full rounded-lg border border-[#E5DCD5] bg-[#FCFAF8] py-3.5 pl-12 pr-4 text-sm text-[#352820] outline-none transition placeholder:text-[#B2A69E] focus:border-[#8B6B58] focus:ring-2 focus:ring-[#8B6B58]/15"
                  />
                </div>

                {emailError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#49382E]"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9A887C]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-[#E5DCD5] bg-[#FCFAF8] py-3.5 pl-12 pr-12 text-sm text-[#352820] outline-none transition placeholder:text-[#B2A69E] focus:border-[#8B6B58] focus:ring-2 focus:ring-[#8B6B58]/15 [&::-ms-reveal]:hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9A887C] transition hover:text-[#6B5143]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {passwordError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Forgot Password - UI Only */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-[#8B6B58] transition hover:text-[#604438] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6B5143] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#523C31] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8E0DA]" />

              <span className="text-xs font-medium text-[#A09289]">
                OR CONTINUE WITH
              </span>

              <div className="h-px flex-1 bg-[#E8E0DA]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#E5DCD5] bg-white px-5 py-3.5 text-sm font-semibold text-[#49382E] transition hover:bg-[#FAF7F4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 48 48"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.06 13.22l7.98 6.19C12.04 13.72 17.54 9.5 24 9.5Z"
                    transform="translate(0 4)"
                  />

                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.3 5.66c4.26-3.93 7.48-9.72 7.48-17.31Z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M10.04 28.59A14.4 14.4 0 0 1 9.27 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.06 10.78l7.98-6.19Z"
                  />

                  <path
                    fill="#34A853"
                    d="M24 48c6.47 0 11.91-2.13 15.88-5.79l-7.3-5.66c-2.02 1.36-4.61 2.18-8.58 2.18-6.46 0-11.96-4.22-13.96-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}

              {isGoogleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-[#82766F]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#6B5143] underline-offset-4 transition hover:underline"
              >
                Create an account
              </Link>
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}

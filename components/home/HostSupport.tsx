"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Headset,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const hostBenefits = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    description:
      "Clear booking policies and documented reservations help hosts understand their responsibilities and manage booking-related concerns.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    description:
      "Profile information helps hosts and creators know who they are connecting with before arranging a studio booking.",
  },
];

const creatorBenefits = [
  {
    icon: Wrench,
    title: "Equipment Safety",
    description:
      "Review studio equipment details and available amenities before booking, helping you choose a space that meets your creative needs.",
  },
  {
    icon: Headset,
    title: "24/7 Host Support",
    description:
      "Get assistance with booking-related questions and connect with your host when you need help with your reservation.",
  },
];

export default function HostSupport() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleBecomeHost = () => {
    if (isPending) return;

    if (session?.user) {
      router.push("/add-studio");
    } else {
      router.push("/login?callbackURL=%2Fadd-studio");
    }
  };

  return (
    <section className="bg-white px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#F5F0E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
            Trust & Support
          </span>

          <h2 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl lg:text-5xl">
            Creativity Starts with
            <span className="font-serif italic font-medium text-[#A67C63]">
              {" "}Confidence.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#71665F] sm:text-base">
            Whether you're hosting a creative space or booking one, StudioSpace
            is designed to make your experience more convenient, transparent,
            and reassuring.
          </p>
        </div>

        {/* Two Feature Panels */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">

          {/* Host Guarantee */}
          <div className="group rounded-3xl bg-[#F8F5F0] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[#795548]/10 sm:p-10">
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDE4DA] text-[#A67C63] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
              <ShieldCheck size={30} strokeWidth={1.6} />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A67C63]">
              For Studio Owners
            </span>

            <h3 className="mt-3 text-2xl font-bold text-[#202020] sm:text-3xl">
              Host with Confidence.
            </h3>

            <p className="mt-4 text-sm leading-7 text-[#71665F]">
              Your studio deserves a platform that values transparency,
              responsible bookings, and trust between hosts and creators.
            </p>

            <div className="mt-8 space-y-6">
              {hostBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#A67C63]">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#202020]">
                        {benefit.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-[#71665F]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

     <button
  type="button"
  onClick={handleBecomeHost}
  disabled={isPending}
  className="mt-9 inline-flex items-center justify-center gap-3 rounded-[5px] border border-[#795548] bg-[#795548] px-[26px] py-[15px] text-sm font-bold text-white transition-all duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-[#202020] hover:text-white hover:ring-2 hover:ring-[#795548] hover:ring-offset-2 hover:ring-offset-[#F8F5F0] focus-visible:-translate-y-[3px] focus-visible:bg-[#202020] focus-visible:ring-2 focus-visible:ring-[#795548] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-60"
>
  Become a Host
</button>
          </div>

          {/* Creator Support */}
          <div className="group rounded-3xl bg-[#202020] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-black/15 sm:p-10">
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#D5AE91] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
              <BadgeCheck size={30} strokeWidth={1.6} />
            </div>

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D5AE91]">
              For Creators
            </span>

            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
              Create with Confidence.
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65">
              Discover creative spaces with helpful information, clear
              expectations, and support throughout your booking experience.
            </p>

            <div className="mt-8 space-y-6">
              {creatorBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D5AE91]">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {benefit.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-white/65">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

           <Link href="/studios" className="hero-button mt-9">
             Explore Studios
         </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
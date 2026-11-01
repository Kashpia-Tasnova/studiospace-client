
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  CreditCard,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Studios",
    description:
      "Browse a curated collection of creative spaces and discover the perfect studio for your project.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Time",
    description:
      "Select your preferred studio, check availability, and choose a time that works for you.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Confirm Your Booking",
    description:
      "Review your booking details and submit your reservation to secure your creative space.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Create Something Amazing",
    description:
      "Show up, get inspired, and bring your creative ideas to life in your chosen studio.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#F8F5F0] px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-[#EDE4DA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
            Simple Process
          </span>

          <h2 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl lg:text-5xl">
            From Discovery to
            <span className="font-serif italic font-medium text-[#A67C63]">
              {" "}Creation.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#71665F] sm:text-base">
            Finding and booking your perfect creative space has never been
            easier. Just follow four simple steps and get ready to create.
          </p>
        </div>

        {/* Four Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#E9E0D7] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#A67C63] hover:shadow-xl hover:shadow-[#795548]/10"
              >
                {/* Number and Icon */}
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-serif text-4xl font-bold text-[#E9DED3] transition-colors duration-300 group-hover:text-[#A67C63]">
                    {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E8] text-[#A67C63] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
                    <Icon size={25} strokeWidth={1.7} />
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-xl font-bold text-[#202020]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#71665F]">
                  {step.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-7 h-1 w-10 rounded-full bg-[#C49A7D] transition-all duration-300 group-hover:w-16" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center justify-center rounded-xl bg-[#A67C63] px-8 py-4 text-sm font-semibold !text-white no-underline transition-all duration-300 hover:bg-[#202020] hover:!text-white"
          >
            Find Your Perfect Studio
          </Link>
        </div>
      </div>
    </section>
  );
}

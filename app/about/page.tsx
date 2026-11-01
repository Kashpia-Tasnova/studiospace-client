
import Link from "next/link";
import Image from "next/image";
import {
  Lightbulb,
  Target,
  Eye,
  Camera,
  Music,
  Mic2,
  Palette,
  Users,
  ArrowRight,
} from "lucide-react";

const creativeCategories = [
  { name: "Photography", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Podcasting", icon: Mic2 },
  { name: "Art & Design", icon: Palette },
];

export default function AboutPage() {
  return (
    <main className="bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#202020] px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#A67C63]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="mb-6 inline-block rounded-full border border-[#D5AE91]/30 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D5AE91]">
              Get to know us
            </span>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Where Creative
              <span className="block font-serif italic font-medium text-[#D5AE91]">
                Ideas Find Space.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-white/65">
              StudioSpace brings creators and studio owners together.
              We make it easier to discover inspiring spaces, connect with
              creative communities, and turn ideas into meaningful work.
            </p>

            <Link
              href="/studios"
              className="mt-9 inline-flex items-center rounded-xl bg-[#A67C63] px-7 py-4 text-sm font-semibold !text-white no-underline transition-all duration-300 hover:bg-[#F5F0E8] hover:!text-[#795548]"
            >
              Explore Our Studios
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>

          <div className="relative mx-auto h-[350px] w-full max-w-lg overflow-hidden rounded-3xl sm:h-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop"
              alt="Creative workspace at StudioSpace"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-black/35 px-5 py-4 backdrop-blur-md">
              <p className="text-sm font-medium text-white">
                Space to imagine.
              </p>
              <p className="mt-1 font-serif text-xl italic text-[#D5AE91]">
                Freedom to create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative h-[350px] overflow-hidden rounded-3xl sm:h-[460px]">
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop"
              alt="Inspiring creative working environment"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div>
            <span className="mb-4 inline-block rounded-full bg-[#F5F0E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
              Our Story
            </span>

            <h2 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl">
              Every Great Idea
              <span className="font-serif italic font-medium text-[#A67C63]">
                {" "}Needs a Place.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-[#71665F] sm:text-base">
              Every creative journey begins with an idea. But finding the
              right environment to bring that idea to life can be challenging.
              StudioSpace was envisioned to make that search easier.
            </p>

            <p className="mt-5 text-sm leading-8 text-[#71665F] sm:text-base">
              From photography studios and music rooms to podcast spaces
              and art workshops, our platform connects people with spaces
              that support their creativity. We believe the right environment
              can inspire better ideas, meaningful connections, and
              extraordinary creations.
            </p>

            <p className="mt-5 text-sm leading-8 text-[#71665F] sm:text-base">
              Our goal is simple: make discovering and booking creative
              spaces more accessible for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="bg-[#F8F5F0] px-5 py-20 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full bg-[#EDE4DA] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
              What Drives Us
            </span>

            <h2 className="text-3xl font-bold text-[#202020] sm:text-4xl">
              Our Purpose,
              <span className="font-serif italic font-medium text-[#A67C63]">
                {" "}Our Direction.
              </span>
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 sm:p-10">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E8] text-[#A67C63]">
                <Target size={28} />
              </div>

              <h3 className="text-2xl font-bold text-[#202020]">
                Our Mission
              </h3>

              <p className="mt-5 text-sm leading-8 text-[#71665F] sm:text-base">
                To simplify the way people discover and book creative spaces
                by connecting studio owners with creators through an
                accessible and convenient platform.
              </p>
            </div>

            <div className="rounded-3xl bg-[#202020] p-8 sm:p-10">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-[#D5AE91]">
                <Eye size={28} />
              </div>

              <h3 className="text-2xl font-bold text-white">
                Our Vision
              </h3>

              <p className="mt-5 text-sm leading-8 text-white/65 sm:text-base">
                To build a connected creative community where every creator
                can access inspiring environments and every studio owner
                can showcase their space to the right audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Categories */}
      <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full bg-[#F5F0E8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
              What We Bring Together
            </span>

            <h2 className="text-3xl font-bold text-[#202020] sm:text-4xl">
              One Platform.
              <span className="font-serif italic font-medium text-[#A67C63]">
                {" "}Many Possibilities.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#71665F] sm:text-base">
              Discover different creative environments, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {creativeCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.name}
                  className="group rounded-2xl border border-[#E9E0D7] bg-white p-7 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#A67C63] hover:shadow-xl hover:shadow-[#795548]/10"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F0E8] text-[#A67C63] transition-all duration-300 group-hover:bg-[#A67C63] group-hover:text-white">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-5 text-sm font-bold text-[#202020] sm:text-base">
                    {category.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#202020] px-5 py-20 sm:px-8 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#D5AE91]">
            <Lightbulb size={30} />
          </div>

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Your Next Creative Chapter
            <span className="block font-serif italic font-medium text-[#D5AE91]">
              Starts Here.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Whether you own a studio or are searching for the perfect
            creative environment, there is a place for you at StudioSpace.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/studios"
              className="inline-flex items-center justify-center rounded-xl bg-[#A67C63] px-7 py-4 text-sm font-semibold !text-white no-underline transition-all duration-300 hover:bg-[#F5F0E8] hover:!text-[#795548]"
            >
              Explore Studios
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-7 py-4 text-sm font-semibold !text-white no-underline transition-all duration-300 hover:border-[#D5AE91] hover:bg-white/10"
            >
              Join StudioSpace
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

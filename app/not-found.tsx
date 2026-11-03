
import Link from "next/link";
import { Aperture, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f5f1] px-4 py-16">
      <div className="mx-auto w-full max-w-xl text-center">

        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-48 w-48 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#eee5dc]" />

          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#604438] bg-white shadow-lg">
            <Aperture
              size={68}
              strokeWidth={1.4}
              className="text-[#604438]"
            />
          </div>

          <div className="absolute -right-1 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#30251f] text-white shadow-md">
            <Search size={22} />
          </div>

          <div className="absolute -bottom-1 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#a67c63] text-white shadow-md">
            <span className="text-lg font-bold">?</span>
          </div>
        </div>

        {/* Error Number */}
        <p className="text-7xl font-bold tracking-tight text-[#604438] sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-[#30251f] sm:text-3xl">
          Oops! Studio Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#76665d] sm:text-base">
          Looks like this creative space is out of frame.
          The page you are looking for may have been moved,
          removed, or does not exist.
        </p>

        {/* Return to Home */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#604438] px-6 py-3 text-sm font-semibold !text-white shadow-sm transition duration-200 hover:bg-[#30251f] hover:!text-white"
        >
          <Home size={17} />
          Return to Home
        </Link>

        {/* Branding */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-[#99877b]">
          <Aperture size={15} />
          STUDIOSPACE
        </div>
      </div>
    </main>
  );
}


import StudioListing from "@/components/studios/StudioListing";

interface StudiosPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function StudiosPage({
  searchParams,
}: StudiosPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#F8F5F0] px-5 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-12">
          <span className="mb-4 inline-block rounded-full bg-[#EDE3D8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#795548]">
            Explore Our Spaces
          </span>

          <h1 className="text-3xl font-bold leading-tight text-[#202020] sm:text-4xl lg:text-5xl">
            Find the Perfect Space for Your
            <span className="font-serif italic font-medium text-[#A67C63]">
              {" "}Creative Vision.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#71665F] sm:text-base">
            Discover inspiring studios and creative spaces designed to bring
            your ideas to life. Find the right space for your next project.
          </p>
        </div>

        {/* Studio Listings */}
        <StudioListing initialCategory={params.category || "all"} />
      </div>
    </main>
  );
}


import { getStudios } from "@/lib/studios";
import type { Studio } from "@/lib/studios";
import StudioListingClient from "./StudioListingClient";

interface StudioListingProps {
  initialCategory: string;
}

export default async function StudioListing({
  initialCategory,
}: StudioListingProps) {
  let studios: Studio[] = [];
  let hasError = false;

  try {
    studios = await getStudios();
  } catch (error) {
    console.error("Failed to load studios:", error);
    hasError = true;
  }

  return (
    <StudioListingClient
      studios={studios}
      initialCategory={initialCategory}
      hasError={hasError}
    />
  );
}

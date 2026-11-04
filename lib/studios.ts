export interface Studio {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  securityDeposit?: number;
  capacity: number;
  status: string;

  // Genuine customer ratings
  rating?: number | null;
  reviewCount?: number;

  createdAt?: string;
  images?: string[];
  amenities?: string[];

  host?: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

interface StudiosApiResponse {
  success: boolean;
  message: string;
  data: Studio[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchStudios(endpoint: string): Promise<Studio[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/studios${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch studios");
  }

  const result: StudiosApiResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Could not retrieve studios");
  }

  return result.data;
}

// Get all studios
export async function getStudios(): Promise<Studio[]> {
  try {
    return await fetchStudios("");
  } catch (error) {
    console.error("Error fetching studios:", error);
    throw error;
  }
}

// Get the 6 newest available studios
export async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    return await fetchStudios("/featured");
  } catch (error) {
    console.error("Error fetching featured studios:", error);
    throw error;
  }
}

// Get a single studio by ID
export async function getStudioById(id: string): Promise<Studio> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}/api/studios/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("Studio not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch studio details");
  }

  const result: {
    success: boolean;
    message: string;
    data: Studio;
  } = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Could not retrieve studio details");
  }

  return result.data;
}
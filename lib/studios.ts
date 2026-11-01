
export interface Studio {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  capacity: number;
  status: string;
  rating?: number;
  createdAt?: string;
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

// Get all studios (for the Explore Studios page)
export async function getStudios(): Promise<Studio[]> {
  try {
    return await fetchStudios("");
  } catch (error) {
    console.error("Error fetching studios:", error);
    throw error;
  }
}

// Get the 6 newest available studios (for the homepage)
export async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    return await fetchStudios("/featured");
  } catch (error) {
    console.error("Error fetching featured studios:", error);
    throw error;
  }
}

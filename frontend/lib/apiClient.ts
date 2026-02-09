import { useAuth } from "@clerk/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function authenticatedFetch(path: string, token: string | null, options: RequestInit = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        // @ts-ignore
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error.detail || error.error || "API Request Failed");
    }

    return response.json();
}

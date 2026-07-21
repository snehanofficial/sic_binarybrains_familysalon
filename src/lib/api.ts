const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

let inMemoryAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string; details?: any } }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (inMemoryAccessToken) {
    headers["Authorization"] = `Bearer ${inMemoryAccessToken}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // For HttpOnly refresh cookie
  };

  try {
    let response = await fetch(`${API_BASE}${endpoint}`, config);

    // Auto Refresh on Token Expiration (401)
    if (response.status === 401 && !endpoint.includes("/auth/refresh") && !endpoint.includes("/auth/login")) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.data?.accessToken) {
          setAccessToken(refreshData.data.accessToken);
          headers["Authorization"] = `Bearer ${refreshData.data.accessToken}`;
          response = await fetch(`${API_BASE}${endpoint}`, { ...config, headers });
        }
      } else {
        setAccessToken(null);
      }
    }

    const json = await response.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: err.message || "Failed to communicate with server." },
    };
  }
}

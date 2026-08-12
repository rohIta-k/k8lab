const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8080";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    }
  );

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const contentType =
        response.headers.get("content-type") ?? "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        const data = await response.json();

        if (
          data &&
          typeof data.message === "string"
        ) {
          message = data.message;
        } else if (
          data &&
          typeof data.error === "string"
        ) {
          message = data.error;
        }
      } else {
        const text =
          await response.text();

        if (text.trim()) {
          message = text;
        }
      }
    } catch {
      // Keep the status-based error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get<T>(path: string) {
    return request<T>(path);
  },

  post<T>(
    path: string,
    body?: unknown
  ) {
    return request<T>(path, {
      method: "POST",
      body: body
        ? JSON.stringify(body)
        : undefined,
    });
  },

  delete<T>(path: string) {
    return request<T>(path, {
      method: "DELETE",
    });
  },
};
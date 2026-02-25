export class AppError extends Error {
  status?: number;
  detail?: unknown;

  constructor(message: string, status?: number, detail?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.detail = detail;
  }
}

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export async function apiClient<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { timeoutMs = 10000, headers, ...rest } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...rest,
      credentials: "include", // ✅ ให้ cookie set/ส่งได้
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // ✅ backend ส่ง { error: '...' } ไม่ใช่ message
      throw new AppError(
        (data as any)?.error || (data as any)?.message || "Request failed",
        res.status,
        data,
      );
    }

    return data as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new AppError("Request timeout");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

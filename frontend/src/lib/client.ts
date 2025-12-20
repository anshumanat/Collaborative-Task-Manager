
export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// const API_BASE = import.meta.env.VITE_API_URL;

// export async function apiFetch(
//   path: string,
//   options: RequestInit = {}
// ) {
//   const response = await fetch(`${API_BASE}${path}`, {
//     credentials: "include", // 🔴 REQUIRED for cookies/JWT
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//     ...options,
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || "Request failed");
//   }

//   return response.json();
// }

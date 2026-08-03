import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base query with:
 * - Render backend
 * - Vite env variable
 * - JWT Authorization header
 */
console.log(
  "🔥 API BASE URL from env:",
  import.meta.env.VITE_API_URL
);

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Workspace", "Board", "Task", "User"],
  endpoints: () => ({}),
});

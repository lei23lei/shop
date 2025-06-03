import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_URL = `${BASE_URL}/api`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["Items"],
});

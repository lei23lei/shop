import { api } from "../api";

export interface getItemsResponse {
  count: number;
  next: boolean | null;
  previous: boolean | null;
  results: {
    id: number;
    name: string;
    description: string;
    price: string;
    categories: string[];
    images: {
      id: number;
      image_url: string;
      is_primary: boolean;
    }[];
    created_at: string;
  }[];
}

export const itemsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<
      getItemsResponse,
      { page?: number; search?: string }
    >({
      query: ({ page, search }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (search) params.append("search", search);

        return {
          url: "/items/",
          params: Object.fromEntries(params),
        };
      },
      providesTags: ["Items"],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;

// http://127.0.0.1:8000/items/items/

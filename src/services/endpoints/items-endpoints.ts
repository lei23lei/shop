import { api } from "../api";

export interface getItemsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    id: number;
    name: string;
    description: string;
    price: string;
    categories: string[];
    image: string;
    created_at: string;
  }[];
}

interface GetItemsParams {
  page?: number;
  search?: string;
  category?: number;
  min_price?: number;
  max_price?: number;
  sort?: "created_at" | "price" | "name";
  order?: "asc" | "desc";
  page_size?: number;
}

export interface ItemDetail {
  id: number;
  name: string;
  price: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  categories: {
    id: number;
    name: string;
  }[];
  details: {
    color: string;
    detail: string | null;
  } | null;
  sizes: {
    id: number;
    size: string;
    quantity: number;
  }[];
  images: {
    id: number;
    image_url: string;
    is_primary: boolean;
  }[];
  detail_images: {
    id: number;
    image_url: string;
    display_order: number;
  }[];
}

// url : http://localhost:8000/api/items/1/

// POST /api/items/
// write me a interface based on my form data

// POST /api/items/
export interface CreateItemRequest {
  name: string;
  price: number;
  description: string;
  categories: number[]; // [parentCategoryId, subcategoryId]
  details: {
    color: string;
    detail?: string;
  };
  sizes: {
    size: string;
    quantity: number;
  }[];
  images: string[];
  detail_images: string[];
  display_image: string;
}

export const itemsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<getItemsResponse, GetItemsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.category)
          searchParams.append("category", params.category.toString());
        if (params.min_price)
          searchParams.append("min_price", params.min_price.toString());
        if (params.max_price)
          searchParams.append("max_price", params.max_price.toString());
        if (params.sort) searchParams.append("sort", params.sort);
        if (params.order) searchParams.append("order", params.order);
        if (params.page_size)
          searchParams.append("page_size", params.page_size.toString());

        return {
          url: "/items/",
          params: Object.fromEntries(searchParams),
        };
      },
      providesTags: ["Items"],
    }),
    getItemDetail: builder.query<ItemDetail, number>({
      query: (id) => `/items/${id}/`,
      providesTags: (result, error, id) => [{ type: "Items", id }],
    }),
    createItem: builder.mutation<ItemDetail, CreateItemRequest>({
      query: (data) => ({
        url: "/items/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/items/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Items", id }, "Items"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemDetailQuery,
  useCreateItemMutation,
  useDeleteItemMutation,
} = itemsApi;

// http://127.0.0.1:8000/items/items/

import { api } from "../api";

// Types
export interface AdminItemDetail {
  id: number;
  name: string;
  price: string;
  description: string;
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
    quality: string;
    is_primary: boolean;
  }[];
  detail_images: {
    id: number;
    image_url: string;
    display_order: number;
  }[];
}

export interface AdminItemListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    items: {
      id: number;
      name: string;
      price: string;
      description: string;
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
      total_images: number;
      total_detail_images: number;
    }[];
    total_items: number;
  };
}

export interface UpdateItemRequest {
  name?: string;
  price?: string;
  description?: string;
  color?: string;
  detail?: string;
  sizes?: {
    size: string;
    quantity: number;
  }[];
  categories?: number[];
  images?: {
    image_url: string;
    quality?: "low" | "medium" | "high";
    is_primary?: boolean;
  }[];
  detail_images?: {
    image_url: string;
    display_order?: number;
  }[];
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all items (admin view)
    getAdminItems: builder.query<
      AdminItemListResponse,
      { page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: "/admin/items/",
        params,
      }),
      providesTags: ["AdminItems"],
    }),

    // Get specific item (admin view)
    getAdminItemDetail: builder.query<AdminItemDetail, number>({
      query: (id) => `/admin/items/${id}/`,
      providesTags: (result, error, id) => [{ type: "AdminItems", id }],
    }),

    // Update item
    updateItem: builder.mutation<
      { message: string; item_id: number },
      { id: number; data: UpdateItemRequest }
    >({
      query: ({ id, data }) => ({
        url: `/admin/items/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "AdminItems", id },
        "AdminItems",
      ],
    }),

    // Delete item
    deleteItem: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/admin/items/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "AdminItems", id },
        "AdminItems",
      ],
    }),
  }),
});

export const {
  useGetAdminItemsQuery,
  useGetAdminItemDetailQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = adminApi;

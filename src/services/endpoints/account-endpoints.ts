import { api } from "../api";

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    is_superuser: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

interface VerifyResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    is_superuser: boolean;
  };
}

interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

interface UpdateCartItemRequest {
  cart_item_id: number;
  quantity: number;
}

interface UpdateCartItemResponse {
  message: string;
  cart_item: {
    id: number;
    quantity: number;
  };
}

interface AddToCartRequest {
  item_id: number;
  size_id: number;
  quantity: number;
}

interface AddToCartResponse {
  message: string;
  cart_item: {
    id: number;
    quantity: number;
  };
}

interface CartCountResponse {
  total_items: number;
}

interface CartItem {
  id: number;
  name: string;
  price: string;
  size: string;
  quantity: number;
  image_url: string | null;
  category: string | null;
}

interface GetCartResponse {
  items: CartItem[];
  total_items: number;
}

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/register/",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/login/",
        method: "POST",
        body: data,
      }),
    }),
    verify: builder.query<VerifyResponse, void>({
      query: () => ({
        url: "/verify/",
        method: "GET",
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),
    addToCart: builder.mutation<AddToCartResponse, AddToCartRequest>({
      query: (data) => ({
        url: "/cart/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Items", id: "CART" },
        { type: "Items", id: "CART_COUNT" },
      ],
    }),
    getCartCount: builder.query<CartCountResponse, void>({
      query: () => ({
        url: "/cart-count/",
        method: "GET",
      }),
      providesTags: (result) =>
        result ? [{ type: "Items", id: "CART_COUNT" }] : [],
    }),
    getCart: builder.query<GetCartResponse, void>({
      query: () => ({
        url: "/cart/",
        method: "GET",
      }),
      providesTags: (result) => (result ? [{ type: "Items", id: "CART" }] : []),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyQuery,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useAddToCartMutation,
  useGetCartCountQuery,
  useGetCartQuery,
} = accountApi;

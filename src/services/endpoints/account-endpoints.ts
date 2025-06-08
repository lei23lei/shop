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

interface UserDetailResponse {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
}

interface UpdateUserResponse {
  message: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    address: string;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

interface ChangePasswordResponse {
  message: string;
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

export interface CartItem {
  id: number;
  cart_item_id: number;
  name: string;
  price: string;
  size: string;
  quantity: number;
  total_available: number;
  image_url: string | null;
  categories: string | null;
}

interface GetCartResponse {
  cart_id: number;
  items: CartItem[];
  total_items: number;
}

interface DeleteCartItemResponse {
  message: string;
}

interface OrderItem {
  id: number;
  item_name: string;
  size: string;
  quantity: number;
  price: string;
  image_url: string | null;
}

export interface Order {
  id: number;
  status: string;
  total_price: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_email: string;
  first_name: string;
  last_name: string;
  zip_code: string;
  city: string;
  created_at: string;
  items: OrderItem[];
}

interface CreateOrderRequest {
  cart_id: number;
  first_name: string;
  last_name: string;
  zip_code: string;
  city: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_email: string;
}

export interface CreateOrderResponse {
  message: string;
  order: Order;
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
    getUserDetail: builder.query<UserDetailResponse, void>({
      query: () => ({
        url: "/user-detail/",
        method: "GET",
      }),
      providesTags: [{ type: "User", id: "DETAIL" }],
    }),
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserRequest>({
      query: (data) => ({
        url: "/user-detail/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "User", id: "DETAIL" }],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (data) => ({
        url: "/change-password/",
        method: "POST",
        body: data,
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
    deleteCartItem: builder.mutation<DeleteCartItemResponse, number>({
      query: (cartItemId) => ({
        url: `/cart/?cart_item_id=${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Items", id: "CART" },
        { type: "Items", id: "CART_COUNT" },
      ],
    }),
    updateCartItem: builder.mutation<
      UpdateCartItemResponse,
      UpdateCartItemRequest
    >({
      query: (data) => ({
        url: "/cart/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        { type: "Items", id: "CART" },
        { type: "Items", id: "CART_COUNT" },
      ],
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/orders/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Items", id: "CART" },
        { type: "Items", id: "CART_COUNT" },
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyQuery,
  useGetUserDetailQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useAddToCartMutation,
  useGetCartCountQuery,
  useGetCartQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
  useCreateOrderMutation,
} = accountApi;

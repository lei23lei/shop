// /register

// url: /register/
// method: POST

// POST /api/register/ HTTP/1.1
// Host: localhost:8000
// Name: Peter
// X-CSRFToken: sAkYkTKUJnBqelANhsZRpJkXJsHweAJw
// Content-Length: 233
// Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

// ------WebKitFormBoundary7MA4YWxkTrZu0gW
// Content-Disposition: form-data; name="email"

// 123123
// ------WebKitFormBoundary7MA4YWxkTrZu0gW
// Content-Disposition: form-data; name="password"

// 123123aa
// ------WebKitFormBoundary7MA4YWxkTrZu0gW--

// response:
// return Response({
//     "message": "User created successfully",
// }, status=status.HTTP_201_CREATED)

import { api } from "../api";

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
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
  }),
});

export const { useRegisterMutation } = accountApi;

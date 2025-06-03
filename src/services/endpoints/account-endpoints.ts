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
  }),
});

// url: /verify/
// class VerifyTokenView(APIView):
//     permission_classes = [IsAuthenticated]

//     def get(self, request):
//         try:
//             user = request.user
//             return Response({
//                 "user": {
//                     "id": user.id,
//                     "email": user.email,
//                     "first_name": user.first_name,
//                     "last_name": user.last_name,
//                     "phone_number": user.phone_number,
//                     "address": user.address,
//                     "is_superuser": user.is_superuser
//                 }
//             }, status=status.HTTP_200_OK)
//         except Exception as e:
//             return Response(
//                 {"error": str(e)},
//                 status=status.HTTP_400_BAD_REQUEST
//             )

// url: /login/
// method: POST
// body:
// {
//     "email": "user@example.com",    // Required
//     "password": "yourpassword123"   // Required
// }
// response:
// {
//     "message": "Login successful",
//     "user": {
//         "id": 1,
//         "email": "user@example.com",
//         "first_name": "John",
//         "last_name": "Doe",
//         "phone_number": "1234567890",
//         "address": "123 Main Street",
//         "is_superuser": false
//     },
//     "tokens": {
//         "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
//         "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
//     }
// }

// {
//     "error": "Invalid email or password"
// }

export const { useRegisterMutation, useLoginMutation, useVerifyQuery } =
  accountApi;

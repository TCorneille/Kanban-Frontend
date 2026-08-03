import { apiSlice } from "../../apiEntry";

/* ====================================================================
    Auth API Endpoint Injections
==================================================================== */
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================================================
        Signup — POST /api/v1/auth/signup
    ===================================================== */
    signup: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/v1/auth/signup", 
        method: "POST",
        body: data,
      }),
      
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
        } catch (err) {
          console.error("Signup storage hook error:", err);
        }
      },
    }),

    /* =====================================================
        Login — POST /api/v1/auth/login
    ===================================================== */
    login: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/v1/auth/login", // ✅ Fixed relative pathing issue
        method: "POST",
        body: data,
      }),
      // Intercept response to instantly store incoming security token
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
        } catch (err) {
          console.error("Login storage hook error:", err);
        }
      },
    }),

    /* =====================================================
        Logout — POST /api/v1/auth/logout
    ===================================================== */
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/api/v1/auth/logout", 
        method: "POST",
      }),
      // Clean up local storage token and WIPE global RTK cache right when logging out
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // 1. Remove security token
          localStorage.removeItem("token");
          
          // 2. Clear out all RTK Query cache states instantly!
          dispatch(apiSlice.util.resetApiState());
          
        } catch (err) {
          console.error("Logout state-reset hook error:", err);
        }
      },
    }),

    /* =====================================================
        Forgot Password — POST /api/v1/auth/forgotPassword
    ===================================================== */
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (data) => ({
        url: "/api/v1/auth/forgotPassword", // ✅ Fixed relative pathing issue
        method: "POST",
        body: data,
      }),
    }),

    /* =====================================================
        Reset Password — PATCH /api/v1/auth/resetPassword/:token
    ===================================================== */
    resetPassword: builder.mutation<any, { token: string; body: any }>({
      query: ({ token, body }) => ({
        url: `/api/v1/auth/resetPassword/${token}`, // ✅ Fixed relative pathing issue
        method: "PATCH",
        body,
      }),
      // Automatically log the user in immediately after an update
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
        } catch (err) {
          console.error("Reset Password storage hook error:", err);
        }
      },
    }),

    /* =====================================================
        Update Password — PATCH /api/v1/auth/updateMyPassword
    ===================================================== */
    updatePassword: builder.mutation<any, any>({
      query: (data) => ({
        url: "/api/v1/auth/updateMyPassword", // ✅ Fixed relative pathing issue
        method: "PATCH",
        body: data,
      }),
      // Update local token validation layer if changed
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
        } catch (err) {
          console.error("Update password storage hook error:", err);
        }
      },
    }),

  }),
});

/* ====================================================================
    Export Auto-Generated React Component Hooks
==================================================================== */
export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = authApi;
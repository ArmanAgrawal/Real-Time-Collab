    import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
    import axiosInstance from "../../services/axios";

    /* LOGIN */
    export const loginUser = createAsyncThunk(
        "auth/login",
        async (data, { rejectWithValue }) => {
            try {
                const res = await axiosInstance.post("/api/auth/login/", data);
                return res.data;
            } catch (err) {
                return rejectWithValue(err.response?.data || "Login failed");
            }
        }
    );

    export const googleLogin = createAsyncThunk(
        "auth/googleLogin",
        async (googleToken, { rejectWithValue }) => {
            try {
                console.log("token of google",googleToken)

                const res = await axiosInstance.post("/api/auth/login/google/", {
                    token: googleToken,
                });
                return res.data;
            } catch (err) {
                return rejectWithValue(err.response?.data || "Google login failed");
            }
        }
    );


    /* REGISTER */
    export const registerUser = createAsyncThunk(
        "auth/register",
        async (data, { rejectWithValue }) => {
            try {
                const res = await axiosInstance.post(
                    "/api/auth/register/",
                    data
                );
                return res.data;
            } catch (err) {
                return rejectWithValue(err.response?.data || "Registration failed");
            }
        }
    );

    const safeParse = (value) => {
        try {
            if (!value || value === "undefined") return null;
            return JSON.parse(value);
        } catch {
            return null;
        }
    };
    const initialState = {
        user: safeParse(localStorage.getItem("user")),
        accessToken: localStorage.getItem("accessToken") || null,
        refreshToken: localStorage.getItem("refreshToken") || null,
        loading: false,
        error: null,
        isAuthenticated: !!localStorage.getItem("accessToken"),
    };

    const authSlice = createSlice({
        name: "auth",
        initialState,
        reducers: {
            logout: (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
            },
        },
        extraReducers: (builder) => {
            builder
                /* LOGIN */
                .addCase(loginUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(loginUser.fulfilled, (state, action) => {
                    state.loading = false;
                    state.accessToken = action.payload.access;
                    state.refreshToken = action.payload.refresh;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;

                    localStorage.setItem("accessToken", action.payload.access);
                    localStorage.setItem("refreshToken", action.payload.refresh);
                    localStorage.setItem("user", JSON.stringify(action.payload.user));
                })
                .addCase(loginUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })

                /* REGISTER */
                .addCase(registerUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(registerUser.fulfilled, (state) => {
                    state.loading = false;
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                })
                .addCase(googleLogin.fulfilled, (state, action) => {
                    state.accessToken = action.payload.access;
                    state.refreshToken = action.payload.refresh;
                    state.isAuthenticated = true;

                    localStorage.setItem("accessToken", action.payload.access);
                    localStorage.setItem("refreshToken", action.payload.refresh);

                    if (action.payload.user) {
                        state.user = action.payload.user;
                        localStorage.setItem("user", JSON.stringify(action.payload.user));
                    }
                })

        },
    });

    export const { logout } = authSlice.actions;
    export default authSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

/* ================= CREATE WORKSPACE ================= */
export const createWorkspace = createAsyncThunk(
  "workspace/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/workspaces/", data);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= GET ALL WORKSPACES ================= */
export const getWorkspaces = createAsyncThunk(
  "workspace/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/workspaces/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= JOIN WORKSPACES ================= */
export const joinWorkspaces = createAsyncThunk(
  "workspace/join",
  async (join_code, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/workspaces/join/", {
        join_code: join_code,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
)

/* ================= GET SINGLE WORKSPACES ================= */
export const getSingleWorkspace = createAsyncThunk(
  "workspace/getSingle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/workspaces/${id}/`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
)


const workspaceSlice = createSlice({
  name: "workspace",
  initialState: {
    list: [],
    singleWorkspace: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* CREATE */
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(state.list)) {
          state.list.push(action.payload);
        } else {
          state.list = [action.payload];
        }
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* GET ALL */
      .addCase(getWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        console.log("API response:", action.payload);
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.workspaces || [];

      })
      .addCase(getWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* JOIN WORKSPACE */
      .addCase(joinWorkspaces.pending, (state) => {
        state.loading = true
      })
      .addCase(joinWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(joinWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      /* GET SINGLE WORKSPACE */
      .addCase(getSingleWorkspace.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.singleWorkspace = action.payload;
      })
      .addCase(getSingleWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default workspaceSlice.reducer;

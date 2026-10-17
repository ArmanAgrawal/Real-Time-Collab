import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";


export const fetchCodeDocument = createAsyncThunk(
  "code/fetch",

  async (documentId, { rejectWithValue }) => {

    try {

      const res = await axiosInstance.get(
        `/api/code-documents/${documentId}/`
      );

      return res.data;

    } catch (err) {

      return rejectWithValue(err.response?.data);
    }
  }
);


export const updateCodeDocument = createAsyncThunk(
  "code/update",

  async ({ documentId, code }, { rejectWithValue }) => {

    try {

      const res = await axiosInstance.patch(
        `/api/code-documents/${documentId}/`,
        {
          code
        }
      );

      return res.data;

    } catch (err) {

      return rejectWithValue(err.response?.data);
    }
  }
);


const initialState = {

  document: null,

  loading: false,

  error: null
};


const codeSlice = createSlice({

  name: "code",

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(fetchCodeDocument.pending, (state) => {

        state.loading = true;
      })

      .addCase(fetchCodeDocument.fulfilled, (state, action) => {

        state.loading = false;

        state.document = action.payload;
      })

      .addCase(updateCodeDocument.fulfilled, (state, action) => {

        state.document = action.payload;
      })

      .addCase(fetchCodeDocument.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;
      });
  }
});

export default codeSlice.reducer;
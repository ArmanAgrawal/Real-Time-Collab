// redux/slices/PresentationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axios';

export const exportToPowerPoint = createAsyncThunk(
  'presentation/export',
  async ({ workspaceId, presentationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/workspaces/${workspaceId}/presentations/${presentationId}/export/`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getPresentationFull = createAsyncThunk(
  'presentation/getFull',
  async ({ workspaceId, presentationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/workspaces/${workspaceId}/presentations/${presentationId}/full/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  activeUsers: [],
  isLoading: false,
  error: null,
  exportProgress: 0,
};

const presentationSlice = createSlice({
  name: 'presentation',
  initialState,
  reducers: {
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setExportProgress: (state, action) => {
      state.exportProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exportToPowerPoint.pending, (state) => {
        state.isLoading = true;
        state.exportProgress = 0;
      })
      .addCase(exportToPowerPoint.fulfilled, (state) => {
        state.isLoading = false;
        state.exportProgress = 100;
      })
      .addCase(exportToPowerPoint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveUsers, setExportProgress } = presentationSlice.actions;
export default presentationSlice.reducer;
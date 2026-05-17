// redux/slices/ChatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axios';

// Async Thunks
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async ({ workspaceId, presentationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/workspaces/${workspaceId}/presentations/${presentationId}/chat/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const generateAISummary = createAsyncThunk(
  'chat/generateSummary',
  async ({ workspaceId, presentationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/workspaces/${workspaceId}/presentations/${presentationId}/generate_summary/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'chat/fetchSummary',
  async ({ workspaceId, presentationId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/workspaces/${workspaceId}/presentations/${presentationId}/summary/`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  messages: [],
  typingUsers: [],
  summary: null,
  showSummary: false,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(user => user !== action.payload);
    },
    toggleSummary: (state, action) => {
      state.showSummary = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.typingUsers = [];
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(generateAISummary.fulfilled, (state) => {
        state.showSummary = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload.summary;
      });
  },
});

export const {
  addMessage,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  toggleSummary,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
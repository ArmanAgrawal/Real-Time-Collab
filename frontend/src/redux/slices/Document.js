import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

export const createDocument = createAsyncThunk(
    "document/create",
    async (data, { rejectWithValue }) => {
        try {
            console.log(data.workspaceId);
            const res = await axiosInstance.post(
                `/api/workspaces/${data.workspaceId}/presentations/`,
                {
                    title: data.title,
                    document_type: data.document_type
                }
            );
            console.log(res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
)



const initialState = {
    list: [],
    loading: false,
    error: null,
}

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            /* CREATE */
            .addCase(createDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.list.push(action.payload);
            })
            .addCase(createDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default documentSlice.reducer;
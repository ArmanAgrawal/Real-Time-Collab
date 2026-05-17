import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axios";

/* ================= GET FULL PRESENTATION ================= */
export const getFullPresentation = createAsyncThunk(
    "slides/getFull",
    async ({ workspaceId, presentationId }, { rejectWithValue }) => {
        console.log("pid" + presentationId)
        try {
            const res = await axiosInstance.get(
                `/api/workspaces/${workspaceId}/presentations/${presentationId}/full/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data)
        }
    }
)

/* ================= ADD SLIDE ================= */
export const createSlide = createAsyncThunk(
    "slides/createSlide",
    async ({ workspaceId, presentationId }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/api/workspaces/${workspaceId}/presentations/${presentationId}/slides/`, { presentation: presentationId })
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data)
        }
    }
)

/* ================= ADD ELEMENT ================= */
export const createElement = createAsyncThunk(
    "slides/createElement",
    async ({ workspaceId, presentationId, slideId, data }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`/api/workspaces/${workspaceId}/presentations/${presentationId}/slides/${slideId}/elements/`, data);
            return { slideId, element: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
)

/* ================= UPDATE ELEMENT ================= */
export const updateElement = createAsyncThunk(
    "slides/updateElement",
    async (
        { workspaceId, presentationId, slideId, elementId, data },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosInstance.patch(
                `/api/workspaces/${workspaceId}/presentations/${presentationId}/slides/${slideId}/elements/${elementId}/`,
                data
            );
            return { slideId, element: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

/* ================= DELETE ELEMENT ================= */
export const deleteElement = createAsyncThunk(
    "slide/deleteElement",
    async ({ workspaceId, presentationId, slideId, elementId }, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/workspaces/${workspaceId}/presentations/${presentationId}/slides/${slideId}/elements/${elementId}/`);
            return { slideId, elementId };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
)

/* ================= REORDER SLIDE ================= */
export const reorderSlide = createAsyncThunk(
    "slide/reorderSlide",
    async ({ workspaceId, presentationId, slideId, newOrder }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.patch(`/api/workspaces/${workspaceId}/presentations/${presentationId}/slides/${slideId}/reorder/`,
                { new_order: newOrder })
            return { slideId, newOrder };
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
)

const initialState = {
    slides: [],
    currentSlideIndex: 0,
    loading: false,
    error: null,
    lockedElements: {}
}

const slideSlice = createSlice({
    name: "slide",
    initialState,
    reducers: {
        setCurrentSlide: (state, action) => {
            state.currentSlideIndex = action.payload;
        },
        reorderedSlide: (state, action) => {
            const { sourceIndex, destinationIndex } = action.payload;

            const [movedSlide] = state.slides.splice(sourceIndex, 1);
            state.slides.splice(destinationIndex, 0, movedSlide);
        },
        updateElementFromSocket: (state, action) => {
            const { slideId, element } = action.payload;
            
            const slide = state.slides.find(s => s.id === slideId);
            if (!slide) return;
            
            const index = slide.elements.findIndex(el => el.id === element.id);
            if (index !== -1) {
                // Preserve the element reference but update all properties
                slide.elements[index] = { ...slide.elements[index], ...element };
            }
        },
        addElementFromSocket: (state, action) => {
            const { slideId, data } = action.payload;
            
            const slide = state.slides.find(s => s.id === slideId);
            if (slide) {
                slide.elements.push(data);
            }
        },
        deleteElementFromSocket: (state, action) => {
            const { slideId, elementId } = action.payload;
            
            const slide = state.slides.find(s => s.id === slideId);
            if (slide) {
                slide.elements = slide.elements.filter(el => el.id !== elementId);
            }
        },
        lockElement: (state, action) => {
            const { elementId, userId } = action.payload;
            state.lockedElements[elementId] = userId;
        },
        unlockElement: (state, action) => {
            delete state.lockedElements[action.payload.elementId];
        }
    },
    extraReducers: (builder) => {
        builder
            /* GET FULL */
            .addCase(getFullPresentation.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFullPresentation.fulfilled, (state, action) => {
                state.loading = false;
                state.slides = action.payload.slides;
            })
            .addCase(getFullPresentation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* CREATE SLIDE */
            .addCase(createSlide.fulfilled, (state, action) => {
                state.slides.push({
                    ...action.payload,
                    elements: action.payload.elements || []
                });
            })

            /* CREATE ELEMENT */
            .addCase(createElement.fulfilled, (state, action) => {
                const { slideId, element } = action.payload;
                const slide = state.slides.find((s) => s.id === slideId);
                if (slide) {
                    slide.elements.push(element);
                }
            })

            /* UPDATE ELEMENT */
            .addCase(updateElement.fulfilled, (state, action) => {
                const { slideId, element } = action.payload;
                const slide = state.slides.find((s) => s.id === slideId);
                if (slide) {
                    const index = slide.elements.findIndex(
                        (el) => el.id === element.id
                    )
                    if (index !== -1) {
                        slide.elements[index] = element
                    }
                }
            })

            /* DELETE ELEMENT */
            .addCase(deleteElement.fulfilled, (state, action) => {
                const { slideId, elementId } = action.payload;
                const slide = state.slides.find((s) => s.id === slideId);
                if (slide) {
                    slide.elements = slide.elements.filter((el) => el.id !== elementId);
                }
            })
    }
})

export const { 
    setCurrentSlide, 
    reorderedSlide,
    updateElementFromSocket, 
    addElementFromSocket,
    deleteElementFromSocket,
    lockElement,
    unlockElement 
} = slideSlice.actions;

export default slideSlice.reducer;
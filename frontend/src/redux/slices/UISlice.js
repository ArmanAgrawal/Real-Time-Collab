// redux/slices/UISlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scale: 1,
  stagePosition: { x: 0, y: 0 },
  showPropertiesPanel: true,
  showChatPanel: true,
  showShortcuts: false,
  copiedElement: null,
  selectedElementId: null,
  isDragging: false,
  zoomLevel: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setScale: (state, action) => {
      state.scale = Math.min(Math.max(0.5, action.payload), 3);
    },
    setStagePosition: (state, action) => {
      state.stagePosition = action.payload;
    },
    togglePropertiesPanel: (state) => {
      state.showPropertiesPanel = !state.showPropertiesPanel;
    },
    toggleChatPanel: (state) => {
      state.showChatPanel = !state.showChatPanel;
    },
    toggleShortcuts: (state, action) => {
      state.showShortcuts = action.payload !== undefined ? action.payload : !state.showShortcuts;
    },
    setCopiedElement: (state, action) => {
      state.copiedElement = action.payload;
    },
    setSelectedElementId: (state, action) => {
      state.selectedElementId = action.payload;
    },
    setIsDragging: (state, action) => {
      state.isDragging = action.payload;
    },
    zoomIn: (state) => {
      state.zoomLevel = Math.min(state.zoomLevel + 0.1, 3);
      state.scale = state.zoomLevel;
    },
    zoomOut: (state) => {
      state.zoomLevel = Math.max(state.zoomLevel - 0.1, 0.5);
      state.scale = state.zoomLevel;
    },
    resetZoom: (state) => {
      state.zoomLevel = 1;
      state.scale = 1;
      state.stagePosition = { x: 0, y: 0 };
    },
  },
});

export const {
  setScale,
  setStagePosition,
  togglePropertiesPanel,
  toggleChatPanel,
  toggleShortcuts,
  setCopiedElement,
  setSelectedElementId,
  setIsDragging,
  zoomIn,
  zoomOut,
  resetZoom,
} = uiSlice.actions;

export default uiSlice.reducer;
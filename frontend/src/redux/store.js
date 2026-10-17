import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import workspaceReducer from "./slices/WorkspaceSlice";
import documentReducer from "./slices/Document";
import slideReducer from "./slices/SlideSlice";
import chatReducer from './slices/ChatSlice';
import uiReducer from './slices/UISlice';
import presentationReducer from './slices/PresentationSlice';
import codeReducer from './slices/CodeSlice';

export const store=configureStore({
    reducer:{
        auth:authReducer,
        workspace: workspaceReducer,
        document: documentReducer,
        slide:slideReducer,
        chat:chatReducer,
        ui:uiReducer,
        presentation: presentationReducer,
        code:codeReducer,
    }
})
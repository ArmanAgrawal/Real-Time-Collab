import { useParams } from "react-router-dom";
import SlideSidebar from "../../components/presentation/SlideSidebar";
import Toolbar from "../../components/presentation/Toolbar";
import SlideCanvas from "../../components/presentation/SlideCanvas";
import ChatPanel from "../../components/Chat/ChatPanel";
import PropertiesPanel from "../../components/Properties/PropertiesPanel";
// import PresenceIndicator from "../../components/presentation/PresenceIndicator";
import KeyboardShortcuts from "../../components/KeyboardShortcuts/KeyboardShortcuts";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getFullPresentation } from "../../redux/slices/SlideSlice";
import { fetchChatHistory } from "../../redux/slices/ChatSlice";
import { resetZoom } from "../../redux/slices/UISlice";

import { connectSocket } from "../../socket/socket";
import {
  registerSocketListeners,
  removeSocketListeners
} from "../../socket/socketListeners";

const PresentationEditor = () => {
  const { id, pId } = useParams();
  const dispatch = useDispatch();
  
  const userId = useSelector((state) => state.auth.user);
  const { showPropertiesPanel, showChatPanel } = useSelector((state) => state.ui);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  console.log("userid", userId);

  /* ================= Load Presentation ================= */
  useEffect(() => {
    dispatch(
      getFullPresentation({
        workspaceId: id,
        presentationId: pId
      })
    );
    
    // Load chat history
    dispatch(fetchChatHistory({
      workspaceId: id,
      presentationId: pId
    }));
  }, [dispatch, id, pId]);

  /* ================= Socket ================= */
  useEffect(() => {
    const socket = connectSocket(pId); // connect to presentation room
    registerSocketListeners(dispatch);

    return () => {
      removeSocketListeners();
      socket.close(); // close WebSocket
    };
  }, [pId, dispatch]);

  /* ================= Keyboard Shortcuts ================= */
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      // Zoom shortcuts
      if (e.ctrlKey && e.key === '=') {
        e.preventDefault();
        // Zoom in logic handled in SlideCanvas
        window.dispatchEvent(new CustomEvent('zoomIn'));
      } else if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        // Zoom out logic handled in SlideCanvas
        window.dispatchEvent(new CustomEvent('zoomOut'));
      } else if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        dispatch(resetZoom());
        window.dispatchEvent(new CustomEvent('resetZoom'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [dispatch]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      
      {/* Sidebar with collapse button */}
      <div style={{ position: 'relative' }}>
        <SlideSidebar
          workspaceId={id}
          presentationId={pId}
          isCollapsed={isSidebarCollapsed}
        />
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            right: -12,
            top: 20,
            zIndex: 1000,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        flexDirection: "column",
        overflow: "hidden"
      }}>
        <Toolbar
          workspaceId={id}
          presentationId={pId}
        />

        <div style={{ 
          flex: 1, 
          overflow: "auto",
          position: 'relative'
        }}>
          <SlideCanvas
            workspaceId={id}
            presentationId={pId}
            userId={userId?.id || userId}
          />
        </div>
      </div>

      {/* Properties Panel (Conditional) */}
      {showPropertiesPanel && (
        <PropertiesPanel
          workspaceId={id}
          presentationId={pId}
        />
      )}

      {/* Chat Panel (Conditional) */}
      {/* {showChatPanel && (
        <ChatPanel
          workspaceId={id}
          presentationId={pId}
        />
      )} */}

      {/* Overlay Components */}
      {/* <PresenceIndicator /> */}
      <KeyboardShortcuts />
      
    </div>
  );
};

export default PresentationEditor;
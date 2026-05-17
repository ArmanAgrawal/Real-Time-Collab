// components/Toolbar.jsx (Enhanced)
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../../socket/socket';
import { createElement } from '../../redux/slices/SlideSlice';
import { exportToPowerPoint } from '../../redux/slices/PresentationSlice';
import { zoomIn, zoomOut, resetZoom, togglePropertiesPanel, toggleChatPanel } from '../../redux/slices/UISlice';
import axiosInstance from '../../services/axios';

const Toolbar = ({ workspaceId, presentationId }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const { slides, currentSlideIndex } = useSelector((state) => state.slide);
  const { zoomLevel, showPropertiesPanel, showChatPanel } = useSelector((state) => state.ui);
  const currentSlide = slides?.[currentSlideIndex];

  const addRectangle = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('Socket not connected');
      return;
    }

    try {
      const res = await dispatch(
        createElement({
          workspaceId,
          presentationId,
          slideId: currentSlide.id,
          data: {
            slide: currentSlide.id,
            type: 'rectangle',
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
            width: 150,
            height: 100,
            style: { fillColor: '#00AEEF' },
          },
        })
      );

      if (!res.payload) return;

      const newElement = res.payload.element;
      socket.send(
        JSON.stringify({
          type: 'element-created',
          slideId: currentSlide.id,
          data: newElement,
        })
      );
    } catch (error) {
      console.error('Error adding rectangle:', error);
    }
  };

  const addText = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('Socket not connected');
      return;
    }

    try {
      const res = await dispatch(
        createElement({
          workspaceId,
          presentationId,
          slideId: currentSlide.id,
          data: {
            slide: currentSlide.id,
            type: 'text',
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
            width: 200,
            height: 50,
            content: { text: 'New Text' },
            style: { fontSize: 18, color: '#000000' },
          },
        })
      );

      if (!res.payload) return;

      const newElement = res.payload.element;
      socket.send(
        JSON.stringify({
          type: 'element-created',
          slideId: currentSlide.id,
          data: newElement,
        })
      );
    } catch (error) {
      console.error('Error adding text:', error);
    }
  };

  const handleExport = async () => {
    try {
      const result = await dispatch(exportToPowerPoint({ workspaceId, presentationId }));
      if (result.payload) {
        const url = window.URL.createObjectURL(new Blob([result.payload]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `presentation_${presentationId}.pptx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export presentation');
    }
  };

  const toolbarStyle = {
    padding: '10px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const iconButtonStyle = {
    ...buttonStyle,
    padding: '8px 12px',
    backgroundColor: '#6b7280',
  };

  return (
    <div style={toolbarStyle}>
      <button onClick={addRectangle} style={buttonStyle}>
        ➕ Rectangle
      </button>
      <button onClick={addText} style={buttonStyle}>
        📝 Text
      </button>
      
      <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb', margin: '0 10px' }} />
      
      {/* Zoom Controls */}
      <button onClick={() => dispatch(zoomOut())} style={iconButtonStyle}>
        🔍-
      </button>
      <span style={{ fontSize: '14px', fontWeight: '500' }}>{Math.round(zoomLevel * 100)}%</span>
      <button onClick={() => dispatch(zoomIn())} style={iconButtonStyle}>
        🔍+
      </button>
      <button onClick={() => dispatch(resetZoom())} style={iconButtonStyle}>
        ⟲ Reset
      </button>
      
      <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb', margin: '0 10px' }} />
      
      {/* Export Button */}
      <button onClick={handleExport} style={{ ...buttonStyle, backgroundColor: '#10b981' }}>
        📊 Export PPTX
      </button>
      
      <div style={{ flex: 1 }} />
      
      {/* Toggle Panels */}
      <button
        onClick={() => dispatch(togglePropertiesPanel())}
        style={{
          ...iconButtonStyle,
          backgroundColor: showPropertiesPanel ? '#3b82f6' : '#9ca3af',
        }}
      >
        🎨 Properties
      </button>
      <button
        onClick={() => dispatch(toggleChatPanel())}
        style={{
          ...iconButtonStyle,
          backgroundColor: showChatPanel ? '#3b82f6' : '#9ca3af',
        }}
      >
        💬 Chat
      </button>
    </div>
  );
};

export default Toolbar;
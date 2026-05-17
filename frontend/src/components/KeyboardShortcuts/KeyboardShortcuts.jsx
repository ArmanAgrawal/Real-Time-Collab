// components/KeyboardShortcuts.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShortcuts } from '../../redux/slices/UISlice';

const KeyboardShortcuts = () => {
  const dispatch = useDispatch();
  const { showShortcuts } = useSelector((state) => state.ui);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '?' || (e.ctrlKey && e.key === '/')) {
        e.preventDefault();
        dispatch(toggleShortcuts());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch]);

  if (!showShortcuts) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        zIndex: 2000,
        minWidth: '300px',
        border: '1px solid #e5e7eb',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>⌨️ Keyboard Shortcuts</h3>
        <button
          onClick={() => dispatch(toggleShortcuts(false))}
          style={{
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ✕
        </button>
      </div>
      
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>Delete</kbd>
          <span>Delete selected element</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>Ctrl/Cmd + Z</kbd>
          <span>Undo</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>Ctrl/Cmd + Shift + Z</kbd>
          <span>Redo</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>Ctrl/Cmd + C</kbd>
          <span>Copy element</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>Ctrl/Cmd + V</kbd>
          <span>Paste element</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>+ / -</kbd>
          <span>Zoom in/out</span>
        </div>
        <div style={shortcutRow}>
          <kbd style={kbdStyle}>?</kbd>
          <span>Show this menu</span>
        </div>
      </div>
      
      <button
        onClick={() => dispatch(toggleShortcuts(false))}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Got it
      </button>
    </div>
  );
};

const shortcutRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  fontSize: '14px',
};

const kbdStyle = {
  backgroundColor: '#f3f4f6',
  padding: '4px 8px',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '12px',
  border: '1px solid #d1d5db',
};

export default KeyboardShortcuts;
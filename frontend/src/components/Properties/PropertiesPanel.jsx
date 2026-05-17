// components/PropertiesPanel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateElement } from '../../redux/slices/SlideSlice';
import { getSocket } from '../../socket/socket';

const PropertiesPanel = ({ workspaceId, presentationId }) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const { slides, currentSlideIndex } = useSelector((state) => state.slide);
  const { selectedElementId } = useSelector((state) => state.ui);
  
  const selectedElement = slides[currentSlideIndex]?.elements.find(
    (el) => el.id === selectedElementId
  );
  
  const [properties, setProperties] = useState({
    fillColor: '#00AEEF',
    fontSize: 18,
    color: '#000000',
    width: 100,
    height: 100,
    rotation: 0,
    fontFamily: 'Arial',
  });

  useEffect(() => {
    if (selectedElement) {
      setProperties({
        fillColor: selectedElement.style?.fillColor || '#00AEEF',
        fontSize: selectedElement.style?.fontSize || 18,
        color: selectedElement.style?.color || '#000000',
        width: selectedElement.width || 100,
        height: selectedElement.height || 100,
        rotation: selectedElement.rotation || 0,
        fontFamily: selectedElement.style?.fontFamily || 'Arial',
      });
    }
  }, [selectedElement]);

  const updateProperty = (key, value) => {
    if (!selectedElement) return;

    const updatedData = {};
    
    if (selectedElement.type === 'rectangle') {
      if (key === 'fillColor') {
        updatedData.style = { ...selectedElement.style, fillColor: value };
      } else {
        updatedData[key] = value;
      }
    } else if (selectedElement.type === 'text') {
      if (key === 'color') {
        updatedData.style = { ...selectedElement.style, color: value };
      } else if (key === 'fontSize') {
        updatedData.style = { ...selectedElement.style, fontSize: value };
      } else if (key === 'fontFamily') {
        updatedData.style = { ...selectedElement.style, fontFamily: value };
      } else {
        updatedData[key] = value;
      }
    }

    const updatedElement = { ...selectedElement, ...updatedData };

    dispatch(
      updateElement({
        workspaceId,
        presentationId,
        slideId: slides[currentSlideIndex].id,
        elementId: selectedElementId,
        data: updatedData,
      })
    );

    socket.send(
      JSON.stringify({
        type: 'element-updated',
        workspaceId,
        slideId: slides[currentSlideIndex].id,
        data: updatedElement,
      })
    );
  };

  if (!selectedElement) {
    return (
      <div
        style={{
          width: 260,
          borderLeft: '1px solid #e5e7eb',
          padding: '16px',
          backgroundColor: '#f9fafb',
        }}
      >
        <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
          Select an element to edit properties
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 280,
        borderLeft: '1px solid #e5e7eb',
        padding: '16px',
        backgroundColor: '#ffffff',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Properties</h3>

      {/* Common Properties */}
      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Position X</label>
        <input
          type="number"
          value={Math.round(selectedElement.x)}
          onChange={(e) => updateProperty('x', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Position Y</label>
        <input
          type="number"
          value={Math.round(selectedElement.y)}
          onChange={(e) => updateProperty('y', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Width</label>
        <input
          type="number"
          value={properties.width}
          onChange={(e) => updateProperty('width', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Height</label>
        <input
          type="number"
          value={properties.height}
          onChange={(e) => updateProperty('height', parseInt(e.target.value))}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={styles.label}>Rotation ({properties.rotation}°)</label>
        <input
          type="range"
          min="0"
          max="360"
          value={properties.rotation}
          onChange={(e) => updateProperty('rotation', parseInt(e.target.value))}
          style={styles.slider}
        />
      </div>

      {/* Rectangle Specific Properties */}
      {selectedElement.type === 'rectangle' && (
        <div style={{ marginBottom: '16px' }}>
          <label style={styles.label}>Fill Color</label>
          <input
            type="color"
            value={properties.fillColor}
            onChange={(e) => updateProperty('fillColor', e.target.value)}
            style={styles.colorInput}
          />
        </div>
      )}

      {/* Text Specific Properties */}
      {selectedElement.type === 'text' && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Font Size</label>
            <input
              type="number"
              value={properties.fontSize}
              onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
              style={styles.input}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Font Family</label>
            <select
              value={properties.fontFamily}
              onChange={(e) => updateProperty('fontFamily', e.target.value)}
              style={styles.select}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={styles.label}>Text Color</label>
            <input
              type="color"
              value={properties.color}
              onChange={(e) => updateProperty('color', e.target.value)}
              style={styles.colorInput}
            />
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
  },
  select: {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: 'white',
  },
  slider: {
    width: '100%',
  },
  colorInput: {
    width: '100%',
    height: '36px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PropertiesPanel;
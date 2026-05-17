import React, { useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer, Rect, Text, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

import {
  updateElement,
  deleteElement,
  updateElementFromSocket
} from "../../redux/slices/SlideSlice";

import { getSocket } from "../../socket/socket";

const SlideCanvas = ({ workspaceId, presentationId, userId }) => {

  const dispatch = useDispatch();
  const socket = getSocket();

  const { slides, currentSlideIndex, lockedElements } = useSelector(
    (state) => state.slide
  );

  const slide = slides[currentSlideIndex] || { elements: [] };

  const transformerRef = useRef(null);
  const stageRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const dragTimeoutRef = useRef(null);
  const resizeTimeoutRef = useRef(null);

  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [localText, setLocalText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  /* ================= Attach Transformer ================= */

  useEffect(() => {

    if (!selectedId) {
      transformerRef.current?.nodes([]);
      return;
    }

    const stage = stageRef.current;
    const selectedNode = stage?.findOne(`#element-${selectedId}`);

    if (selectedNode && transformerRef.current) {
      transformerRef.current.nodes([selectedNode]);
      transformerRef.current.getLayer().batchDraw();
    }

  }, [selectedId]);

  /* ================= Delete Key ================= */

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Delete" && selectedId) {

        dispatch(
          deleteElement({
            workspaceId,
            presentationId,
            slideId: slide.id,
            elementId: selectedId
          })
        );

        if (socket && socket.readyState === WebSocket.OPEN) {

          socket.send(JSON.stringify({
            type: "element-deleted",
            workspaceId,
            slideId: slide.id,
            elementId: selectedId
          }));

        }

        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);

  }, [selectedId, slide.id, workspaceId, presentationId, socket]);

  /* ================= Select Element ================= */

  const handleSelect = useCallback((elementId) => {

    const lockedBy = lockedElements[elementId];

    if (lockedBy && lockedBy !== userId) {
      alert("Another user is editing this element");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {

      socket.send(JSON.stringify({
        type: "element-locked",
        workspaceId,
        elementId,
        userId
      }));

    }

    setSelectedId(elementId);

  }, [lockedElements, userId, socket, workspaceId]);

  /* ================= Stage Click ================= */

  const handleStageMouseDown = useCallback((e) => {

    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }

  }, []);

  /* ================= Rectangle Drag Move ================= */

  const handleRectDragMove = useCallback((e, el) => {

    if (!isDragging) setIsDragging(true);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };

    const updatedElement = {
      ...el,
      ...newPos
    };

    dispatch(
      updateElementFromSocket({
        payload: {
          slideId: slide.id,
          element: updatedElement
        }
      })
    );

    dragTimeoutRef.current = setTimeout(() => {

      if (socket && socket.readyState === WebSocket.OPEN) {

        socket.send(JSON.stringify({
          type: "element-updated",
          workspaceId,
          slideId: slide.id,
          data: updatedElement
        }));

      }

    }, 30);

  }, [isDragging, slide.id, socket, workspaceId, dispatch]);

  /* ================= Rectangle Drag End ================= */

  const handleRectDragEnd = useCallback((e, el) => {

    setIsDragging(false);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };

    const updatedElement = {
      ...el,
      ...newPos
    };

    dispatch(
      updateElement({
        workspaceId,
        presentationId,
        slideId: slide.id,
        elementId: el.id,
        data: newPos
      })
    );

    if (socket && socket.readyState === WebSocket.OPEN) {

      socket.send(JSON.stringify({
        type: "element-updated",
        workspaceId,
        slideId: slide.id,
        data: updatedElement
      }));

    }

  }, [slide.id, socket, workspaceId, dispatch, presentationId]);

  /* ================= Rectangle Transform ================= */

  const handleRectTransformEnd = useCallback((e, el) => {

    const node = e.target;

    const newWidth = Math.max(
      5,
      node.width() * node.scaleX()
    );

    const newHeight = Math.max(
      5,
      node.height() * node.scaleY()
    );

    node.scaleX(1);
    node.scaleY(1);

    const data = {
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      rotation: node.rotation()
    };

    const updatedElement = {
      ...el,
      ...data
    };

    dispatch(
      updateElementFromSocket({
        payload: {
          slideId: slide.id,
          element: updatedElement
        }
      })
    );

    dispatch(
      updateElement({
        workspaceId,
        presentationId,
        slideId: slide.id,
        elementId: el.id,
        data
      })
    );

    if (socket && socket.readyState === WebSocket.OPEN) {

      socket.send(JSON.stringify({
        type: "element-updated",
        workspaceId,
        slideId: slide.id,
        data: updatedElement
      }));

    }

  }, [slide.id, socket, workspaceId, dispatch, presentationId]);

  /* ================= Text Drag Move ================= */

  const handleTextDragMove = useCallback((e, el) => {

    if (!isDragging) setIsDragging(true);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };

    const updatedElement = {
      ...el,
      ...newPos
    };

    dispatch(
      updateElementFromSocket({
        payload: {
          slideId: slide.id,
          element: updatedElement
        }
      })
    );

    dragTimeoutRef.current = setTimeout(() => {

      if (socket && socket.readyState === WebSocket.OPEN) {

        socket.send(JSON.stringify({
          type: "element-updated",
          workspaceId,
          slideId: slide.id,
          data: updatedElement
        }));

      }

    }, 30);

  }, [isDragging, slide.id, socket, workspaceId, dispatch]);

  /* ================= Text Drag End ================= */

  const handleTextDragEnd = useCallback((e, el) => {

    setIsDragging(false);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };

    const updatedElement = {
      ...el,
      ...newPos
    };

    dispatch(
      updateElement({
        workspaceId,
        presentationId,
        slideId: slide.id,
        elementId: el.id,
        data: newPos
      })
    );

    if (socket && socket.readyState === WebSocket.OPEN) {

      socket.send(JSON.stringify({
        type: "element-updated",
        workspaceId,
        slideId: slide.id,
        data: updatedElement
      }));

    }

  }, [slide.id, socket, workspaceId, dispatch, presentationId]);

const textEl = slide.elements.find(
  (e) => e.id === editingId
);

const stageBox =
  stageRef.current
    ?.container()
    ?.getBoundingClientRect();

  return (

<div
  ref={containerRef}
  style={{
    position: "relative",
    background: "#f3f4f6",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}
>

      <div
        style={{
          background: "#ffffff",
          padding: 10,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
        }}
      >

        <Stage
          width={960}
          height={540}
          ref={stageRef}
          onMouseDown={handleStageMouseDown}
          style={{ background: "#ffffff" }}
        >

          <Layer>

            {slide.elements.map((el) => {

              const isLocked = lockedElements[el.id];

              /* ================= RECTANGLE ================= */

              if (el.type === "rectangle") {

                return (
                  <Rect
                    id={`element-${el.id}`}
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    width={el.width}
                    height={el.height}
                    fill={el.style?.fillColor || "blue"}
                    rotation={el.rotation || 0}
                    draggable={!isLocked || isLocked === userId}
                    stroke={isLocked ? "red" : "transparent"}
                    strokeWidth={2}
                    onClick={() => handleSelect(el.id)}
                    onDragMove={(e) =>
                      handleRectDragMove(e, el)
                    }
                    onDragEnd={(e) =>
                      handleRectDragEnd(e, el)
                    }
                    onTransformEnd={(e) =>
                      handleRectTransformEnd(e, el)
                    }
                  />
                );
              }

              /* ================= TEXT ================= */

              if (el.type === "text") {

                return (
                  <Text
                    id={`element-${el.id}`}
                    key={el.id}
                    x={el.x}
                    y={el.y}
                    text={el.content?.text || ""}
                    fontSize={el.style?.fontSize || 18}
                    fontFamily={el.style?.fontFamily || "Arial"}
                    fontStyle={el.style?.fontStyle || "normal"}
                    fill={el.style?.color || "black"}
                    width={el.width}
                    rotation={el.rotation || 0}
                    draggable={!isLocked || isLocked === userId}
                    visible={editingId !== el.id}
                    stroke={isLocked ? "red" : "transparent"}
                    strokeWidth={2}
                    onClick={() => handleSelect(el.id)}
                    onDblClick={() => {

                      if (isLocked && isLocked !== userId)
                        return;

                      setSelectedId(el.id);
                      setLocalText(el.content?.text || "");
                      setEditingId(el.id);

                    }}
                    onDragMove={(e) =>
                      handleTextDragMove(e, el)
                    }
                    onDragEnd={(e) =>
                      handleTextDragEnd(e, el)
                    }
                  />
                );
              }

              return null;

            })}

            <Transformer
              ref={transformerRef}
              rotateEnabled={true}
              boundBoxFunc={(oldBox, newBox) => {

                if (
                  newBox.width < 10 ||
                  newBox.height < 10
                ) {
                  return oldBox;
                }

                return newBox;

              }}
            />

          </Layer>

        </Stage>

      </div>

      {/* ================= TEXT EDITOR ================= */}

      {editingId && textEl && (

        <textarea
          ref={textareaRef}
          value={localText}
          autoFocus
style={{
  position: "fixed",

  top: stageBox.top + textEl.y,
  left: stageBox.left + textEl.x,

  width: textEl.width,

  fontSize: textEl.style?.fontSize || 18,
  fontFamily: textEl.style?.fontFamily || "Arial",
  fontWeight: textEl.style?.fontWeight || "normal",
  lineHeight: textEl.style?.lineHeight || 1.2,

  border: "none",
  outline: "none",
  resize: "none",

  background: "transparent",
  color: textEl.style?.color || "black",

  overflow: "hidden",

  padding: 0,
  margin: 0,

  zIndex: 1000
}}
          onChange={(e) => {

            const newText = e.target.value;

            setLocalText(newText);

            if (resizeTimeoutRef.current) {
              clearTimeout(resizeTimeoutRef.current);
            }

            resizeTimeoutRef.current = setTimeout(() => {

              if (socket && socket.readyState === WebSocket.OPEN) {

                socket.send(JSON.stringify({
                  type: "element-updated",
                  workspaceId,
                  slideId: slide.id,
                  data: {
                    ...textEl,
                    content: { text: newText }
                  }
                }));

              }

            }, 100);

          }}
          onBlur={() => {

            if (resizeTimeoutRef.current) {
              clearTimeout(resizeTimeoutRef.current);
            }

            const data = {
              content: { text: localText }
            };

            dispatch(
              updateElement({
                workspaceId,
                presentationId,
                slideId: slide.id,
                elementId: editingId,
                data
              })
            );

            if (socket && socket.readyState === WebSocket.OPEN) {

              socket.send(JSON.stringify({
                type: "element-updated",
                workspaceId,
                slideId: slide.id,
                data: {
                  ...textEl,
                  content: { text: localText }
                }
              }));

              socket.send(JSON.stringify({
                type: "element-unlocked",
                workspaceId,
                elementId: editingId
              }));

            }

            setEditingId(null);

          }}
        />

      )}

    </div>
  );
};

export default SlideCanvas;
import {
  addElementFromSocket,
  deleteElementFromSocket,
  lockElement,
  unlockElement,
  updateElementFromSocket
} from "../redux/slices/SlideSlice";

import { getSocket } from "./socket";

export const registerSocketListeners = (dispatch) => {
  const socket = getSocket();

  if (!socket) return;

  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    console.log("📩 Received:", data);

    switch (data.type) {
      case "element-created":
        dispatch(addElementFromSocket(data));
        break;

      case "element-updated":
        dispatch(updateElementFromSocket(data));
        break;

      case "element-deleted":
        dispatch(deleteElementFromSocket(data));
        break;

      case "element-locked":
        dispatch(lockElement(data));
        break;

      case "element-unlocked":
        dispatch(unlockElement(data));
        break;

      default:
        console.warn("Unknown event:", data.type);
    }
  });
};

export const removeSocketListeners = () => {
  const socket = getSocket();
  if (socket) socket.onmessage = null;
};
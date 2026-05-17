import { useEffect } from "react";
import { connectSocket } from "../socket/socket";
import {
  registerSocketListeners,
  removeSocketListeners
} from "../socket/socketListeners";

export const useSocket = (presentationId, dispatch) => {

  useEffect(() => {

    const socket = connectSocket(presentationId);

    registerSocketListeners(dispatch);

    return () => {
      removeSocketListeners();
      socket.close();
    };

  }, [presentationId]);
};
let socket = null;

export const connectSocket = (presentationId) => {  // ✅ renamed
  socket = new WebSocket(
    `wss://emerson-unprinted-intercolonially.ngrok-free.dev/ws/presentations/${presentationId}/`
  );

  socket.onopen = () => {
    console.log("✅ WebSocket Connected");
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket Error", err);
  };

  socket.onclose = () => {
    console.warn("⚠️ WebSocket Closed");
  };

  return socket;
};

export const getSocket = () => socket;
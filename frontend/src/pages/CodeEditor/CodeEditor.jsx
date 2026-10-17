import Editor from "@monaco-editor/react";
import debounce from "lodash/debounce";
import { useEffect, useRef ,useState} from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchCodeDocument,
  updateCodeDocument
} from "../../redux/slices/CodeSlice";

import { useParams } from "react-router-dom";


const CodeEditor = () => {

  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const { documentId } = useParams();
  const { document } = useSelector(
    (state) => state.code
  );

const [activeUsers, setActiveUsers] = useState([]);

  const debouncedSend = useRef(
    debounce((code) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            code
          })
        );
      }
    }, 300)
  ).current;

  useEffect(() => {

    dispatch(
      fetchCodeDocument(documentId)
    );
    const token = localStorage.getItem("accessToken");
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/code/${documentId}/?token=${token}`
    );

socketRef.current.onmessage = (event) => {

  const data = JSON.parse(event.data);

  console.log("WS Message:", data);

  if (data.type === "active_users") {
    setActiveUsers(data.users);
    return;
  }

  dispatch(
    updateCodeDocument({
      documentId,
      code: data.code
    })
  );
};

    return () => {
      debouncedSend.cancel();
      socketRef.current?.close();
    };

  }, []);

  const handleChange = (value) => {

    dispatch(
      updateCodeDocument({
        documentId,
        code: value
      })
    );

    debouncedSend(value);
  };

  return (
      <div style={{ height: "100vh" }}>

    <div
      style={{
        background: "#252526",
        color: "white",
        padding: "10px",
        borderBottom: "1px solid #444"
      }}
    >
      Active Users:
      {activeUsers.map(user => (
        <span
          key={user}
          style={{
            marginLeft: "10px"
          }}
        >
          🟢 {user}
        </span>
      ))}
    </div>

      <Editor
        height="100%"
        language="javascript"
        value={document?.code || ""}
        onChange={handleChange}
        theme="vs-dark"
      />

    </div>
  );
};

export default CodeEditor;
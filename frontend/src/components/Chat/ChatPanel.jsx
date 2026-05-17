// components/ChatPanel.jsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '../../socket/socket';
import {
  fetchChatHistory,
  generateAISummary,
  fetchSummary,
  addMessage,
  addTypingUser,
  removeTypingUser,
  toggleSummary,
} from '../../redux/slices/ChatSlice';

const ChatPanel = ({ workspaceId, presentationId }) => {
  const dispatch = useDispatch();
  const socket = getSocket();
  const { messages, typingUsers, summary, showSummary, isLoading } = useSelector(
    (state) => state.chat
  );
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = React.useState('');
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatHistory({ workspaceId, presentationId }));

    // WebSocket listeners
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'CHAT') {
        dispatch(addMessage(data.payload));
        scrollToBottom();
      }
      if (data.type === 'TYPING') {
        if (data.payload.typing) {
          dispatch(addTypingUser(data.payload.user));
        } else {
          dispatch(removeTypingUser(data.payload.user));
        }
      }
    };

    socket.onmessage = handleMessage;
    return () => {
      socket.onmessage = null;
    };
  }, [dispatch, workspaceId, presentationId, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    socket.send(
      JSON.stringify({
        type: 'CHAT',
        payload: { message: newMessage },
      })
    );

    setNewMessage('');
  };

  const handleTyping = () => {
    socket.send(
      JSON.stringify({
        type: 'TYPING',
        payload: { typing: true },
      })
    );

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: 'TYPING',
          payload: { typing: false },
        })
      );
    }, 1000);
  };

  const handleGenerateSummary = async () => {
    await dispatch(generateAISummary({ workspaceId, presentationId }));
    await dispatch(fetchSummary({ workspaceId, presentationId }));
    dispatch(toggleSummary(true));
  };

  return (
    <div
      style={{
        width: 320,
        borderLeft: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>💬 Chat</h3>
          <button
            onClick={handleGenerateSummary}
            style={styles.button}
            disabled={isLoading}
          >
            🤖 AI Summary
          </button>
        </div>
      </div>

      {/* AI Summary Panel */}
      {showSummary && summary && (
        <div
          style={{
            padding: '12px',
            backgroundColor: '#f0f9ff',
            margin: '12px',
            borderRadius: '8px',
            border: '1px solid #bae6fd',
            maxHeight: '200px',
            overflow: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px' }}>📝 AI Summary</h4>
            <button
              onClick={() => dispatch(toggleSummary(false))}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '13px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>
            {summary}
          </p>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <strong style={{ fontSize: '14px' }}>{msg.user || 'Anonymous'}</strong>
              <small style={{ color: '#6b7280', fontSize: '11px' }}>
                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : 'Just now'}
              </small>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#374151' }}>
              {msg.message}
            </p>
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div style={{ color: '#6b7280', fontSize: '12px', fontStyle: 'italic' }}>
            {typingUsers.join(', ')} typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          onFocus={handleTyping}
          placeholder="Type a message... (Enter to send)"
          style={styles.textarea}
          rows={3}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Send Message
        </button>
      </div>
    </div>
  );
};

const styles = {
  button: {
    padding: '6px 12px',
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  closeButton: {
    padding: '2px 6px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: '8px',
  },
  sendButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ChatPanel;
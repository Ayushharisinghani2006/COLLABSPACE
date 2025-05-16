import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Whiteboard = ({ socket }) => {
  const { meetingId } = useParams();
  const { user } = useContext(AuthContext);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [mode, setMode] = useState('draw');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, value: '' });
  const [meeting, setMeeting] = useState(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [color, setColor] = useState('black');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch meeting details
  useEffect(() => {
    if (!user) {
      setError('Please log in to view the whiteboard');
      console.error('User not found in AuthContext');
      return;
    }

    if (!socket) {
      setError('Real-time collaboration is unavailable. Please refresh the page.');
      console.error('Socket prop is not provided');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Meeting ID in Whiteboard:', meetingId);
    console.log('Token in Whiteboard:', token);

    const fetchMeeting = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/v1/meetings/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMeeting(res.data);
        socket.emit('joinMeeting', meetingId);
        console.log('Meeting fetched successfully:', res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('Meeting not found, attempting to create a new meeting');
          try {
            const newMeeting = await axios.post(
              `http://localhost:5000/v1/meetings`,
              {
                title: `Meeting for Whiteboard ${meetingId}`,
                creator: user._id,
                participants: [user._id],
                whiteboard: true,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setMeeting(newMeeting.data);
            socket.emit('joinMeeting', meetingId);
            console.log('New meeting created:', newMeeting.data);
          } catch (createErr) {
            setError('Failed to create meeting: ' + (createErr.response?.data?.message || createErr.message));
            console.error('Create meeting error:', createErr);
          }
        } else {
          setError('Failed to load meeting details: ' + (err.response?.data?.message || err.message));
          console.error('Fetch meeting error:', err);
        }
      }
    };

    fetchMeeting();
  }, [socket, meetingId, user]);

  // Initialize canvas and set up socket listeners
  useEffect(() => {
    if (!meeting) return; // Wait until meeting is loaded

    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas initialization failed: Canvas element not found');
      console.error('Canvas ref is null after meeting loaded');
      return;
    }

    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Failed to get canvas context');
      console.error('Canvas context is null');
      return;
    }

    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.font = '20px Arial';
    setContext(ctx);
    console.log('Canvas initialized successfully');

    // Load saved whiteboard state
    const loadWhiteboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/v1/whiteboards/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.state) {
          const img = new Image();
          img.src = res.data.state;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            setHistory([res.data.state]);
            setHistoryIndex(0);
            console.log('Whiteboard state loaded');
          };
          img.onerror = (err) => {
            console.error('Failed to load whiteboard image:', err);
          };
        }
      } catch (err) {
        console.error('Load whiteboard error:', err.response?.data?.message || err.message);
      }
    };
    loadWhiteboard();

    // Socket.IO event listeners
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      setError('Socket connection failed: ' + err.message);
    });

    socket.on('draw', (data) => {
      if (data.meetingId !== meetingId || !ctx) return;
      const { x0, y0, x1, y1, type, color, brushSize } = data;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      if (type === 'draw' || type === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.closePath();
      } else if (type === 'line') {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.closePath();
      } else if (type === 'rectangle') {
        const width = x1 - x0;
        const height = y1 - y0;
        ctx.strokeRect(x0, y0, width, height);
      } else if (type === 'circle') {
        const radius = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        ctx.beginPath();
        ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      console.log('Draw event received:', data);
    });

    socket.on('text', (data) => {
      if (data.meetingId !== meetingId || !ctx) return;
      const { x, y, value } = data;
      ctx.fillText(value, x, y);
      console.log('Text event received:', data);
    });

    socket.on('chatMessage', (data) => {
      if (data.meetingId !== meetingId) return;
      setMessages((prev) => [...prev, data]);
      console.log('Chat message received:', data);
    });

    socket.on('userJoined', (data) => {
      setOnlineUsers((prev) => [...new Set([...prev, data.userId])]);
      console.log('User joined:', data.userId);
    });

    socket.on('userLeft', (data) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== data.userId));
      console.log('User left:', data.userId);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('draw');
      socket.off('text');
      socket.off('chatMessage');
      socket.off('userJoined');
      socket.off('userLeft');
      socket.emit('leaveMeeting', meetingId);
    };
  }, [socket, meetingId, meeting, color, brushSize]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const addToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const newState = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    console.log('Added to history, new index:', newHistory.length - 1);
  };

  const startDrawing = (e) => {
    if (!context) {
      console.error('Context not available in startDrawing');
      return;
    }
    const { x, y } = getCanvasCoordinates(e);
    setStartPos({ x, y });

    if (mode === 'text') {
      setTextInput({ show: true, x, y, value: '' });
      return;
    }

    setIsDrawing(true);
    if (mode === 'draw' || mode === 'eraser') {
      context.beginPath();
      context.moveTo(x, y);
    }
    console.log('Start drawing at:', { x, y });
  };

  const draw = (e) => {
    if (!isDrawing || mode === 'text' || !context) return;

    const { x, y } = getCanvasCoordinates(e);

    if (mode === 'draw' || mode === 'eraser') {
      context.strokeStyle = mode === 'eraser' ? 'white' : color;
      context.lineWidth = brushSize;
      context.lineTo(x, y);
      context.stroke();

      socket.emit('draw', {
        meetingId,
        x0: context.x || startPos.x,
        y0: context.y || startPos.y,
        x1: x,
        y1: y,
        type: mode,
        color: context.strokeStyle,
        brushSize: context.lineWidth,
      });

      context.x = x;
      context.y = y;
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing || mode === 'text' || !context) return;

    const { x, y } = getCanvasCoordinates(e);

    if (mode === 'draw' || mode === 'eraser') {
      context.closePath();
    } else if (mode === 'line') {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.beginPath();
      context.moveTo(startPos.x, startPos.y);
      context.lineTo(x, y);
      context.stroke();
      context.closePath();

      socket.emit('draw', {
        meetingId,
        x0: startPos.x,
        y0: startPos.y,
        x1: x,
        y1: y,
        type: 'line',
        color,
        brushSize,
      });
    } else if (mode === 'rectangle') {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      const width = x - startPos.x;
      const height = y - startPos.y;
      context.strokeRect(startPos.x, startPos.y, width, height);

      socket.emit('draw', {
        meetingId,
        x0: startPos.x,
        y0: startPos.y,
        x1: x,
        y1: y,
        type: 'rectangle',
        color,
        brushSize,
      });
    } else if (mode === 'circle') {
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
      context.beginPath();
      context.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      context.stroke();
      context.closePath();

      socket.emit('draw', {
        meetingId,
        x0: startPos.x,
        y0: startPos.y,
        x1: x,
        y1: y,
        type: 'circle',
        color,
        brushSize,
      });
    }

    addToHistory();
    setIsDrawing(false);
    console.log('Stop drawing at:', { x, y });
  };

  const handleTextSubmit = (e) => {
    if (e.key === 'Enter' && textInput.value && context) {
      context.fillText(textInput.value, textInput.x, textInput.y);

      socket.emit('text', {
        meetingId,
        x: textInput.x,
        y: textInput.y,
        value: textInput.value,
      });

      addToHistory();
      setTextInput({ show: false, x: 0, y: 0, value: '' });
      console.log('Text submitted:', textInput.value);
    }
  };

  const clearCanvas = () => {
    if (!context) return;
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    addToHistory();
    console.log('Canvas cleared');
  };

  const saveWhiteboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const state = canvas.toDataURL();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/v1/whiteboards`,
        { meetingId, state },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Whiteboard saved successfully');
    } catch (err) {
      console.error('Save whiteboard error:', err.response?.data?.message || err.message);
    }
  };

  const undo = () => {
    if (historyIndex <= 0 || !context) return;
    const canvas = canvasRef.current;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      console.log('Undo performed, new index:', newIndex);
    };
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !context) return;
    const canvas = canvasRef.current;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    const img = new Image();
    img.src = history[newIndex];
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
      console.log('Redo performed, new index:', newIndex);
    };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      meetingId,
      userId: user._id,
      userName: user.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit('chatMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
    console.log('Message sent:', messageData);
  };

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!meeting) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="whiteboard-container" style={{ margin: '20px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="meeting-details">
        <h1 className="text-2xl font-bold">{meeting.title}</h1>
        <p>Creator: {meeting.creator.name}</p>
        <p>Participants: {meeting.participants.map(p => p.name || p).join(', ')}</p>
        <p>Online: {onlineUsers.length} user(s)</p>
      </div>

      <div className="whiteboard-section">
        <h2 className="text-xl font-semibold mb-2">Whiteboard</h2>
        <div className="toolbar flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setMode('draw')}
            className={`px-4 py-2 rounded ${mode === 'draw' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Draw
          </button>
          <button
            onClick={() => setMode('line')}
            className={`px-4 py-2 rounded ${mode === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Line
          </button>
          <button
            onClick={() => setMode('rectangle')}
            className={`px-4 py-2 rounded ${mode === 'rectangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Rectangle
          </button>
          <button
            onClick={() => setMode('circle')}
            className={`px-4 py-2 rounded ${mode === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Circle
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded ${mode === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Text
          </button>
          <button
            onClick={() => setMode('eraser')}
            className={`px-4 py-2 rounded ${mode === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Eraser
          </button>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="px-4 py-2 rounded bg-gray-200"
          >
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
          <select
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="px-4 py-2 rounded bg-gray-200"
          >
            <option value={2}>Small (2px)</option>
            <option value={5}>Medium (5px)</option>
            <option value={10}>Large (10px)</option>
          </select>
          <button onClick={undo} className="px-4 py-2 rounded bg-gray-200">
            Undo
          </button>
          <button onClick={redo} className="px-4 py-2 rounded bg-gray-200">
            Redo
          </button>
          <button onClick={clearCanvas} className="px-4 py-2 rounded bg-red-500 text-white">
            Clear Whiteboard
          </button>
          <button onClick={saveWhiteboard} className="px-4 py-2 rounded bg-green-500 text-white">
            Save Whiteboard
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          style={{ border: '2px solid black', width: '100%', maxWidth: '800px' }}
        />
        {textInput.show && (
          <input
            type="text"
            value={textInput.value}
            onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
            onKeyDown={handleTextSubmit}
            style={{
              position: 'absolute',
              top: textInput.y,
              left: textInput.x,
              fontSize: '20px',
              border: '1px solid black',
              background: 'white',
              zIndex: 10,
            }}
            autoFocus
          />
        )}
      </div>

      <div className="chat-box" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', maxHeight: '200px', overflowY: 'auto', width: '100%', maxWidth: '800px' }}>
        <h3 className="text-lg font-semibold mb-2">Chat</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message mb-2">
              <span className="font-bold">{msg.userName}:</span> {msg.message}{' '}
              <span className="text-gray-500 text-sm">({new Date(msg.timestamp).toLocaleTimeString()})</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex mt-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-l"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Whiteboard;
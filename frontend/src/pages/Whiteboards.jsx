import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import { FaPen, FaEraser, FaTrash, FaPaintBrush, FaStickyNote, FaSquare, FaCircle, FaTextHeight, FaUndo, FaRedo, FaShareAlt, FaDownload, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { AuthContext } from '../contexts/AuthContext';

const Whiteboard = ({ meetingId }) => {
  const { socket } = useContext(AuthContext);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [lastDraw, setLastDraw] = useState({ x: 0, y: 0, time: 0 });

  const drawDebounce = useCallback((data) => {
    const now = Date.now();
    if (now - lastDraw.time > 50) { // Debounce to 50ms
      socket.emit('draw', data);
      setLastDraw({ x: data.x1, y: data.y1, time: now });
    }
  }, [lastDraw, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = tool === 'pen' ? color : 'white';
    ctx.lineWidth = tool === 'pen' ? 2 : 10;
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x / zoom, pan.y / zoom);

    const handleDraw = (data) => {
      const { x0, y0, x1, y1, color: drawColor, isErasing, shape, text } = data;
      ctx.beginPath();
      ctx.strokeStyle = isErasing ? 'white' : drawColor;
      ctx.lineWidth = isErasing ? 10 : 2;
      if (shape) {
        if (shape.type === 'rectangle') {
          ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        } else if (shape.type === 'circle') {
          const radius = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
          ctx.beginPath();
          ctx.arc(x0, y0, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (text) {
        ctx.font = '16px Arial';
        ctx.fillStyle = drawColor;
        ctx.fillText(text, x0, y0);
      } else {
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }
    };

    const handleAddStickyNote = (note) => {
      setStickyNotes((prev) => [...prev, note]);
    };

    socket.on('draw', handleDraw);
    socket.on('addStickyNote', handleAddStickyNote);

    return () => {
      socket.off('draw', handleDraw);
      socket.off('addStickyNote', handleAddStickyNote);
    };
  }, [socket, tool, color, zoom, pan]);

  const startDrawing = (e) => {
    if (tool === 'pan') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        ctx.font = '16px Arial';
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        socket.emit('draw', { meetingId, x0: x, y0: y, text, color });
        addToHistory({ type: 'text', x, y, text, color });
      }
      setIsDrawing(false);
    }
  };

  const draw = (e) => {
    if (!isDrawing && !isPanning) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x1 = (e.clientX - rect.left - pan.x) / zoom;
    const y1 = (e.clientY - rect.top - pan.y) / zoom;

    if (isPanning) {
      const newPanX = e.clientX - startPan.x;
      const newPanY = e.clientY - startPan.y;
      setPan({ x: newPanX, y: newPanY });
      return;
    }

    if (tool === 'rectangle' || tool === 'circle') {
      const lastShape = shapes[shapes.length - 1] || { x0: x1, y0: y1 };
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      redrawCanvas();
      ctx.beginPath();
      ctx.strokeStyle = color;
      if (tool === 'rectangle') {
        ctx.strokeRect(lastShape.x0, lastShape.y0, x1 - lastShape.x0, y1 - lastShape.y0);
      } else {
        const radius = Math.sqrt(Math.pow(x1 - lastShape.x0, 2) + Math.pow(y1 - lastShape.y0, 2));
        ctx.arc(lastShape.x0, lastShape.y0, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      return;
    }

    const x0 = ctx.currentX || x1;
    const y0 = ctx.currentY || y1;
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.currentX = x1;
    ctx.currentY = y1;

    drawDebounce({
      meetingId,
      x0,
      y0,
      x1,
      y1,
      color,
      isErasing: tool === 'eraser',
    });
  };

  const stopDrawing = (e) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x1 = (e.clientX - rect.left - pan.x) / zoom;
    const y1 = (e.clientY - rect.top - pan.y) / zoom;

    if (tool === 'rectangle' || tool === 'circle') {
      const lastShape = shapes[shapes.length - 1] || { x0: x1, y0: y1 };
      const shapeData = {
        type: tool,
        x0: lastShape.x0,
        y0: lastShape.y0,
        x1,
        y1,
        color,
      };
      setShapes((prev) => [...prev, shapeData]);
      socket.emit('draw', { meetingId, shape: shapeData, color });
      addToHistory(shapeData);
    }
    delete ctx.currentX;
    delete ctx.currentY;
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom, canvas.height / zoom);
    shapes.forEach((shape) => {
      ctx.beginPath();
      ctx.strokeStyle = shape.color;
      if (shape.type === 'rectangle') {
        ctx.strokeRect(shape.x0, shape.y0, shape.x1 - shape.x0, shape.y1 - shape.y0);
      } else if (shape.type === 'circle') {
        const radius = Math.sqrt(Math.pow(shape.x1 - shape.x0, 2) + Math.pow(shape.y1 - shape.y0, 2));
        ctx.arc(shape.x0, shape.y0, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === 'text') {
        ctx.font = '16px Arial';
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.x0, shape.y0);
      }
    });
  }, [shapes, pan, zoom]);

  const addToHistory = (action) => {
    setHistory((prev) => [...prev, action]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastAction]);
    setShapes((prev) => prev.filter((shape) => shape !== lastAction));
    redrawCanvas();
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, action]);
    setShapes((prev) => [...prev, action]);
    redrawCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(-pan.x / zoom, -pan.y / zoom, canvas.width / zoom, canvas.height / zoom);
    setShapes([]);
    setHistory([]);
    setRedoStack([]);
  };

  const addStickyNote = () => {
    const newNote = {
      id: Date.now(),
      text: 'New Note',
      color: '#ffeb3b',
      position: { x: 50, y: 50 },
    };
    setStickyNotes((prev) => [...prev, newNote]);
    socket.emit('addStickyNote', newNote);
    toast.success('Sticky note added!');
  };

  const updateStickyNote = (id, text) => {
    setStickyNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, text } : note))
    );
  };

  const updateStickyNoteColor = (id, color) => {
    setStickyNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, color } : note))
    );
  };

  const deleteStickyNote = (id) => {
    setStickyNotes((prev) => prev.filter((note) => note.id !== id));
    toast.success('Sticky note deleted!');
  };

  const exportWhiteboard = () => {
    const canvas = canvasRef.current;
    html2canvas(canvas).then((canvasImage) => {
      const link = document.createElement('a');
      link.href = canvasImage.toDataURL('image/png');
      link.download = 'whiteboard.png';
      link.click();
      toast.success('Whiteboard exported as image!');
    });
  };

  const shareWhiteboard = () => {
    const shareLink = `http://localhost:5173/whiteboard/${meetingId}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 dark:text-white"
    >
      <h2 className="text-3xl font-bold">Whiteboard</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md relative">
        <div className="flex flex-wrap space-x-3 mb-4">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-md ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Draw with pen"
          >
            <FaPen />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-md ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Erase"
          >
            <FaEraser />
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded-md ${tool === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Draw rectangle"
          >
            <FaSquare />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-md ${tool === 'circle' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Draw circle"
          >
            <FaCircle />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded-md ${tool === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Add text"
          >
            <FaTextHeight />
          </button>
          <button
            onClick={() => setTool('pan')}
            className={`p-2 rounded-md ${tool === 'pan' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white'} hover:bg-blue-700 hover:text-white`}
            data-tooltip-id="tooltip" data-tooltip-content="Pan canvas"
          >
            <FaHandPaper />
          </button>
          <div className="flex items-center">
            <FaPaintBrush className="mr-2" />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8"
              data-tooltip-id="tooltip" data-tooltip-content="Pick a color"
            />
          </div>
          <button
            onClick={undo}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Undo"
          >
            <FaUndo />
          </button>
          <button
            onClick={redo}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Redo"
          >
            <FaRedo />
          </button>
          <button
            onClick={addStickyNote}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Add sticky note"
          >
            <FaStickyNote />
          </button>
          <button
            onClick={zoomIn}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Zoom in"
          >
            <FaSearchPlus />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Zoom out"
          >
            <FaSearchMinus />
          </button>
          <button
            onClick={shareWhiteboard}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Share whiteboard"
          >
            <FaShareAlt />
          </button>
          <button
            onClick={exportWhiteboard}
            className="p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-blue-700 hover:text-white"
            data-tooltip-id="tooltip" data-tooltip-content="Export as image"
          >
            <FaDownload />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            data-tooltip-id="tooltip" data-tooltip-content="Clear canvas"
          >
            <FaTrash />
          </button>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="border border-gray-300 dark:border-gray-700 rounded-md"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          />
          {stickyNotes.map((note) => (
            <Draggable
              key={note.id}
              defaultPosition={note.position}
              onStop={(e, data) => {
                setStickyNotes((prev) =>
                  prev.map((n) =>
                    n.id === note.id ? { ...n, position: { x: data.x, y: data.y } } : n
                  )
                );
              }}
            >
              <div
                className="absolute w-40 h-40 p-2 shadow-md rounded-md"
                style={{ backgroundColor: note.color }}
              >
                <textarea
                  value={note.text}
                  onChange={(e) => updateStickyNote(note.id, e.target.value)}
                  className="w-full h-24 p-1 bg-transparent border-none resize-none focus:outline-none"
                />
                <div className="flex justify-between items-center">
                  <input
                    type="color"
                    value={note.color}
                    onChange={(e) => updateStickyNoteColor(note.id, e.target.value)}
                    className="w-6 h-6"
                  />
                  <button
                    onClick={() => deleteStickyNote(note.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </Draggable>
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Collaborate in real-time with your team on this whiteboard. Use the tools above to draw, add shapes, text, sticky notes, and more!
        </p>
      </div>
      <Tooltip id="tooltip" place="top" effect="solid" />
    </motion.div>
  );
};

export default Whiteboard;
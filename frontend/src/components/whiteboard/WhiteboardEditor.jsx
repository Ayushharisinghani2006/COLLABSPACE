import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Modal from 'react-modal';
import StickyNote from './StickyNote';
import Shape from './Shape';
import Button from '../common/Button';

// Initialize WebSocket connection
const socket = io('https://api.collabspace.com', { path: '/socket.io' });


Modal.setAppElement('#root');

const WhiteboardEditor = () => {
  const [elements, setElements] = useState([
    { id: '1', type: 'sticky', text: 'Q2 Goals\n- Increase conversion by 15%\n- Launch new product', position: { x: 100, y: 100 }, color: 'bg-yellow-200' },
    { id: '2', type: 'sticky', text: 'Team Assignment\n- Marketing: Sarah, John\n- Product: Mike, Lisa\n- Engineering: Alex, David', position: { x: 300, y: 150 }, color: 'bg-blue-100' },
    { id: '3', type: 'circle', position: { x: 500, y: 300 }, color: 'bg-pink-400', size: 100 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newElement, setNewElement] = useState({ type: 'sticky', text: '', color: 'bg-yellow-200', size: 100 });

  useEffect(() => {
    // Listen for updates from the server
    socket.on('elementUpdate', (updatedElement) => {
      setElements((prevElements) =>
        prevElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
      );
    });

    return () => {
      socket.off('elementUpdate');
    };
  }, []);

  const handleElementUpdate = (id, updatedData) => {
    setElements((prevElements) => {
      const updatedElements = prevElements.map((el) =>
        el.id === id ? { ...el, ...updatedData } : el
      );
      const updatedElement = updatedElements.find((el) => el.id === id);
      socket.emit('elementUpdate', updatedElement); // Broadcast update to other users
      return updatedElements;
    });
  };

  const addElement = () => {
    const id = Date.now().toString();
    const newEl = {
      id,
      type: newElement.type,
      position: { x: 200, y: 200 },
      color: newElement.color,
      ...(newElement.type === 'sticky' ? { text: newElement.text } : { size: newElement.size }),
    };
    setElements([...elements, newEl]);
    setIsModalOpen(false);
    setNewElement({ type: 'sticky', text: '', color: 'bg-yellow-200', size: 100 });
  };

  return (
    <div className="relative flex-1 bg-gray-100 dark:bg-gray-900 grid-bg">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <Button
          label="Add Sticky Note"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white animate-pulse"
        />
        <Button
          label="Add Shape"
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white animate-pulse"
        />
      </div>

      {/* Whiteboard Elements */}
      {elements.map((el) => (
        el.type === 'sticky' ? (
          <StickyNote
            key={el.id}
            id={el.id}
            text={el.text}
            position={el.position}
            color={el.color}
            onUpdate={handleElementUpdate}
          />
        ) : (
          <Shape
            key={el.id}
            id={el.id}
            type={el.type}
            position={el.position}
            color={el.color}
            size={el.size}
            onUpdate={handleElementUpdate}
          />
        )
      ))}

      {/* Modal for Adding Elements */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Add New Element</h2>
        <select
          value={newElement.type}
          onChange={(e) => setNewElement({ ...newElement, type: e.target.value })}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="sticky">Sticky Note</option>
          <option value="circle">Circle</option>
        </select>
        {newElement.type === 'sticky' ? (
          <textarea
            placeholder="Enter text"
            value={newElement.text}
            onChange={(e) => setNewElement({ ...newElement, text: e.target.value })}
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <input
            type="number"
            placeholder="Size"
            value={newElement.size}
            onChange={(e) => setNewElement({ ...newElement, size: Number(e.target.value) })}
            className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
        )}
        <select
          value={newElement.color}
          onChange={(e) => setNewElement({ ...newElement, color: e.target.value })}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="bg-yellow-200">Yellow</option>
          <option value="bg-blue-100">Blue</option>
          <option value="bg-pink-400">Pink</option>
        </select>
        <div className="flex space-x-4">
          <Button label="Add" onClick={addElement} className="bg-blue-600 text-white" />
          <Button label="Cancel" onClick={() => setIsModalOpen(false)} className="bg-gray-600 text-white" />
        </div>
      </Modal>
    </div>
  );
};

export default WhiteboardEditor;
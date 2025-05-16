import { useState } from 'react';

const useDrag = (defaultPosition = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState(defaultPosition);

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return { position, handleDrag, handleStop };
};

export default useDrag;
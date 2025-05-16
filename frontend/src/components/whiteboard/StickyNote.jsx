import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useDrag from '../../hooks/useDrag';
import 'react-resizable/css/styles.css';

const StickyNote = React.memo(({ id, text, position, color, onUpdate }) => {
  const { position: dragPosition, handleDrag, handleStop } = useDrag(position);
  const [size, setSize] = React.useState({ width: 200, height: 150 });
  const nodeRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') onUpdate(id, { position: { x: dragPosition.x, y: dragPosition.y - 10 } });
    if (e.key === 'ArrowDown') onUpdate(id, { position: { x: dragPosition.x, y: dragPosition.y + 10 } });
    if (e.key === 'ArrowLeft') onUpdate(id, { position: { x: dragPosition.x - 10, y: dragPosition.y } });
    if (e.key === 'ArrowRight') onUpdate(id, { position: { x: dragPosition.x + 10, y: dragPosition.y } });
  };

  return (
    <Draggable nodeRef={nodeRef} position={dragPosition} onDrag={handleDrag} onStop={handleStop}>
      <div ref={nodeRef}>
        <Resizable
          width={size.width}
          height={size.height}
          onResize={(e, { size }) => {
            setSize({ width: size.width, height: size.height });
          }}
        >
          <div
            className={`p-4 ${color} shadow-md cursor-move animate-fade-in`}
            style={{ width: size.width, height: size.height }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Draggable sticky note"
          >
            <pre className="text-gray-900 dark:text-gray-800 whitespace-pre-wrap">{text}</pre>
          </div>
        </Resizable>
      </div>
    </Draggable>
  );
});

export default StickyNote;
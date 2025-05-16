import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useDrag from '../../hooks/useDrag';
import 'react-resizable/css/styles.css';

const Shape = React.memo(({ id, type, position, color, size: initialSize, onUpdate }) => {
  const { position: dragPosition, handleDrag, handleStop } = useDrag(position);
  const [size, setSize] = React.useState({ width: initialSize, height: initialSize });
  const nodeRef = useRef(null);

  const shapeStyle =
    type === 'circle'
      ? { width: size.width, height: size.height, borderRadius: '50%' }
      : { width: size.width, height: size.height };

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
            onUpdate(id, { size: size.width });
          }}
        >
          <div
            className={`${color} cursor-move animate-fade-in`}
            style={shapeStyle}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="region"
            aria-label="Draggable shape"
          />
        </Resizable>
      </div>
    </Draggable>
  );
});

export default Shape;
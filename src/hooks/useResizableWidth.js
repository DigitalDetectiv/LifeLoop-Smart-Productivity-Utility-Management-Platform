import { useCallback, useRef, useState } from 'react';

// Lets a panel's width be dragged from a handle on its edge, clamped
// between min/max. Returns the current width plus a mousedown handler
// to attach to the drag handle.
export default function useResizableWidth(initialWidth, { min = 180, max = 420 } = {}) {
  const [width, setWidth] = useState(initialWidth);
  const dragState = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (!dragState.current) return;
    const delta = e.clientX - dragState.current.startX;
    const next = Math.min(max, Math.max(min, dragState.current.startWidth + delta));
    setWidth(next);
  }, [min, max]);

  const onMouseUp = useCallback(() => {
    dragState.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [onMouseMove]);

  const startDrag = useCallback((e) => {
    dragState.current = { startX: e.clientX, startWidth: width };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width, onMouseMove, onMouseUp]);

  return { width, startDrag, setWidth };
}

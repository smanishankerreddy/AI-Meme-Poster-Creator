// FIX: Import `React` and `useEffect` to resolve errors about missing namespaces and functions.
import React, { useState, useCallback, RefObject, useEffect } from 'react';

interface DragState {
  isDragging: boolean;
  id: string | null;
  offset: { x: number; y: number };
}

export const useDraggable = <T extends HTMLElement,>(
  onDrag: (id: string, position: { x: number; y: number }) => void,
  containerRef: RefObject<T>
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    id: null,
    offset: { x: 0, y: 0 },
  });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    setDragState({
      isDragging: true,
      id,
      offset: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    });
  }, [containerRef]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.id || !containerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - containerRect.left - dragState.offset.x) / containerRect.width;
    const y = (e.clientY - containerRect.top - dragState.offset.y) / containerRect.height;

    // Clamp values between 0 and 1
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    onDrag(dragState.id, { x: clampedX, y: clampedY });
  }, [dragState, onDrag, containerRef]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({ isDragging: false, id: null, offset: { x: 0, y: 0 } });
  }, []);

  // Attach and detach listeners globally
  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const dragHandlers = (id: string) => ({
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, id),
  });

  return { dragHandlers };
};

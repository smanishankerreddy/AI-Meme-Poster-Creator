
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { ContentType, MemeText } from '../types';
import { useDraggable } from '../hooks/useDraggable';

interface CanvasProps {
  image: string | null;
  texts: MemeText[];
  setTexts: React.Dispatch<React.SetStateAction<MemeText[]>>;
  contentType: ContentType;
}

const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({ image, texts, setTexts, contentType }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleTextChange = (id: string, newText: string) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
  };
  
  const onDrag = (id: string, position: { x: number, y: number }) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, position } : t));
  };

  const { dragHandlers } = useDraggable(onDrag, containerRef);

  const getTextStyle = (textItem: MemeText): React.CSSProperties => {
    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${textItem.position.x * 100}%`,
      top: `${textItem.position.y * 100}%`,
      transform: 'translate(-50%, -50%)',
      cursor: contentType === ContentType.Poster ? 'move' : 'text',
      textAlign: 'center',
      minWidth: '50px'
    };
    
    if (contentType === ContentType.Meme) {
      return {
        ...commonStyle,
        width: '90%',
        fontSize: 'clamp(1rem, 8vw, 2.5rem)',
        transform: textItem.id === 'top' 
            ? 'translateX(-50%)' 
            : 'translateX(-50%) translateY(-100%)',
        top: textItem.id === 'top' ? '5%' : '95%',
        left: '50%',
      };
    }

    return commonStyle;
  };
  
  return (
    <div ref={ref} className="w-full aspect-[4/3] bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
      <div ref={containerRef} className="relative w-full h-full">
        {image ? (
          <img src={image} alt="meme or poster background" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <p className="text-gray-400">Upload or generate an image</p>
          </div>
        )}
        {texts.map((textItem) => (
          <div
            key={textItem.id}
            style={getTextStyle(textItem)}
            {...(contentType === ContentType.Poster ? dragHandlers(textItem.id) : {})}
          >
            <div
              contentEditable
              onBlur={(e) => handleTextChange(textItem.id, e.currentTarget.textContent || '')}
              suppressContentEditableWarning={true}
              className={contentType === ContentType.Meme
                ? 'meme-text uppercase text-white tracking-wide p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded'
                : 'text-2xl md:text-4xl font-bold text-white p-2 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded'
              }
              style={{ textShadow: contentType === ContentType.Poster ? '2px 2px 4px rgba(0,0,0,0.7)' : undefined }}
            >
              {textItem.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Canvas;

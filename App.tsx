
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { generateCaptions, generateImage } from './services/geminiService';
import { ContentType, MemeText } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import Canvas from './components/Canvas';
import { toPng } from 'html-to-image';

const App: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>(ContentType.Meme);
  const [topic, setTopic] = useState<string>('Finals week');
  const [image, setImage] = useState<string | null>(`https://picsum.photos/seed/${Date.now()}/800/600`);
  const [texts, setTexts] = useState<MemeText[]>([
    { id: 'top', text: 'TOP TEXT', position: { x: 0.5, y: 0.05 }, isDragging: false, isResizable: false },
    { id: 'bottom', text: 'BOTTOM TEXT', position: { x: 0.5, y: 0.95 }, isDragging: false, isResizable: false }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleGenerateCaptions = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const captions = await generateCaptions(topic, contentType);
      if (contentType === ContentType.Meme && captions.length >= 2) {
        setTexts([
          { ...texts[0], text: captions[0] || 'TOP TEXT' },
          { ...texts[1], text: captions[1] || 'BOTTOM TEXT' }
        ]);
      } else {
        setTexts([{ id: 'poster-text', text: captions[0] || 'POSTER TEXT', position: { x: 0.5, y: 0.5 }, isDragging: false, isResizable: true }]);
      }
    } catch (err) {
      setError('Failed to generate captions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!topic) {
        setError('Please enter a topic to generate an image.');
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const imageUrl = await generateImage(topic);
        setImage(imageUrl);
    } catch (err) {
        setError('Failed to generate image. Please try again.');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleContentTypeChange = (type: ContentType) => {
    setContentType(type);
    if (type === ContentType.Meme) {
      setTexts([
        { id: 'top', text: 'TOP TEXT', position: { x: 0.5, y: 0.05 }, isDragging: false, isResizable: false },
        { id: 'bottom', text: 'BOTTOM TEXT', position: { x: 0.5, y: 0.95 }, isDragging: false, isResizable: false }
      ]);
    } else {
      setTexts([{ id: 'poster-text', text: 'YOUR HEADLINE', position: { x: 0.5, y: 0.5 }, isDragging: false, isResizable: true }]);
    }
  };

  const handleDownload = useCallback(() => {
    if (canvasRef.current === null) {
      return;
    }
    toPng(canvasRef.current, { cacheBust: true, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${contentType}-${topic.replace(/\s+/g, '-')}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to download image.');
      });
  }, [canvasRef, contentType, topic]);

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Header />
      <main className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 mt-6">
        <Controls
          contentType={contentType}
          setContentType={handleContentTypeChange}
          topic={topic}
          setTopic={setTopic}
          isLoading={isLoading}
          onGenerateCaptions={handleGenerateCaptions}
          onGenerateImage={handleGenerateImage}
          onImageUpload={setImage}
          onDownload={handleDownload}
        />
        <div className="flex-grow flex items-center justify-center lg:w-2/3">
          <Canvas 
            image={image} 
            texts={texts} 
            setTexts={setTexts} 
            contentType={contentType} 
            ref={canvasRef} 
          />
        </div>
      </main>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse" onClick={() => setError(null)}>
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;

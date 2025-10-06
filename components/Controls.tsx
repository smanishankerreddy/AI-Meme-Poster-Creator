
import React, { useRef } from 'react';
import { ContentType } from '../types';
import { DownloadIcon, ImageIcon, SparklesIcon, UploadIcon, WandIcon } from './icons';
import Spinner from './Spinner';

interface ControlsProps {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  topic: string;
  setTopic: (topic: string) => void;
  isLoading: boolean;
  onGenerateCaptions: () => void;
  onGenerateImage: () => void;
  onImageUpload: (dataUrl: string | null) => void;
  onDownload: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  contentType,
  setContentType,
  topic,
  setTopic,
  isLoading,
  onGenerateCaptions,
  onGenerateImage,
  onImageUpload,
  onDownload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomImage = () => {
    onImageUpload(`https://picsum.photos/seed/${Date.now()}/800/600`);
  };

  return (
    <aside className="lg:w-1/3 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 flex flex-col gap-6 h-fit">
      {/* Content Type Switcher */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">1. Choose Content Type</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setContentType(ContentType.Meme)}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${contentType === ContentType.Meme ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Meme
          </button>
          <button
            onClick={() => setContentType(ContentType.Poster)}
            className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${contentType === ContentType.Poster ? 'bg-pink-600 text-white shadow-lg' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            Poster
          </button>
        </div>
      </div>

      {/* Image Source */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">2. Select Your Image</h2>
        <div className="space-y-3">
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            <UploadIcon /> Upload Image
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <button onClick={handleRandomImage} className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            <ImageIcon /> Random Image
          </button>
          {contentType === ContentType.Poster && (
            <button onClick={onGenerateImage} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              {isLoading ? <Spinner /> : <SparklesIcon />} AI Generate Image
            </button>
          )}
        </div>
      </div>

      {/* AI Content Generation */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">3. Generate AI Content</h2>
        <div className="flex flex-col gap-3">
          <label htmlFor="topic-input" className="sr-only">Topic</label>
          <input
            id="topic-input"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`e.g., "college life"`}
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
          <button onClick={onGenerateCaptions} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg">
            {isLoading ? <Spinner /> : <WandIcon />} Generate {contentType === 'meme' ? 'Captions' : 'Headline'}
          </button>
        </div>
      </div>
      
      {/* Download */}
      <div>
        <h2 className="text-lg font-semibold text-gray-200 mb-3">4. Finish & Download</h2>
        <button onClick={onDownload} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
            <DownloadIcon /> Download
        </button>
      </div>
    </aside>
  );
};

export default Controls;

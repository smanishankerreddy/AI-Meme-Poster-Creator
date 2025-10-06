
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI Meme & Poster Creator
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Unleash your creativity. Generate hilarious memes and stunning posters in seconds with the power of AI.
      </p>
    </header>
  );
};

export default Header;

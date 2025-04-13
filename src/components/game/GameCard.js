"use client";

import { useState } from 'react';

export default function GameCard({ game }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative pb-[56.25%]">
        {/* 占位符 */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500">图片加载中</span>
          </div>
        )}
        
        {/* 图片错误占位符 */}
        {imageError && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500">{game.title}</span>
          </div>
        )}
        
        {/* 实际图片（隐藏直到加载完成） */}
        <img
          src={game.thumbnailUrl || '/images/game-placeholder.svg'}
          alt={game.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {game.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {game.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {game.tags.map((tag) => (
            <span 
              key={tag} 
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <a 
          href={`/games/${game.slug}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition duration-150"
        >
          开始游戏
        </a>
      </div>
    </div>
  );
} 
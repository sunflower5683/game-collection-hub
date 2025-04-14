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
        
        {/* 使用标准img标签替代Next.js Image组件 */}
        <img
          src={game.thumbnailUrl || '/images/game-placeholder.svg'}
          alt={game.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded && !imageError ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{game.title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 flex-grow line-clamp-2">
          {game.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs">
            {game.category}
          </span>
          {game.tags.slice(0, 2).map(tag => (
            <span key={tag} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs">
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
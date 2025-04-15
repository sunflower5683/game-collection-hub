"use client";
import { useState, useEffect } from 'react';

export default function GameEmbed({ game }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full">
      <div className="relative aspect-video w-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>游戏加载中，请稍候...</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center p-4">
              <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium">无法加载游戏</h3>
              <p className="mt-2">抱歉，游戏加载失败。请刷新页面或稍后再试。</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                刷新页面
              </button>
            </div>
          </div>
        ) : (
          <iframe
            src={game.embedUrl}
            title={game.title}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
            referrerPolicy="no-referrer-when-downgrade"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      <div className="p-4 bg-gray-700 text-white">
        <h1 className="text-xl font-bold">{game.title}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {game.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-600 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 
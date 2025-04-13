"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GameForm from '@/components/admin/GameForm';
import { games } from '@/data/games';

interface Game {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  tags: string[];
  featured: boolean;
  isActive?: boolean;
}

export default function EditGame({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState<Game | null>(null);
  const [notFound, setNotFound] = useState(false);

  const gameId = params.id;

  useEffect(() => {
    // 检查本地存储中是否有管理员凭证
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
      return;
    }
    
    setIsAuthenticated(true);
    
    // 尝试从localStorage获取自定义游戏
    try {
      const adminGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      const customGame = adminGames.find((g: Game) => g.id === gameId);
      
      if (customGame) {
        setGame(customGame);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error loading custom games:', error);
    }
    
    // 如果没有找到自定义游戏，从预设游戏中查找
    const defaultGame = games.find(g => g.id === gameId);
    if (defaultGame) {
      // 从localStorage获取游戏的激活状态
      try {
        const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
        const isActive = activeStates[gameId] === undefined ? true : activeStates[gameId];
        
        setGame({ ...defaultGame, isActive });
      } catch (error) {
        console.error('Error loading game active states:', error);
        setGame(defaultGame);
      }
    } else {
      setNotFound(true);
    }
    
    setIsLoading(false);
  }, [gameId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 让useEffect的路由重定向生效
  }
  
  if (notFound || !game) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">游戏未找到</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            无法找到ID为 {gameId} 的游戏
          </p>
          <Link 
            href="/admin/games"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            返回游戏列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">编辑游戏: {game.title}</h1>
        
        <Link 
          href="/admin/games"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          &larr; 返回游戏列表
        </Link>
      </div>
      
      <GameForm game={game} isEditing={true} />
    </div>
  );
} 
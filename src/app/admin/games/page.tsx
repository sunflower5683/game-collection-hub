"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function GamesManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [gamesList, setGamesList] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    // 检查本地存储中是否有管理员凭证
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      
      loadGames();
    }
    setIsLoading(false);
  }, [router]);
  
  // 将游戏加载逻辑提取为独立函数
  const loadGames = () => {
    // 从localStorage获取游戏的激活状态
    const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
    const adminGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
    console.log('管理员添加的游戏:', adminGames);
    
    // 合并games数据和激活状态
    const gamesWithState = games.map(game => ({
      ...game,
      isActive: activeStates[game.id] === undefined ? true : activeStates[game.id]
    }));
    
    // 合并自定义游戏
    const allGames = [...gamesWithState];
    adminGames.forEach((customGame: Game) => {
      // 为自定义游戏添加默认激活状态
      const gameWithActive = {
        ...customGame,
        isActive: activeStates[customGame.id] === undefined ? true : activeStates[customGame.id]
      };
      allGames.push(gameWithActive);
    });
    
    setGamesList(allGames);
  };

  // 修复自定义游戏格式问题
  const fixGameFormats = () => {
    // 从localStorage获取自定义游戏
    const adminGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
    const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
    
    // 修复格式
    const fixedGames = adminGames.map((game: Game) => {
      // 生成正确格式的slug
      const normalizedSlug = game.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // 返回修复后的游戏
      return {
        ...game,
        id: normalizedSlug,   // 使用正确格式的ID
        slug: normalizedSlug, // 使用正确格式的slug
        isActive: true        // 确保激活状态为true
      };
    });
    
    // 保存修复后的游戏
    localStorage.setItem('adminGames', JSON.stringify(fixedGames));
    
    // 更新激活状态
    const newActiveStates = { ...activeStates };
    fixedGames.forEach((game: Game) => {
      newActiveStates[game.id] = true; // 将所有游戏设为激活
    });
    localStorage.setItem('gameActiveStates', JSON.stringify(newActiveStates));
    
    // 重新加载游戏
    loadGames();
    
    alert('游戏格式已修复，所有游戏均已设置为激活状态。');
  };

  const toggleGameStatus = (gameId: string) => {
    // 更新游戏列表状态
    const updatedGames = gamesList.map(game => {
      if (game.id === gameId) {
        return { ...game, isActive: !game.isActive };
      }
      return game;
    });
    
    setGamesList(updatedGames);
    
    // 保存到localStorage
    const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
    const updatedGame = updatedGames.find(g => g.id === gameId);
    
    if (updatedGame) {
      activeStates[gameId] = updatedGame.isActive;
      localStorage.setItem('gameActiveStates', JSON.stringify(activeStates));
    }
  };

  // 过滤游戏列表
  const filteredGames = gamesList.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         game.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = showInactive ? true : game.isActive;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">游戏管理</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={loadGames}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            刷新数据
          </button>
          <Link 
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            &larr; 返回控制台
          </Link>
          <Link 
            href="/admin/games/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            添加新游戏
          </Link>
        </div>
      </div>
      
      {/* 调试信息 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              添加的游戏在首页不显示？尝试以下操作：
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem('gameActiveStates');
                  loadGames();
                  alert('已重置所有游戏激活状态');
                }}
                className="inline-block px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
              >
                重置所有激活状态
              </button>
              
              <button
                onClick={fixGameFormats}
                className="inline-block px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
              >
                修复游戏格式问题
              </button>
              
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="inline-block px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
              >
                强制刷新首页
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 工具栏 */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="搜索游戏..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">显示已下架游戏</span>
          </label>
        </div>
      </div>
      
      {/* 游戏列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                游戏
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                分类
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGames.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  没有找到符合条件的游戏
                </td>
              </tr>
            ) : (
              filteredGames.map((game) => (
                <tr key={game.id} className={!game.isActive ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded">
                        {game.thumbnailUrl ? (
                          <img 
                            src={game.thumbnailUrl} 
                            alt={game.title} 
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded flex items-center justify-center text-gray-500">
                            {game.title.substring(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {game.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {game.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {game.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      game.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {game.isActive ? '已上架' : '已下架'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link 
                      href={`/admin/games/edit/${game.id}`}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => toggleGameStatus(game.id)}
                      className={game.isActive 
                        ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' 
                        : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}
                    >
                      {game.isActive ? '下架' : '上架'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        总计 {gamesList.length} 个游戏，当前显示 {filteredGames.length} 个
      </p>
    </div>
  );
} 
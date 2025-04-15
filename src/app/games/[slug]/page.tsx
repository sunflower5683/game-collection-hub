"use client";

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { games } from "@/data/games";
import GameEmbed from "@/components/game/GameEmbed";
import Script from 'next/script';
import { generateGameSchema } from '@/app/api/schema';
import Link from 'next/link';

// 客户端组件不能直接导出元数据
// 元数据在layout.tsx中已定义

interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  isActive?: boolean;
}

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const [gameData, setGameData] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlug, setCurrentSlug] = useState<string>("");
  
  // 在useEffect中安全地访问参数
  useEffect(() => {
    if (params?.slug) {
      // 确保slug是字符串
      const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      setCurrentSlug(slugParam);
    }
  }, [params]);
  
  useEffect(() => {
    // 如果slug未设置，则不执行
    if (!currentSlug) return;
    
    // 从localStorage获取游戏的激活状态和自定义游戏
    try {
      const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
      const customGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      
      console.log(`加载游戏详情: slug=${currentSlug}`);
      
      // 合并默认游戏和自定义游戏
      const allGames = [...games];
      
      // 直接添加自定义游戏，不检查ID重复
      customGames.forEach((customGame: Game) => {
        allGames.push(customGame);
      });
      
      // 查找当前游戏
      const foundGame = allGames.find(g => g.slug === currentSlug);
      
      if (!foundGame) {
        // 游戏不存在，重定向到404
        console.error(`未找到游戏: slug=${currentSlug}`);
        notFound();
        return;
      }
      
      // 检查游戏是否处于激活状态
      const isActive = activeStates[foundGame.id] === undefined ? true : activeStates[foundGame.id];
      
      if (!isActive) {
        // 游戏已下架，重定向到首页
        router.push('/');
        return;
      }
      
      // 设置游戏数据
      setGameData({
        ...foundGame,
        isActive
      });
      console.log(`找到游戏:`, foundGame);
      
      // 查找相关游戏（并过滤只显示已激活的）
      const gamesWithState = allGames.map(game => ({
        ...game,
        isActive: activeStates[game.id] === undefined ? true : activeStates[game.id]
      })).filter(game => game.isActive);
      
      // 同类游戏
      const sameCategory = gamesWithState.filter(
        g => g.category === foundGame.category && g.id !== foundGame.id
      ).slice(0, 3);
      
      // 同标签游戏
      const sameTags = gamesWithState.filter(
        g => g.id !== foundGame.id && g.tags.some(tag => foundGame.tags.includes(tag))
      ).slice(0, 3);
      
      // 合并相关游戏并去重
      const related = [...sameCategory];
      sameTags.forEach(g => {
        if (!related.some(rg => rg.id === g.id)) {
          related.push(g);
        }
      });
      
      // 限制最多显示6个相关游戏
      setRelatedGames(related.slice(0, 6));
      
    } catch (error) {
      console.error('Error loading game data:', error);
      notFound();
    } finally {
      setIsLoading(false);
    }
  }, [currentSlug, router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!gameData) {
    return null; // 重定向会处理
  }
  
  // 生成结构化数据
  const structuredData = generateGameSchema(gameData);
  
  return (
    <div>
      {/* 结构化数据 */}
      <Script
        id="game-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* 游戏路径导航 */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">首页</Link> &gt; 
        <Link href="/games" className="mx-2 hover:text-blue-600 dark:hover:text-blue-400">游戏库</Link> &gt; 
        <Link href={`/games?category=${gameData.category}`} className="mx-2 hover:text-blue-600 dark:hover:text-blue-400">{gameData.category}游戏</Link> &gt; 
        <span className="mx-2 text-gray-700 dark:text-gray-300">{gameData.title}</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 游戏标题 */}
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            {gameData.title}
          </h1>
          
          {/* 游戏嵌入 */}
          <div className="mb-8">
            <GameEmbed game={gameData} />
          </div>
          
          {/* 游戏介绍 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">游戏介绍</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-700 dark:text-gray-300">{gameData.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">分类</h3>
                <Link 
                  href={`/games?category=${gameData.category}`}
                  className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {gameData.category}
                </Link>
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {gameData.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/games?tag=${tag}`}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">操作指南</h3>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded text-gray-700 dark:text-gray-300">
                  <p>控制方式根据游戏而异，大多数游戏使用键盘或鼠标操作。请在游戏加载后查看游戏内说明。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          {/* 侧边信息 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">游戏信息</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">分类</p>
                <p className="font-medium text-gray-800 dark:text-white">{gameData.category}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">标签</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {gameData.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">适合人群</p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {gameData.tags.includes("儿童") ? "儿童友好" : "所有年龄段"}
                </p>
              </div>
            </div>
          </div>
          
          {/* 相似游戏推荐 */}
          {relatedGames.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">相似游戏</h2>
              <div className="grid grid-cols-1 gap-4">
                {relatedGames.map((relatedGame) => (
                  <Link
                    key={relatedGame.id}
                    href={`/games/${relatedGame.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center p-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded mr-4 flex-shrink-0 flex items-center justify-center relative">
                        {relatedGame.thumbnailUrl ? (
                          <img 
                            src={relatedGame.thumbnailUrl}
                            alt={relatedGame.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">{relatedGame.title.substring(0, 2)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {relatedGame.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {relatedGame.category} · {relatedGame.tags.slice(0, 2).join('、')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-12">
        <Link 
          href="/games" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-150"
        >
          返回游戏库
        </Link>
      </div>
    </div>
  );
} 
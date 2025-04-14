"use client";

import { games } from "@/data/games";
import GameList from "@/components/game/GameList";
import { generateGameCollectionSchema, generateOrganizationSchema } from "@/app/api/schema";
import Script from "next/script";
import { useEffect, useState } from "react";

// 客户端组件不能直接导出静态元数据
// 元数据已移到layout.tsx中

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

export default function Home() {
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 从localStorage获取游戏的激活状态
    try {
      const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
      const customGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      
      console.log("首页 - 自定义游戏数据:", customGames);
      if (customGames.length > 0) {
        console.log("首页 - 第一个自定义游戏:", JSON.stringify(customGames[0], null, 2));
      }
      
      // 合并默认游戏和自定义游戏
      const allGames = [...games];
      
      // 直接添加自定义游戏，不检查ID重复
      customGames.forEach((customGame: Game) => {
        console.log(`添加自定义游戏: ${customGame.title} (ID: ${customGame.id})`);
        allGames.push(customGame);
      });
      
      console.log(`合并后游戏总数: ${allGames.length}`);
      
      // 应用激活状态过滤
      const gamesWithState = allGames.map(game => ({
        ...game,
        isActive: activeStates[game.id] === undefined ? true : activeStates[game.id]
      }));
      
      // 先不过滤，显示所有游戏
      setActiveGames(gamesWithState);
      console.log(`设置激活游戏数: ${gamesWithState.length}`);
      
    } catch (error) {
      console.error('Error loading game states:', error);
      // 出错时回退到默认游戏列表
      setActiveGames(games);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // 获取精选游戏
  const featuredGames = activeGames.filter(game => game.featured);
  
  // 获取最新添加的游戏（假设按ID倒序为最新添加）
  const recentGames = [...activeGames].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 8);
  
  // 获取所有分类
  const categories = Array.from(new Set(activeGames.map(game => game.category)));
  
  // 用于结构化数据
  const featuredGameSchemas = featuredGames.length > 0 
    ? featuredGames.map(game => generateGameCollectionSchema([game])) 
    : [];
  
  // 组织模式
  const orgSchema = generateOrganizationSchema();
  
  return (
    <main>
      {/* 结构化数据 */}
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      
      {featuredGameSchemas.map((schema, index) => (
        <Script
          key={`structured-data-featured-${index}`}
          id={`structured-data-featured-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* 顶部横幅 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">欢迎来到游戏集合站</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            发现并畅玩各种精彩在线游戏，无需下载，随时随地开始您的游戏之旅！
          </p>
          <a 
            href="/games" 
            className="inline-block bg-white text-blue-600 font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300"
          >
            浏览全部游戏
          </a>
        </div>
      </section>
      
      {/* 精选游戏 */}
      {featuredGames.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <GameList 
              games={featuredGames} 
              title="精选游戏" 
            />
          </div>
        </section>
      )}
      
      {/* 最新游戏 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <GameList 
            games={recentGames} 
            title="最近添加" 
          />
        </div>
      </section>
      
      {/* 游戏分类 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">
            游戏分类
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <a 
                key={category}
                href={`/games?category=${category}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                  {category}游戏
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  探索我们精选的{category}游戏集合，找到适合你的休闲娱乐选择。
                </p>
                <span className="text-blue-600 dark:text-blue-400 flex items-center">
                  查看更多
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* 管理员入口 */}
      <div className="text-center py-8">
        <a
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          管理员入口
        </a>
      </div>
    </main>
  );
} 
import { games } from "@/data/games";
import GameList from "@/components/game/GameList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "游戏库 - 游戏集合站",
  description: "浏览我们丰富的游戏库，各种类型的在线游戏等您来挑战。益智、街机、棋牌，总有一款适合您！",
  keywords: "游戏库, 游戏列表, 在线游戏, 免费游戏",
};

export default function GamesPage() {
  // 获取所有游戏分类
  const categories = [...new Set(games.map(game => game.category))];
  
  // 按分类组织游戏
  const gamesByCategory = categories.reduce((acc, category) => {
    acc[category] = games.filter(game => game.category === category);
    return acc;
  }, {} as Record<string, typeof games>);
  
  return (
    <div>
      <section className="text-center py-8 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">游戏库</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          浏览我们精心收集的各类游戏，随时畅玩！
        </p>
      </section>
      
      {/* 游戏分类计数 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center">
          <span className="block text-2xl font-bold text-blue-800 dark:text-blue-100">
            {games.length}
          </span>
          <span className="text-blue-600 dark:text-blue-200">总游戏数</span>
        </div>
        
        {categories.map(category => (
          <div key={category} className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-purple-800 dark:text-purple-100">
              {gamesByCategory[category].length}
            </span>
            <span className="text-purple-600 dark:text-purple-200">{category}游戏</span>
          </div>
        ))}
      </div>
      
      {/* 按分类展示游戏 */}
      {categories.map(category => (
        <div key={category} id={category} className="mb-12">
          <GameList 
            games={gamesByCategory[category]} 
            title={`${category}游戏`} 
          />
        </div>
      ))}
    </div>
  );
} 
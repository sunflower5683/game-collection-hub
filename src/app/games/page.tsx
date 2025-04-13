import { games } from "@/data/games";
import { filterGames, paginateGames, getAllTags, getPopularTags } from "@/lib/utils";
import GameList from "@/components/game/GameList";
import CategoryFilter from "@/components/ui/CategoryFilter";
import TagFilter from "@/components/ui/TagFilter";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "游戏库 - 游戏集合站",
  description: "浏览我们丰富的游戏库，各种类型的在线游戏等您来挑战。益智、街机、棋牌，总有一款适合您！",
  keywords: "游戏库, 游戏列表, 在线游戏, 免费游戏",
};

export default function GamesPage({ searchParams }: { searchParams: { category?: string; tag?: string; page?: string } }) {
  const category = searchParams.category || '';
  const tag = searchParams.tag || '';
  const currentPage = parseInt(searchParams.page || '1', 10);
  
  // 获取所有游戏分类
  const categories = [...new Set(games.map(game => game.category))];
  
  // 获取热门游戏标签
  const popularTags = getPopularTags(games, 15);
  
  // 根据分类和标签过滤游戏
  const filteredGames = filterGames(games, '', category, tag);
  
  // 分页处理
  const itemsPerPage = 12;
  const paginatedGames = paginateGames(filteredGames, currentPage, itemsPerPage);
  
  // 按分类组织游戏
  const gamesByCategory = categories.reduce((acc, cat) => {
    acc[cat] = games.filter(game => game.category === cat);
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
        
        {categories.map(cat => (
          <div key={cat} className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg text-center">
            <span className="block text-2xl font-bold text-purple-800 dark:text-purple-100">
              {gamesByCategory[cat].length}
            </span>
            <span className="text-purple-600 dark:text-purple-200">{cat}游戏</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <CategoryFilter categories={categories} selectedCategory={category} />
          <TagFilter tags={popularTags} selectedTag={tag} />
          
          {/* 当前筛选条件 */}
          {(category || tag) && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">当前筛选</h3>
              <div className="flex flex-wrap gap-2">
                {category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    分类: {category}
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('category');
                        window.location.href = `${window.location.pathname}?${params.toString()}`;
                      }}
                      className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                )}
                
                {tag && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    标签: {tag}
                    <button 
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.delete('tag');
                        window.location.href = `${window.location.pathname}?${params.toString()}`;
                      }}
                      className="ml-1 text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-100"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-3">
          {(category || tag) ? (
            <>
              <GameList 
                games={paginatedGames} 
                title={category ? `${category}游戏` : (tag ? `标签: ${tag}` : "所有游戏")} 
              />
              {filteredGames.length > itemsPerPage && (
                <Pagination 
                  totalItems={filteredGames.length} 
                  itemsPerPage={itemsPerPage} 
                  currentPage={currentPage} 
                />
              )}
            </>
          ) : (
            // 如果没有选择分类或标签，则按分类展示游戏
            categories.map(cat => (
              <div key={cat} id={cat} className="mb-12">
                <GameList 
                  games={gamesByCategory[cat].slice(0, 4)} 
                  title={`${cat}游戏`} 
                />
                {gamesByCategory[cat].length > 4 && (
                  <div className="text-right mt-4">
                    <a 
                      href={`/games?category=${cat}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      查看更多 {cat}游戏 &rarr;
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 
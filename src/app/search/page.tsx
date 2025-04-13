import { games } from "@/data/games";
import { filterGames, paginateGames, getAllTags } from "@/lib/utils";
import GameList from "@/components/game/GameList";
import CategoryFilter from "@/components/ui/CategoryFilter";
import TagFilter from "@/components/ui/TagFilter";
import Pagination from "@/components/ui/Pagination";
import { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const query = (await searchParams).q || '';
  return {
    title: query ? `"${query}" 的搜索结果 - 游戏集合站` : "搜索游戏 - 游戏集合站",
    description: query 
      ? `查看与"${query}"相关的游戏结果，在游戏集合站探索更多有趣的在线游戏。` 
      : "搜索并探索各种有趣的在线游戏，找到您喜欢的游戏类型。",
  };
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; category?: string; tag?: string; page?: string } }) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.category || '';
  const tag = params.tag || '';
  const currentPage = parseInt(params.page || '1', 10);
  
  // 获取所有游戏分类
  const categories = [...new Set(games.map(game => game.category))];
  
  // 获取所有游戏标签
  const allTags = getAllTags(games);
  
  // 根据搜索条件过滤游戏
  const filteredGames = filterGames(games, query, category, tag);
  
  // 分页处理
  const itemsPerPage = 12;
  const paginatedGames = paginateGames(filteredGames, currentPage, itemsPerPage);
  
  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
          {query ? `"${query}" 的搜索结果` : '所有游戏'}
        </h1>
        {query && (
          <p className="text-gray-600 dark:text-gray-300">
            找到 {filteredGames.length} 个相关游戏
          </p>
        )}
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <CategoryFilter categories={categories} selectedCategory={category} />
          <TagFilter tags={allTags} selectedTag={tag} />
          
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
          {filteredGames.length > 0 ? (
            <>
              <GameList games={paginatedGames} title="搜索结果" />
              <Pagination 
                totalItems={filteredGames.length} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage} 
              />
            </>
          ) : (
            <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                未找到相关游戏
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                尝试不同的搜索词或浏览我们的游戏分类
              </p>
              <div className="flex justify-center">
                <a 
                  href="/games"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-150"
                >
                  浏览所有游戏
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import { games } from "@/data/games";
import { Metadata } from "next";
import Script from "next/script";
import { generateGameCollectionSchema } from "@/app/api/schema";
import { shuffleArray } from "@/lib/utils";

export const metadata: Metadata = {
  title: "游戏库 - 畅玩各种免费在线游戏 - 游戏集合站",
  description: "浏览我们丰富多样的游戏库，包含益智、街机、棋牌等多种类型的免费在线游戏，随时随地开始您的游戏体验。",
  keywords: "游戏库, 免费游戏, 在线游戏, 休闲游戏, 益智游戏, 街机游戏",
  openGraph: {
    title: "游戏库 - 畅玩各种免费在线游戏 - 游戏集合站",
    description: "浏览我们丰富多样的游戏库，体验各种类型的免费在线游戏。",
    url: "https://gamecollectionhub.example.com/games",
    siteName: "游戏集合站",
    locale: "zh_CN",
    type: "website",
  },
};

export default function GamesPage({ searchParams }: { searchParams?: { category?: string; tag?: string; page?: string; } }) {
  // 获取分类和标签
  const category = searchParams?.category || '';
  const tag = searchParams?.tag || '';
  
  // 获取页码，默认为1
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const itemsPerPage = 12;
  
  // 获取所有分类和标签
  const allCategories = [...new Set(games.map(game => game.category))];
  const allTags = [...new Set(games.flatMap(game => game.tags))];
  
  // 过滤游戏
  let filteredGames = [...games];
  
  if (category) {
    filteredGames = filteredGames.filter(game => game.category === category);
  }
  
  if (tag) {
    filteredGames = filteredGames.filter(game => game.tags.includes(tag));
  }
  
  // 分页处理
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);
  
  // 生成结构化数据
  const gamesForSchema = filteredGames.length > 20 
    ? shuffleArray(filteredGames).slice(0, 20) 
    : filteredGames;
  const structuredData = generateGameCollectionSchema(gamesForSchema);
  
  // 计算游戏总数和页数
  const totalGames = filteredGames.length;
  const totalPages = Math.ceil(totalGames / itemsPerPage);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 结构化数据 */}
      <Script
        id="games-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        {category ? `${category}游戏` : tag ? `${tag}游戏` : '游戏库'}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 侧边栏过滤器 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">游戏分类</h2>
            <nav className="mb-8">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/games" 
                    className={`block py-2 px-4 rounded ${!category && !tag ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  >
                    全部游戏
                  </a>
                </li>
                {allCategories.map(cat => (
                  <li key={cat}>
                    <a 
                      href={`/games?category=${cat}`} 
                      className={`block py-2 px-4 rounded ${
                        category === cat 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat}游戏
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">热门标签</h2>
            <div className="flex flex-wrap gap-2">
              {allTags.map(t => (
                <a 
                  key={t} 
                  href={`/games?tag=${t}`}
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    tag === t 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* 游戏列表 */}
        <div className="lg:col-span-3">
          {/* 筛选结果统计 */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300">
              显示 <span className="font-semibold">{totalGames}</span> 个游戏中的 
              <span className="font-semibold"> {startIndex + 1}-{Math.min(endIndex, totalGames)}</span>
            </p>
            
            {(category || tag) && (
              <a 
                href="/games" 
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                清除筛选
              </a>
            )}
          </div>
          
          {/* 无结果提示 */}
          {paginatedGames.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">未找到游戏</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                抱歉，没有符合当前筛选条件的游戏。
              </p>
              <a 
                href="/games" 
                className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                查看全部游戏
              </a>
            </div>
          )}
          
          {/* 游戏卡片网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGames.map(game => (
              <a 
                key={game.id} 
                href={`/games/${game.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative pb-[56.25%] bg-gray-200 dark:bg-gray-700">
                  <img 
                    src={game.thumbnailUrl || '/images/game-placeholder.svg'} 
                    alt={game.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {game.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                    {game.description.substring(0, 80) + (game.description.length > 80 ? '...' : '')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded text-xs">
                      {game.category}
                    </span>
                    {game.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <a
                    key={page}
                    href={`/games?${category ? `category=${category}&` : ''}${tag ? `tag=${tag}&` : ''}page=${page}`}
                    className={`px-4 py-2 ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } ${page === 1 ? 'rounded-l-md' : ''} ${page === totalPages ? 'rounded-r-md' : ''} border border-gray-300 dark:border-gray-600`}
                  >
                    {page}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
import Link from "next/link";
import { Metadata } from "next";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "页面未找到 - 404 错误 - 游戏集合站",
  description: "抱歉，您请求的页面不存在。请返回首页或浏览我们的游戏库。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  // 随机获取3个游戏作为推荐
  const randomGames = [...games]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  // 获取所有游戏分类
  const categories = [...new Set(games.map((game) => game.category))];

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-blue-600">4</span>
          <span className="text-red-500">0</span>
          <span className="text-blue-600">4</span>
        </h1>
        
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          页面未找到
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          抱歉，您请求的页面不存在或已被移除。请尝试访问其他页面或返回首页。
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            返回首页
          </Link>
          
          <Link
            href="/games"
            className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            浏览游戏库
          </Link>
        </div>
        
        {/* 推荐游戏 */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
            您可能会喜欢这些游戏
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {randomGames.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="block p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {game.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {game.category} · {game.tags[0]}
                </p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* 分类导航 */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            浏览游戏分类
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${category}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {category}游戏
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
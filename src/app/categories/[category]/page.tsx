import { games } from "@/data/games";
import GameList from "@/components/game/GameList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// 动态生成元数据
export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const decodedCategory = decodeURIComponent(params.category);
  const categoryGames = games.filter(game => game.category === decodedCategory);
  
  if (categoryGames.length === 0) {
    return {
      title: "分类未找到 - 游戏集合站",
      description: "抱歉，您请求的游戏分类未找到。请浏览我们的游戏库，查看其他分类。",
    };
  }
  
  return {
    title: `${decodedCategory}游戏 - 游戏集合站`,
    description: `探索我们精选的${decodedCategory}游戏，包括${categoryGames.slice(0, 3).map(game => game.title).join('、')}等多款有趣游戏。`,
    keywords: [`${decodedCategory}游戏`, "在线游戏", "免费游戏", ...categoryGames.slice(0, 5).map(game => game.title)].join(", "),
  };
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const decodedCategory = decodeURIComponent(params.category);
  const categoryGames = games.filter(game => game.category === decodedCategory);
  
  // 如果分类不存在，返回404
  if (categoryGames.length === 0) {
    notFound();
  }
  
  // 获取所有分类，用于分类导航
  const allCategories = [...new Set(games.map(game => game.category))];
  
  return (
    <div>
      <section className="text-center py-8 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-3xl font-bold mb-3">{decodedCategory}游戏</h1>
        <p className="max-w-2xl mx-auto">
          探索我们精选的{decodedCategory}游戏，随时畅玩
        </p>
      </section>
      
      {/* 分类导航 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">浏览其他分类</h2>
        <div className="flex flex-wrap gap-3">
          {allCategories.map(category => (
            <a
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className={`px-4 py-2 rounded-full text-sm ${
                category === decodedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              }`}
            >
              {category}游戏
            </a>
          ))}
        </div>
      </section>
      
      {/* 游戏列表 */}
      <GameList games={categoryGames} title={`${decodedCategory}游戏合集`} />
      
      {/* 推荐语 */}
      <section className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">为什么选择{decodedCategory}游戏？</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {decodedCategory}游戏能够{
            decodedCategory === '益智' ? '锻炼您的思维和解决问题的能力，提高逻辑思考和创意思维。' :
            decodedCategory === '街机' ? '带您重温经典游戏的乐趣，体验简单而刺激的游戏玩法。' :
            decodedCategory === '棋牌' ? '培养您的战略思维和决策能力，享受传统游戏的精髓。' :
            '为您提供独特的游戏体验，满足您的娱乐需求。'
          }
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          我们精心挑选每一款{decodedCategory}游戏，确保它们能够带给您愉快的游戏体验。无需下载，随时随地开始您的游戏之旅！
        </p>
      </section>
      
      <div className="text-center mt-12">
        <a 
          href="/games" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-150"
        >
          浏览全部游戏
        </a>
      </div>
    </div>
  );
} 
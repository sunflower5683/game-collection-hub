import { games } from "@/data/games";
import GameEmbed from "@/components/game/GameEmbed";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// 动态生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = games.find((g) => g.slug === params.slug);
  
  if (!game) {
    return {
      title: "游戏未找到 - 游戏集合站",
      description: "抱歉，您请求的游戏未找到。请浏览我们的游戏库，选择其他游戏。",
    };
  }
  
  return {
    title: `${game.title} - 在线玩 - 游戏集合站`,
    description: game.description,
    keywords: [...game.tags, game.category, "在线游戏", "免费游戏"].join(", "),
    openGraph: {
      title: `${game.title} - 在线玩 - 游戏集合站`,
      description: game.description,
      images: [game.thumbnailUrl],
    },
  };
}

export default function GamePage({ params }: { params: { slug: string } }) {
  const game = games.find((g) => g.slug === params.slug);
  
  // 如果游戏不存在，返回404
  if (!game) {
    notFound();
  }
  
  // 查找相关游戏（同类别的其他游戏，最多3个）
  const relatedGames = games
    .filter((g) => g.category === game.category && g.id !== game.id)
    .slice(0, 3);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <GameEmbed game={game} />
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">游戏介绍</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 dark:text-gray-300">{game.description}</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">分类</h3>
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm">
              {game.category}
            </span>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">标签</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {relatedGames.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">相似游戏</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedGames.map((relatedGame) => (
              <a
                key={relatedGame.id}
                href={`/games/${relatedGame.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {relatedGame.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {relatedGame.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center">
        <a 
          href="/games" 
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-150"
        >
          返回游戏库
        </a>
      </div>
    </div>
  );
} 
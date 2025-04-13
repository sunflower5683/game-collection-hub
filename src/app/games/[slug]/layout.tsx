import { Metadata } from 'next';
import { games } from "@/data/games";

// 动态生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slugParam = params.slug;
  const game = games.find((g) => g.slug === slugParam);
  
  if (!game) {
    return {
      title: "游戏不存在 - 游戏集合站",
      description: "抱歉，您访问的游戏不存在或已被移除。",
    };
  }
  
  return {
    title: `${game.title} - 在线游戏 - 游戏集合站`,
    description: game.description,
    keywords: `${game.title}, ${game.category}, ${game.tags.join(', ')}, 在线游戏, 免费游戏`,
    openGraph: {
      title: `${game.title} - 在线游戏 - 游戏集合站`,
      description: game.description,
      url: `https://gamecollectionhub.example.com/games/${game.slug}`,
      siteName: "游戏集合站",
      images: [
        {
          url: game.thumbnailUrl || 'https://gamecollectionhub.example.com/images/game-placeholder.svg',
          width: 800,
          height: 600,
          alt: game.title,
        },
      ],
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 
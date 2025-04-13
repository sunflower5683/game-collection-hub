import { Metadata } from 'next';

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

export default function GamesLayout({
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
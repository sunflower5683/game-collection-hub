import { Metadata } from 'next';
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "游戏集合站 - 畅玩免费在线游戏",
  description: "在游戏集合站体验各种免费在线游戏，包括益智、街机、动作等多种类型，让您在任何设备上都能享受游戏乐趣。",
  keywords: "在线游戏, 免费游戏, 网页游戏, 休闲游戏, 益智游戏",
  openGraph: {
    title: "游戏集合站 - 畅玩免费在线游戏",
    description: "体验各种免费在线游戏，让您随时随地享受游戏乐趣。",
    url: "https://gamecollectionhub.example.com",
    siteName: "游戏集合站",
    locale: "zh_CN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="bg-white dark:bg-gray-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              游戏集合站
            </Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    首页
                  </Link>
                </li>
                <li>
                  <Link href="/games" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                    游戏库
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        
        <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} 游戏集合站 - 所有游戏均为免费提供</p>
              <p className="mt-2">
                本站所有游戏版权归原作者所有，本站仅提供在线体验服务。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 - 游戏集合站",
  description: "了解游戏集合站的使命和愿景，我们致力于为用户提供优质的在线游戏体验。",
  keywords: "关于我们, 游戏集合站, 在线游戏平台, 游戏愿景",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-10 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">关于游戏集合站</h1>
        <p className="max-w-2xl mx-auto text-lg">
          我们的使命是让每个人都能随时随地享受游戏乐趣
        </p>
      </section>
      
      <section className="mb-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">我们的故事</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          游戏集合站诞生于对简单、便捷游戏体验的追求。在这个快节奏的世界中，我们相信游戏不仅是一种娱乐方式，更是放松心情、锻炼思维的绝佳途径。
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          我们精心挑选各种类型的优质游戏，从经典的益智游戏到刺激的街机游戏，无需下载，无需注册，打开浏览器即可开始游戏。
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          无论您是在短暂的休息时间想放松一下，还是想挑战自己的智力极限，游戏集合站都能满足您的需求。
        </p>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">我们的特色</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-blue-600 dark:text-blue-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">多样化游戏</h3>
            <p className="text-gray-600 dark:text-gray-300">
              我们提供多种类型的游戏，满足不同玩家的喜好和需求。
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-green-600 dark:text-green-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">即玩即走</h3>
            <p className="text-gray-600 dark:text-gray-300">
              无需下载安装，直接在浏览器中享受游戏乐趣。
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-purple-600 dark:text-purple-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">持续更新</h3>
            <p className="text-gray-600 dark:text-gray-300">
              我们不断引入新游戏，为玩家提供新鲜的游戏体验。
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-12 bg-gray-100 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">联系我们</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          我们非常重视您的反馈和建议。如果您有任何问题、意见或合作提案，请随时与我们联系。
        </p>
        <div className="flex items-center mt-4">
          <a 
            href="mailto:contact@gamestation.example.com" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            发送邮件
          </a>
        </div>
      </section>
    </div>
  );
} 
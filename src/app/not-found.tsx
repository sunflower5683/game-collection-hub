import { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面未找到 - 游戏集合站",
  description: "抱歉，您请求的页面不存在。请返回首页浏览我们的游戏库。",
};

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <div className="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">404 - 页面未找到</h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
        抱歉，您访问的页面似乎已经消失在了虚拟世界中。
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <a 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg transition duration-150"
        >
          返回首页
        </a>
        
        <a 
          href="/games" 
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-8 rounded-lg transition duration-150"
        >
          浏览游戏库
        </a>
      </div>
      
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          为什么不试试以下游戏？
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a 
            href="/games/tetris" 
            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">俄罗斯方块</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">经典方块益智游戏</p>
          </a>
          
          <a 
            href="/games/2048" 
            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">2048</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">数字合并益智游戏</p>
          </a>
          
          <a 
            href="/games/snake" 
            className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">贪吃蛇</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">经典街机游戏</p>
          </a>
        </div>
      </div>
    </div>
  );
} 
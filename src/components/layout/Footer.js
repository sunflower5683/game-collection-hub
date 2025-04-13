export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">游戏集合站</h3>
            <p className="text-gray-400">
              提供各种免费在线游戏，让您在任何设备上都能随时享受游戏的乐趣。
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition duration-150">
                  首页
                </a>
              </li>
              <li>
                <a href="/games" className="text-gray-400 hover:text-white transition duration-150">
                  游戏库
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition duration-150">
                  关于我们
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">游戏分类</h3>
            <ul className="space-y-2">
              <li>
                <a href="/categories/益智" className="text-gray-400 hover:text-white transition duration-150">
                  益智游戏
                </a>
              </li>
              <li>
                <a href="/categories/街机" className="text-gray-400 hover:text-white transition duration-150">
                  街机游戏
                </a>
              </li>
              <li>
                <a href="/categories/棋牌" className="text-gray-400 hover:text-white transition duration-150">
                  棋牌游戏
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} 游戏集合站 版权所有</p>
        </div>
      </div>
    </footer>
  );
} 
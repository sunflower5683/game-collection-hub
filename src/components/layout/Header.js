export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold">游戏集合站</span>
          </a>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-blue-200 transition duration-150">
            首页
          </a>
          <a href="/games" className="hover:text-blue-200 transition duration-150">
            游戏库
          </a>
          <a href="/about" className="hover:text-blue-200 transition duration-150">
            关于
          </a>
        </nav>
        
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 
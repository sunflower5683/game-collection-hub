"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function CategoryFilter({ categories, selectedCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category) => {
    // 创建新的URLSearchParams对象并设置category参数
    const params = new URLSearchParams(searchParams);
    
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    // 导航到带有新参数的当前路径
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">游戏分类</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
} 
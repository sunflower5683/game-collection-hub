"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function TagFilter({ tags, selectedTag }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTagChange = (tag) => {
    const params = new URLSearchParams(searchParams);
    
    if (tag === 'all') {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // 获取常用标签显示数量
  const displayCount = tags.length > 10 ? 10 : tags.length;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">游戏标签</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTagChange('all')}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            !selectedTag
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          全部
        </button>
        
        {/* 只显示常用标签 */}
        {tags.slice(0, displayCount).map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagChange(tag)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              selectedTag === tag
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
        
        {/* 如果标签数量超过限制，显示更多按钮 */}
        {tags.length > displayCount && (
          <div className="relative group">
            <button
              className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              更多 +
            </button>
            
            <div className="absolute z-10 left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 hidden group-hover:block">
              <div className="flex flex-wrap gap-2">
                {tags.slice(displayCount).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagChange(tag)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedTag === tag
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
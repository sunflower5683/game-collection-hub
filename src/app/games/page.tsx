"use client";

import { useState, useEffect } from 'react';
import { games } from "@/data/games";
import GameCard from "@/components/game/GameCard";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { generateWebsiteSchema } from "@/app/api/schema";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilter from "@/components/ui/CategoryFilter";

interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  featured: boolean;
  isActive?: boolean;
}

export default function GamesPage() {
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");
  const tagParam = searchParams?.get("tag");
  
  useEffect(() => {
    // 获取游戏的激活状态和自定义游戏
    try {
      const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
      const customGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      
      console.log("游戏列表页 - 自定义游戏数据:", customGames);
      
      // 合并默认游戏和自定义游戏
      const allGames = [...games];
      
      // 直接添加自定义游戏，不检查ID重复
      customGames.forEach((customGame: Game) => {
        console.log(`添加自定义游戏: ${customGame.title} (ID: ${customGame.id})`);
        allGames.push(customGame);
      });
      
      console.log(`合并后游戏总数: ${allGames.length}`);
      
      // 添加激活状态到游戏
      const gamesWithState = allGames.map(game => ({
        ...game,
        isActive: activeStates[game.id] === undefined ? true : activeStates[game.id]
      }));
      
      // 设置所有游戏，暂不过滤激活状态
      setActiveGames(gamesWithState);
      console.log(`游戏列表页 - 设置游戏数: ${gamesWithState.length}`);
      
    } catch (error) {
      console.error('Error loading game data:', error);
      // 出错时使用默认游戏列表
      setActiveGames(games);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // 当搜索参数或激活游戏列表变化时更新过滤
  useEffect(() => {
    let result = [...activeGames];
    
    // 首先过滤掉非活跃游戏
    result = result.filter(game => game.isActive);
    console.log(`过滤后活跃游戏数量: ${result.length}`);
    
    // 应用分类过滤
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      result = result.filter(game => game.category === categoryParam);
      console.log(`分类"${categoryParam}"过滤后: ${result.length}`);
    } else if (selectedCategory) {
      result = result.filter(game => game.category === selectedCategory);
      console.log(`分类"${selectedCategory}"过滤后: ${result.length}`);
    }
    
    // 应用标签过滤
    if (tagParam) {
      result = result.filter(game => game.tags.includes(tagParam));
      console.log(`标签"${tagParam}"过滤后: ${result.length}`);
    }
    
    // 应用搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
      console.log(`搜索"${searchQuery}"过滤后: ${result.length}`);
    }
    
    setFilteredGames(result);
  }, [activeGames, categoryParam, tagParam, selectedCategory, searchQuery]);
  
  // 获取所有可用的游戏分类
  const categories = Array.from(new Set(activeGames.map(game => game.category))).sort();
  
  // 生成结构化数据
  const schemaData = generateWebsiteSchema();
  
  // 处理分类选择
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // 渲染标题
  const renderTitle = () => {
    if (tagParam) {
      return `${tagParam} 游戏`;
    } else if (categoryParam) {
      return `${categoryParam} 游戏`;
    } else if (selectedCategory) {
      return `${selectedCategory} 游戏`;
    } else {
      return "所有游戏";
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 结构化数据 */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          {renderTitle()}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          探索我们的精选游戏库，找到适合您的休闲娱乐选择。
        </p>
      </div>
      
      {/* 搜索和过滤 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="md:w-1/3">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="md:w-2/3">
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory} 
          />
        </div>
      </div>
      
      {/* 游戏网格 */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
            没有找到符合条件的游戏
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            尝试调整您的搜索条件或查看所有游戏。
          </p>
          <button 
            onClick={() => {
              setSelectedCategory("");
              setSearchQuery("");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-150"
          >
            查看所有游戏
          </button>
        </div>
      )}
    </div>
  );
} 
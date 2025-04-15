"use client";

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { games } from "@/data/games";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      // 确保slug是字符串
      const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;
      
      // 从localStorage获取游戏的激活状态和自定义游戏
      try {
        const customGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
        
        // 合并默认游戏和自定义游戏
        const allGames = [...games, ...customGames];
        
        // 查找当前游戏
        const game = allGames.find((g) => g.slug === slugParam);
        
        if (game) {
          // 动态更新document标题
          document.title = `${game.title} - 在线游戏 - 游戏集合站`;
          
          // 更新meta标签
          updateMetaTag('description', game.description);
          updateMetaTag('og:title', `${game.title} - 在线游戏 - 游戏集合站`);
          updateMetaTag('og:description', game.description);
          updateMetaTag('og:image', game.thumbnailUrl || '/images/game-placeholder.svg');
        } else {
          // 动态更新document标题
          document.title = "游戏不存在 - 游戏集合站";
          
          // 更新meta标签
          updateMetaTag('description', "抱歉，您访问的游戏不存在或已被移除。");
          updateMetaTag('og:title', "游戏不存在 - 游戏集合站");
          updateMetaTag('og:description', "抱歉，您访问的游戏不存在或已被移除。");
          updateMetaTag('og:image', "/images/game-placeholder.svg");
        }
      } catch (error) {
        console.error('Error loading game data for metadata:', error);
      }
    }
  }, [params]);
  
  // 辅助函数：更新或创建meta标签
  const updateMetaTag = (name: string, content: string) => {
    let meta: HTMLMetaElement | null;
    
    // 检查是og标签还是普通meta标签
    if (name.startsWith('og:')) {
      meta = document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', name);
        document.head.appendChild(meta);
      }
    } else {
      meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
    }
    
    meta.setAttribute('content', content);
  };

  return (
    <>
      {children}
    </>
  );
} 
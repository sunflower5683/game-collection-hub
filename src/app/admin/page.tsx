"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中是否有管理员凭证
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 让useEffect的路由重定向生效
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">管理员控制台</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/games" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">游戏管理</h2>
          <p className="text-gray-600 dark:text-gray-300">
            添加、编辑或下架游戏内容
          </p>
          <div className="mt-4 text-blue-600 dark:text-blue-400">
            管理游戏 &rarr;
          </div>
        </Link>
        
        <Link 
          href="/admin/settings" 
          className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">网站设置</h2>
          <p className="text-gray-600 dark:text-gray-300">
            管理网站基本设置和配置
          </p>
          <div className="mt-4 text-blue-600 dark:text-blue-400">
            管理设置 &rarr;
          </div>
        </Link>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface GameFormProps {
  game?: Game;
  isEditing?: boolean;
}

// 默认图片选项
const DEFAULT_IMAGES = [
  { path: '/images/game-placeholder.svg', label: '默认占位图' },
  { path: '/images/games/mygame-thumbnail.png', label: 'Dead Land 缩略图' }
];

export default function GameForm({ game, isEditing = false }: GameFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Game>({
    id: '',
    slug: '',
    title: '',
    description: '',
    embedUrl: '',
    thumbnailUrl: '/images/game-placeholder.svg',
    category: '',
    tags: [],
    featured: false,
    isActive: true
  });
  
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmbedPreview, setShowEmbedPreview] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    // 从localStorage获取现有分类和标签
    try {
      const allGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      const categories = [...new Set(allGames.map((g: Game) => g.category))] as string[];
      const tags = [...new Set(allGames.flatMap((g: Game) => g.tags))] as string[];
      
      setAvailableCategories(categories);
      setAvailableTags(tags);
      
      // 如果是编辑模式，加载游戏数据
      if (isEditing && game) {
        setFormData({
          ...game,
          isActive: game.isActive === undefined ? true : game.isActive
        });
        setThumbnailPreview(game.thumbnailUrl);
      } else {
        // 新建游戏时，设置预览为默认图片
        setThumbnailPreview(formData.thumbnailUrl);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  }, [game, isEditing, formData.thumbnailUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: name === 'featured' ? (e.target as HTMLInputElement).checked : value
      };
      
      // 如果更新了标题，自动生成slug（仅对新游戏）
      if (name === 'title' && !isEditing) {
        const generatedSlug = value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')  // 移除特殊字符
          .replace(/\s+/g, '-');     // 空格替换为连字符
        
        newData.slug = generatedSlug;
      }
      
      // 如果更新了缩略图URL，更新预览
      if (name === 'thumbnailUrl') {
        setThumbnailPreview(value);
      }
      
      return newData;
    });
    
    // 清除字段的错误信息
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageSelect = (path: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnailUrl: path
    }));
    setThumbnailPreview(path);
    setShowImageSelector(false);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = '游戏标题不能为空';
    if (!formData.description.trim()) newErrors.description = '游戏描述不能为空';
    if (!formData.embedUrl.trim()) newErrors.embedUrl = '游戏嵌入URL不能为空';
    if (!formData.category.trim()) newErrors.category = '游戏分类不能为空';
    if (formData.tags.length === 0) newErrors.tags = '至少需要一个标签';
    
    // 自动生成和规范化slug (如果是新游戏或slug为空)
    if (!isEditing || !formData.slug.trim()) {
      // 从标题生成slug：小写，移除特殊字符，空格替换为连字符
      const generatedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  // 移除特殊字符
        .replace(/\s+/g, '-');     // 空格替换为连字符
      
      setFormData(prev => ({
        ...prev,
        slug: generatedSlug
      }));
    }
    
    // 生成ID (与slug保持一致)
    if (!isEditing) {
      // 确保slug已被规范化
      const normalizedSlug = formData.slug
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')  
        .replace(/\s+/g, '-');
      
      setFormData(prev => ({
        ...prev,
        id: normalizedSlug,
        slug: normalizedSlug
      }));
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // 确保slug和ID被正确格式化（小写、使用连字符）
      const normalizedSlug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      // 准备要保存的游戏数据
      const gameToSave = {
        ...formData,
        id: isEditing ? formData.id : normalizedSlug,
        slug: normalizedSlug
      };
      
      // 从localStorage获取现有游戏
      const existingGames = JSON.parse(localStorage.getItem('adminGames') || '[]');
      console.log('当前已有的自定义游戏:', existingGames);
      
      let updatedGames;
      
      if (isEditing) {
        // 更新现有游戏
        updatedGames = existingGames.map((g: Game) => 
          g.id === gameToSave.id ? gameToSave : g
        );
      } else {
        // 添加新游戏
        const newId = gameToSave.id;
        
        // 检查ID是否已存在
        const idExists = existingGames.some((g: Game) => g.id === newId);
        if (idExists) {
          setErrors({ slug: '该游戏ID已被使用，请选择不同的标题' });
          setIsSubmitting(false);
          return;
        }
        
        updatedGames = [...existingGames, gameToSave];
      }
      
      // 保存回localStorage
      localStorage.setItem('adminGames', JSON.stringify(updatedGames));
      console.log('保存后的自定义游戏:', updatedGames);
      
      // 确保游戏激活状态正确设置
      const activeStates = JSON.parse(localStorage.getItem('gameActiveStates') || '{}');
      activeStates[gameToSave.id] = gameToSave.isActive;
      localStorage.setItem('gameActiveStates', JSON.stringify(activeStates));
      
      // 显示成功消息
      if (window.confirm('游戏保存成功! 您想要返回列表页还是查看首页?')) {
        // 回到管理页
        router.push('/admin/games');
      } else {
        // 跳转到首页查看
        window.location.href = '/'; // 强制页面刷新，确保数据重新加载
      }
      
    } catch (error) {
      console.error('保存游戏时出错:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">基本信息</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              游戏标题 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL路径 <span className="text-xs text-gray-500">(自动生成)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">/games/</span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                readOnly
                className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">此URL将用于访问游戏页面</p>
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            游戏描述 *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">游戏嵌入</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="embedUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              嵌入URL * (iframe src)
            </label>
            <div className="flex">
              <input
                type="text"
                id="embedUrl"
                name="embedUrl"
                value={formData.embedUrl}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.embedUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowEmbedPreview(!showEmbedPreview)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showEmbedPreview ? '隐藏预览' : '预览'}
              </button>
            </div>
            {errors.embedUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.embedUrl}</p>
            )}
          </div>
          
          {showEmbedPreview && formData.embedUrl && (
            <div className="border rounded-md overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <iframe
                  src={formData.embedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                ></iframe>
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              缩略图URL
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                id="thumbnailUrl"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowImageSelector(!showImageSelector)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                选择图片
              </button>
            </div>
            
            {/* 图片选择器 */}
            {showImageSelector && (
              <div className="mt-2 p-4 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选择一个图片:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {DEFAULT_IMAGES.map((img) => (
                    <div 
                      key={img.path}
                      onClick={() => handleImageSelect(img.path)}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden hover:border-blue-500 ${
                        formData.thumbnailUrl === img.path ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700">
                        <img 
                          src={img.path} 
                          alt={img.label}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 text-xs text-center text-gray-700 dark:text-gray-300 truncate">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  或者输入自定义路径，例如：/images/games/your-image.png
                </p>
              </div>
            )}
            
            {/* 图片预览 */}
            {thumbnailPreview && (
              <div className="mt-3 border rounded-md overflow-hidden w-40">
                <div className="relative pt-[56.25%] bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={thumbnailPreview} 
                    alt="缩略图预览"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setThumbnailPreview(null)}
                  />
                </div>
                <div className="p-1 text-xs text-center text-gray-700 dark:text-gray-300">
                  预览
                </div>
              </div>
            )}
            
            <p className="mt-3 text-sm text-gray-500">
              使用以下格式：<br/>
              - 项目内图片：/images/games/your-image.png（图片需放在public/images/games/目录）<br/>
              - 外部图片：https://example.com/your-image.jpg（完整URL）
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">分类和标签</h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              游戏分类 *
            </label>
            <div className="flex">
              <input
                type="text"
                id="category"
                name="category"
                list="category-list"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <datalist id="category-list">
                {availableCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              游戏标签 *
            </label>
            <div className="flex">
              <input
                type="text"
                id="tagInput"
                list="tags-list"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="输入标签后按添加"
                className="w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <datalist id="tags-list">
                {availableTags.map(tag => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={handleTagAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                添加
              </button>
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    <span className="sr-only">删除标签</span>
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">其他设置</h2>
        
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              设为精选游戏
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              立即上架游戏
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/admin/games')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              保存中...
            </>
          ) : (
            '保存游戏'
          )}
        </button>
      </div>
    </form>
  );
} 
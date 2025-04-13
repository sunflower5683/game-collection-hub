/**
 * 根据搜索条件过滤游戏
 * @param {Array} games 游戏数组
 * @param {string} searchQuery 搜索关键词
 * @param {string} category 分类过滤
 * @param {string} tag 标签过滤
 * @returns {Array} 过滤后的游戏数组
 */
export function filterGames(games, searchQuery = '', category = '', tag = '') {
  return games.filter((game) => {
    // 搜索词过滤
    const matchesQuery = searchQuery
      ? game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    
    // 分类过滤
    const matchesCategory = category ? game.category === category : true;
    
    // 标签过滤
    const matchesTag = tag ? game.tags.includes(tag) : true;
    
    return matchesQuery && matchesCategory && matchesTag;
  });
}

/**
 * 对游戏数据进行分页
 * @param {Array} games 游戏数组
 * @param {number} page 当前页码
 * @param {number} itemsPerPage 每页显示数量
 * @returns {Array} 分页后的游戏数组
 */
export function paginateGames(games, page = 1, itemsPerPage = 12) {
  const startIndex = (page - 1) * itemsPerPage;
  return games.slice(startIndex, startIndex + itemsPerPage);
}

/**
 * 生成游戏的永久链接
 * @param {Object} game 游戏对象
 * @returns {string} 游戏永久链接
 */
export function getGameUrl(game) {
  return `/games/${game.slug}`;
}

/**
 * 获取所有游戏标签
 * @param {Array} games 游戏数组
 * @returns {Array} 去重后的标签数组
 */
export function getAllTags(games) {
  const allTags = games.reduce((tags, game) => {
    return [...tags, ...game.tags];
  }, []);
  
  // 去重并排序
  return [...new Set(allTags)].sort();
}

/**
 * 获取热门标签
 * @param {Array} games 游戏数组
 * @param {number} limit 限制数量
 * @returns {Array} 热门标签数组
 */
export function getPopularTags(games, limit = 10) {
  const tagCount = {};
  
  // 统计每个标签出现的次数
  games.forEach(game => {
    game.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  
  // 转换为数组并按出现次数排序
  const sortedTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedTags.slice(0, limit);
}

/**
 * 格式化日期为本地格式
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 截断文本到指定长度
 * @param {string} text - 源文本
 * @param {number} length - 目标长度
 * @returns {string} - 截断后的文本
 */
export function truncateText(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 随机整数
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 洗牌算法 - 随机排序数组
 * @param {Array} array - 源数组
 * @returns {Array} - 随机排序后的新数组
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * 按属性分组对象数组
 * @param {Array} arr - 对象数组
 * @param {string} key - 分组的键名
 * @returns {Object} - 分组后的对象
 */
export function groupBy(arr, key) {
  return arr.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
}

/**
 * 检测设备类型
 * @returns {string} - 设备类型：'mobile', 'tablet', 或 'desktop'
 */
export function getDeviceType() {
  const ua = typeof window !== 'undefined' ? navigator.userAgent : '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * 性能监控 - 测量组件渲染时间
 * @param {string} componentName - 组件名称
 * @param {Function} callback - 渲染完成后的回调
 * @returns {Function} - 结束测量的函数
 */
export function measureRenderTime(componentName) {
  if (typeof performance === 'undefined') return () => {};
  
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 在开发环境下记录性能数据
    if (process.env.NODE_ENV === 'development') {
      console.log(`[性能] ${componentName} 渲染耗时: ${duration.toFixed(2)}ms`);
    }
    
    // 如果超过阈值，记录性能警告
    if (duration > 200) {
      console.warn(`[性能警告] ${componentName} 渲染时间过长: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  };
}

/**
 * 资源加载优化 - 预加载关键资源
 * @param {string} url - 资源URL
 * @param {string} type - 资源类型，如 'image', 'script', 'style', 'font'
 */
export function preloadResource(url, type = 'image') {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  
  switch (type) {
    case 'image':
      link.as = 'image';
      break;
    case 'script':
      link.as = 'script';
      break;
    case 'style':
      link.as = 'style';
      break;
    case 'font':
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      break;
    default:
      link.as = type;
  }
  
  document.head.appendChild(link);
}

/**
 * 监控网页可见性变化
 * @param {Function} onVisible - 页面变为可见时的回调
 * @param {Function} onHidden - 页面变为隐藏时的回调
 * @returns {Function} - 移除监听的函数
 */
export function monitorPageVisibility(onVisible, onHidden) {
  if (typeof document === 'undefined') return () => {};
  
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      onVisible?.();
    } else {
      onHidden?.();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}

/**
 * 延迟加载函数 - 用于非关键资源
 * @param {Function} fn - 要延迟执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 */
export function deferLoadingTask(fn, delay = 1000) {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => setTimeout(fn, delay));
  } else {
    setTimeout(fn, delay);
  }
} 
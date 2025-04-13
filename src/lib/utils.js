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
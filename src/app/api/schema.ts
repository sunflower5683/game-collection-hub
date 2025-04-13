/**
 * 创建游戏页面的JSON-LD结构化数据，用于SEO优化
 * @param game 游戏数据对象
 * @param baseUrl 网站基础URL
 * @returns JSON-LD结构化数据对象
 */
export function generateGameSchema(game: any, baseUrl: string = 'https://gamecollectionhub.example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    url: `${baseUrl}/games/${game.slug}`,
    image: game.thumbnailUrl || `${baseUrl}/images/game-placeholder.svg`,
    genre: [game.category, ...game.tags],
    applicationCategory: 'Game',
    operatingSystem: 'Web Browser',
    gamePlatform: 'Web Browser',
    playMode: game.tags.includes('双人') ? 'MultiPlayer' : 'SinglePlayer',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock'
    }
  };
}

/**
 * 创建游戏集合页面的JSON-LD结构化数据
 * @param games 游戏数据数组
 * @param baseUrl 网站基础URL
 * @returns JSON-LD结构化数据对象
 */
export function generateGameCollectionSchema(games: any[], baseUrl: string = 'https://gamecollectionhub.example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '游戏集合站 - 免费在线游戏平台',
    description: '畅玩各种免费在线游戏，包括益智、街机、棋牌等多种类型游戏，随时随地享受游戏乐趣。',
    url: baseUrl,
    hasPart: games.map(game => ({
      '@type': 'WebPage',
      name: game.title,
      description: game.description,
      url: `${baseUrl}/games/${game.slug}`,
      primaryImageOfPage: {
        '@type': 'ImageObject',
        contentUrl: game.thumbnailUrl || `${baseUrl}/images/game-placeholder.svg`,
      }
    }))
  };
}

/**
 * 创建网站组织结构的JSON-LD结构化数据
 * @param baseUrl 网站基础URL
 * @returns JSON-LD结构化数据对象
 */
export function generateOrganizationSchema(baseUrl: string = 'https://gamecollectionhub.example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '游戏集合站',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: '提供各种免费在线游戏，让您在任何设备上都能随时享受游戏的乐趣。',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@gamestation.example.com',
      contactType: 'customer service'
    }
  };
}

/**
 * 创建整个网站的通用JSON-LD结构化数据
 * @param baseUrl 网站基础URL
 * @returns JSON-LD结构化数据对象
 */
export function generateWebsiteSchema(baseUrl: string = 'https://gamecollectionhub.example.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '游戏集合站',
    url: baseUrl,
    description: '提供各种免费在线游戏，让您在任何设备上都能随时享受游戏的乐趣。',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
} 
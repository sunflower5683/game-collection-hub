# Next.js 游戏集合站项目结构文档

## 项目概述

这是一个使用Next.js框架构建的游戏集合站点，使用iframe嵌入外部游戏内容，并针对SEO进行了优化。项目使用App Router和Tailwind CSS进行开发。

## 文件结构总览 
game-collection-hub/
├── src/ # 源代码目录
│ ├── app/ # 应用路由和页面
│ └── components/ # 可复用组件(需自行创建)
├── public/ # 静态资源文件夹
├── node_modules/ # 依赖包(自动生成)
└── 配置文件 # 各种配置文件
```

## 根目录文件详解

| 文件名 | 作用 | 详细说明 |
|--------|------|----------|
| `package.json` | 项目配置文件 | 包含项目名称、版本、依赖列表和脚本命令 |
| `package-lock.json` | 依赖锁定文件 | 确保依赖版本一致性，记录确切的依赖树 |
| `next.config.js` | Next.js配置 | 自定义Next.js行为，如路径重写、环境变量等 |
| `.eslintrc.json` | ESLint配置 | 定义代码质量规则和格式要求 |
| `.gitignore` | Git忽略配置 | 列出不需要纳入版本控制的文件和目录 |
| `tsconfig.json` | TypeScript配置 | 定义TypeScript编译选项和类型检查规则 |
| `postcss.config.js` | PostCSS配置 | 配置CSS处理工具，支持Tailwind CSS |
| `tailwind.config.js` | Tailwind配置 | 自定义Tailwind CSS的主题和扩展 |

## 源代码目录(`src/`)结构

### `src/app/` 目录

应用核心目录，使用Next.js的App Router系统。文件夹结构直接映射到URL路径。

| 文件/文件夹 | 作用 | 详细说明 |
|------------|------|----------|
| `layout.js` | 根布局组件 | 包裹所有页面的公共布局，包含HTML/body标签和共享UI元素 |
| `page.js` | 首页组件 | 网站首页的具体内容和UI |
| `globals.css` | 全局样式 | 应用于整个应用的CSS样式，包含Tailwind基础样式 |
| `其他文件夹/` | 子路由 | 每个文件夹对应一个URL路径段 |

### 页面相关的特殊文件

| 文件名 | 作用 | 位置 |
|--------|------|------|
| `page.js` | 定义路由页面 | 任何包含page.js的文件夹都成为可访问路由 |
| `layout.js` | 布局组件 | 为路由树的一部分定义共享布局 |
| `loading.js` | 加载状态UI | 路由加载时显示的组件 |
| `error.js` | 错误处理UI | 当路由出错时显示的组件 |
| `not-found.js` | 404页面 | 路径不存在时显示的页面 |

## 公共资源目录(`public/`)

用于存放静态资源文件，这些文件会被原样复制到构建输出目录。

| 文件/类型 | 作用 | 访问方式 |
|-----------|------|----------|
| 图片文件 | 网站图片 | `/图片名.扩展名` |
| SVG图标 | 矢量图标 | `/图标名.svg` |
| 字体文件 | 自定义字体 | `/fonts/字体名.扩展名` |
| `favicon.ico` | 网站图标 | 自动在根路径加载 |
| 其他静态文件 | 各类资源 | `/文件名.扩展名` |

## 理解Next.js的文件系统路由

App Router使用文件系统来定义路由，每个文件夹代表URL路径的一个部分：

- `src/app/page.js` → `/` (首页)
- `src/app/about/page.js` → `/about` (关于页面)
- `src/app/games/page.js` → `/games` (游戏列表页面)
- `src/app/games/[id]/page.js` → `/games/任意ID` (动态路由)

### 特殊文件命名约定：

- `[param]` - 动态段，如`[id]`可匹配任何值
- `[...slug]` - 捕获所有路径段，如`[...slug]`可匹配`/a/b/c`
- `(group)` - 路由分组，不影响URL路径

## 常用组件目录(需自行创建)

| 目录 | 作用 | 详细说明 |
|------|------|----------|
| `src/components/` | 可复用组件 | 存放整个应用共享的UI组件 |
| `src/lib/` 或 `src/utils/` | 工具函数 | 存放辅助函数、数据处理逻辑等 |
| `src/hooks/` | React Hooks | 自定义Hook函数 |
| `src/styles/` | 样式文件 | 组件特定样式或样式变量 |

## 主要脚本命令

| 命令 | 作用 | 何时使用 |
|------|------|----------|
| `npm run dev` | 启动开发服务器 | 本地开发时 |
| `npm run build` | 构建生产版本 | 部署前构建优化版本 |
| `npm start` | 启动生产服务器 | 在服务器上运行已构建的项目 |
| `npm run lint` | 运行代码检查 | 检查代码质量和格式问题 |

## 项目开发建议

1. **创建组件**：将UI拆分为可复用组件，放在`src/components/`目录
2. **路由组织**：利用文件夹结构组织路由，如`src/app/games/`、`src/app/about/`
3. **静态资源**：将图片、图标等放入`public/`目录
4. **样式管理**：使用Tailwind CSS类名直接在组件中添加样式
5. **SEO优化**：在每个页面组件中设置合适的元数据

## 下一步学习建议

1. 熟悉Next.js官方文档：[https://nextjs.org/docs](https://nextjs.org/docs)
2. 学习Tailwind CSS：[https://tailwindcss.com/docs](https://tailwindcss.com/docs)
3. 了解React基础：[https://react.dev/learn](https://react.dev/learn)
4. 练习创建和修改页面组件
5. 学习如何处理iframe嵌入的安全和响应式设计问题

## 游戏集合站特有功能开发

1. **游戏数据管理**：创建游戏数据结构和管理系统
2. **iframe集成**：学习如何安全地嵌入外部游戏内容
3. **SEO优化**：为每个游戏页面添加丰富的元数据和描述
4. **分类系统**：实现游戏分类和标签功能
5. **搜索功能**：添加站内游戏搜索能力
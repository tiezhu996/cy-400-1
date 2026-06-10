# 读书笔记管理桌面应用

读书笔记管理桌面应用帮助用户在本地管理书籍、Markdown 笔记、高亮摘录、标签、全文搜索、阅读统计和数据导入导出。

## 项目主要功能

- 添加书籍信息，支持书名、作者、ISBN、封面图和分类标签。
- Markdown 编辑器与实时预览，支持常见富文本语法。
- 记录高亮摘录、页码和个人批注。
- 多级标签树浏览。
- 基于 FlexSearch 的本地全文搜索，展示上下文结果。
- 阅读状态、月度阅读数量和阅读时长统计。
- CSV/JSON 导入，Markdown/JSON 导出。
- 深色/浅色主题切换并记住偏好。

## 开发环境要求

- Node.js 18+
- npm 9+

## 安装与运行

```bash
cd desktop
npm install
npm run dev
```

## 构建安装包

```bash
cd desktop
npm run build
```

构建目标覆盖 macOS `.dmg`、Windows `.exe`、Linux `.AppImage`。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 桌面 | Electron + electron-vite |
| 前端 | React 18 + TypeScript |
| UI | Tailwind CSS + Radix UI |
| 编辑器 | @uiw/react-md-editor |
| 搜索 | FlexSearch |
| 数据库 | SQLite + better-sqlite3 |
| 状态 | Zustand |

## 项目目录结构

```text
desktop
├── src
│   ├── main
│   ├── preload
│   └── renderer
├── resources
├── package.json
└── electron.vite.config.ts
```

## License

MIT

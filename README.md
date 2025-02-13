# 日语语法分析 Web App

## 项目简介

本项目是一个基于 Next.js 的 Web 应用程序，旨在帮助用户分析日语句子的语法。用户可以输入日语句子，然后通过 Gemini API 获取句子的翻译、场景推测和语法分析。最后，可以将分析结果保存到 Notion 数据库中。

## 技术栈

*   **前端：**
    *   Next.js
    *   React
    *   Material UI (MUI)
    *   `react-markdown`
*   **后端：**
    *   Node.js
    *   `@notionhq/client`
    *   `cors`
    *   `node-fetch`
*   **API：**
    *   Gemini API
    *   Notion API

## 功能特性

*   **日语句子分析：** 用户可以输入日语句子，通过 Gemini API 获取句子的翻译、场景推测和语法分析。
*   **结果展示：** 使用 `react-markdown` 组件将 Gemini API 返回的 Markdown 格式的分析结果渲染到页面上。
*   **保存到 Notion：** 用户可以将分析结果保存到 Notion 数据库中。
*   **状态提示：** 保存成功后，按钮右侧会显示“已保存”的提示信息。
*   **字体支持:** 使用 Noto Sans JP 和 Noto Sans SC 字体，提供良好的日语和中文显示效果 (frontend/app/layout.js:1-23, frontend/app/globals.css:5-13)。

## 目录结构
japanese-grammar-app/
*   app/
    *   layout.js     # 根布局文件，用于设置全局样式和字体
    *   globals.css   # 全局 CSS 样式
*   pages/
    *   api/
        *   gemini.js   # 调用 Gemini API 的后端接口
        *   notion.js   # 调用 Notion API 的后端接口
    *   index.js      # 首页，包含用户界面和交互逻辑 (frontend/pages/index.js:5-57)
    *   document.js   # 自定义 Document 文件 (如果存在)
*   public/
    *   ...           # 静态资源文件
*   .env.local        # 环境变量配置文件
*   .gitignore        # Git 忽略文件
*   next.config.js    # Next.js 配置文件 (frontend/next.config.ts:1-7)
*   package.json      # 项目依赖和脚本配置文件 (frontend/package.json:1-40)
*   README.md         # 项目说明文档
*   tailwind.config.ts # Tailwind CSS 配置文件 (如果使用)

## 环境变量

以下环境变量需要在 `.env.local` 文件中配置：

*   `GEMINI_API_KEY`：Gemini API 密钥
*   `GEMINI_API_ENDPOINT`：Gemini API 端点
*   `NOTION_API_KEY`：Notion API 密钥
*   `NOTION_DATABASE_ID`：Notion 数据库 ID

请确保不要将 `.env.local` 文件提交到代码仓库。

## 如何安装和运行项目

1.  **克隆代码仓库：**

    ```bash
    git clone <repository_url>
    ```

2.  **安装依赖：**

    ```bash
    cd japanese-grammar-app/frontend
    npm install
    ```

3.  **配置环境变量：**

    *   创建 `.env.local` 文件，并配置上述环境变量。

4.  **运行开发服务器：**

    ```bash
    npm run dev
    ```

    *   在浏览器中访问 `http://localhost:3000`。

## 如何部署项目

1.  **Vercel：**

    *   将代码仓库连接到 Vercel，Vercel 会自动构建和部署您的应用程序。
    *   在 Vercel 中配置环境变量。

2.  **其他平台：**

    *   您可以选择其他云平台，例如 Netlify、AWS、Azure 等。
    *   请参考相应平台的文档进行部署。

## 代码贡献

欢迎参与代码贡献！请按照以下步骤进行：

1.  Fork 代码仓库。
2.  创建新的分支。
3.  提交代码修改。
4.  创建 Pull Request。

## 许可证

本项目使用 MIT 许可证。
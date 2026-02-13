---
title: 我的博客创建之旅
published: 2026-02-13
description: "记录我使用 Mizuki 主题搭建个人博客的全过程，从配置到部署的完整指南。"
tags: [博客, Mizuki, Astro, 教程]
category: 教程
draft: false
---

# 我的博客创建之旅

一直想拥有一个属于自己的博客，记录学习过程和生活点滴。今天，在 AI 的帮助下，终于搭建好了这个博客！本文记录了完整的搭建过程。

## 为什么选择 Mizuki

在众多博客主题中，选择了 [Mizuki](https://github.com/matsuzaka-yuki/Mizuki) 主题，原因如下：

- **基于 Astro 框架** - 现代化的静态站点生成器，性能优异
- **功能丰富** - 内置项目展示、时间线、日记、相册等多种页面
- **界面美观** - 支持看板娘、樱花特效等二次元元素
- **易于配置** - 通过修改配置文件即可完成大部分定制

## 搭建步骤

### 1. 克隆项目

首先，将 Mizuki 主题克隆到本地：

```bash
git clone https://github.com/matsuzaka-yuki/Mizuki.git my-blog
cd my-blog
pnpm install
```

### 2. 基础配置

打开 `src/config.ts` 文件，修改网站基本信息：

```typescript
export const siteConfig: SiteConfig = {
  title: "哈基米の小窝",
  subtitle: "此猫已有哈根，可以达斯了",
  siteURL: "https://moakiee.xyz/",
  siteStartDate: "2026-02-13",
  lang: "zh_CN",
  themeColor: {
    hue: 300, // 紫粉色主题
    fixed: false,
  },
  // ...
};
```

### 3. 个人资料配置

配置头像、昵称、简介和社交链接：

```typescript
export const profileConfig: ProfileConfig = {
  avatar: "assets/images/avatar.webp",
  name: "MOAKIEE",
  bio: "此猫已有哈根，可以达斯了",
  links: [
    { name: "GitHub", icon: "fa7-brands:github", url: "https://github.com/MOAKIEE" },
    { name: "Bilibili", icon: "fa7-brands:bilibili", url: "https://space.bilibili.com/189955320" },
    // 更多链接...
  ],
};
```

### 4. 功能页面配置

Mizuki 提供了多种功能页面，按需开启：

```typescript
featurePages: {
  anime: false,    // 番剧页面
  diary: true,     // 日记页面
  friends: true,   // 友链页面
  projects: true,  // 项目页面
  skills: false,   // 技能页面
  timeline: true,  // 时间线页面
  albums: true,    // 相册页面
  devices: true,   // 设备页面
},
```

### 5. 添加项目展示

在 `src/data/projects.ts` 中添加自己的项目：

```typescript
{
  id: "me-placement-tool",
  title: "ME Placement Tool",
  description: "A Minecraft mod for Applied Energistics 2",
  category: "minecraft-mod",
  techStack: ["Java", "Minecraft", "Forge", "AE2"],
  status: "completed",
  sourceCode: "https://github.com/MOAKIEE/ME-Placement-Tool",
  liveDemo: "https://mept.moakiee.xyz/",
  startDate: "2025-12-17",
  featured: true,
},
```

### 6. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:4321/` 即可在本地预览博客。

## 部署到 Cloudflare Pages

### 1. 托管到 GitHub

首先，将博客代码推送到 GitHub 仓库：

```bash
git init
git add .
git commit -m "Initial commit: 我的博客"
git branch -M main
git remote add origin https://github.com/MOAKIEE/my-blog.git
git push -u origin main
```

### 2. 连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** > **Create application** > **Pages**
3. 选择 **Connect to Git**
4. 授权 GitHub 并选择博客仓库
5. 配置构建设置：
   - **Framework preset**: Astro
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`

### 3. 自定义域名

在 Cloudflare Pages 设置中添加自定义域名：

1. 进入项目设置 > **Custom domains**
2. 添加域名 `moakiee.xyz`
3. 按照提示配置 DNS 记录

### 4. 自动部署

每次推送到 GitHub 仓库，Cloudflare 会自动触发构建和部署：

```bash
git add .
git commit -m "更新博客内容"
git push
```

几分钟后，更新就会自动部署到 `https://moakiee.xyz/`！

## 配置心得

### 借助 AI 学习

作为一个正在学习编程的大学生，借助 AI 工具完成了博客的搭建。AI 帮助：

- 理解配置文件的结构和作用
- 快速定位和修改需要的内容
- 学习 Astro 框架的基本概念

这种方式大大提高了学习效率，能够专注于内容创作。

### 主题色选择

选择了 `hue: 300` 的紫粉色作为主题色，给人一种温柔可爱的感觉。Mizuki 支持用户自定义主题色，访问者也可以在页面上切换自己喜欢的颜色。

### 看板娘配置

保留了看板娘功能，并修改了对话内容为中文，让博客更有活力：

```typescript
dialog: {
  welcome: "欢迎来到哈基米の小窝！",
  touch: ["你在干什么呀？", "不要乱摸啦~", "嘿嘿，好痒~"],
  home: "点击这里回到首页哦~",
  close: "下次再见啦~",
},
```

## 总结

搭建博客的过程学到了很多：

1. **静态站点生成器** - 了解了 Astro 框架的工作原理
2. **配置管理** - 学会了如何组织和管理配置文件
3. **TypeScript** - 加深了对 TypeScript 类型和接口的理解
4. **借助 AI 学习** - 体验了 AI 辅助编程的高效方式
5. **CI/CD 部署** - 掌握了 Cloudflare Pages 自动部署流程

如果你也想搭建自己的博客，推荐试试 Mizuki 主题！

---

*本文使用 [Astro](https://astro.build) 框架和 [Mizuki](https://github.com/matsuzaka-yuki/mizuki) 主题构建。*

---
title: 哈基米的小窝 Live2D 升级实战：从 Mizuki 旧版到 live2d-widget-v3（moc3）
published: 2026-02-18
description: "一篇从旧版 Pio（moc）迁移到 live2d-widget-v3（moc3）的实战记录，基于哈基米的小窝（Mizuki 二次开发）给出可落地步骤。"
tags: [Mizuki, Live2D, moc3, Astro, 教程]
category: 教程
draft: false
---

> 这篇文章记录了 **哈基米的小窝** 将 **Mizuki 原模板里的旧版 Live2D（Pio + l2d.js）** 升级到 **live2d-widget-v3（支持 moc3）** 的过程。  
> 参考了这篇文章的思路，并结合本博客的 Astro 项目做了适配：  
> https://letere-gzj.github.io/hugo-stack/p/hugo/live2d-moc3/

## 为什么要升级

Mizuki 原版方案（`/public/pio/static/l2d.js + pio.js`）主要面向旧模型格式，想用 Cubism 新模型（`*.model3.json` / `*.moc3`）时不够友好。

升级到 `live2d-widget-v3` 后，核心收益：

- 支持 moc3 模型链路
- 工具栏、提示语、模型切换机制更完整
- 更容易做模型扩展（表情、动作、位置参数）
- 可以按需加载资源，避免重复注入

## 先看旧版与新版的结构差异

### 旧版（Mizuki 原模板）

- 配置在 `src/config.ts` 的 `pioConfig`：`models / width / height / dialog / mode`
- 组件在 `src/components/widget/Pio.svelte`：初始化 `new Paul_Pio(...)`
- 静态资源在 `public/pio/static/*`
- `Layout.astro` 里会直接引入 `"/pio/static/pio.css"`

### 新版（哈基米的小窝，基于 Mizuki 二次开发）

- 配置改为 `pioConfig.v3`：`modelPath / cdnBasePath / tipsJsonPath / tools / drag / switchType`
- 组件仍在 `src/components/widget/Pio.svelte`，但改为加载 `live2d-widget-v3`
- 模型与自定义资源放在 `public/pio-v3/*`
- `Layout.astro` 不再静态写死 `pio.css`，样式由组件动态加载

---

## 迁移步骤（可直接照着改）

## 1）先改 `pioConfig`，从旧字段迁移到 v3 字段

把旧配置：

```ts
export const pioConfig = {
  enable: true,
  models: ["/pio/models/pio/model.json"],
  position: "left",
  width: 280,
  height: 250,
  mode: "draggable",
  hiddenOnMobile: true,
  dialog: { ... }
}
```

迁移为（示例）：

```ts
export const pioConfig = {
  enable: true,
  v3: {
    homePath: "/",
    modelPath: "/pio-v3/Resources/",
    cdnBasePath: "https://cdn.jsdelivr.net/gh/letere-gzj/live2d-widget-v3@main",
    tipsJsonPath: "/pio-v3/waifu-tips.laffey.json",
    tools: ["hitokoto", "express", "photo", "info", "quit"],
    drag: {
      enable: false,
      direction: ["x", "y"],
    },
    switchType: "order",
  },
};
```

> 本博客中，这段配置就在 `src/config.ts`。

## 2）重写 `Pio.svelte` 初始化逻辑

旧版是：

- 先加载 `/pio/static/l2d.js`
- 再加载 `/pio/static/pio.js`
- 然后 `new Paul_Pio(...)`

新版改成：

- 动态加载 `waifu.css`
- 动态加载 `live2dcubismcore.js`、`live2d-sdk.js`、`waifu-tips.js`
- 调用 `window.initWidget({...})`

关键点：

```ts
window.initWidget({
  homePath,
  waifuPath: tipsJsonPath,
  cdnPath: modelPath,
  tools,
  dragEnable,
  dragDirection,
  switchType,
});
```

并且要做两件事：

- 资源去重（避免页面切换后重复插入脚本）
- 对 `swup:page:view` 做样式与位置恢复

> 本博客当前的完整实现可直接参考：`src/components/widget/Pio.svelte`。

## 3）把旧版静态 CSS 引用从 Layout 移除

如果你沿用了原模板，`Layout.astro` 里通常有：

```astro
<link rel="stylesheet" href="/pio/static/pio.css" />
```

升级后建议移除，统一由 `Pio.svelte` 动态加载 v3 的样式，避免旧样式污染。

## 4）准备 `public/pio-v3` 目录

至少包含：

- `Resources/model/...`（模型文件）
- `Resources/model_list.json`
- `waifu-tips.xxx.json`（你的提示语）
- `live2d-overrides.css`（可选：强制位置、层级等）

本博客当前项目路径如下：

```txt
public/pio-v3/
  Resources/
  waifu-tips.laffey.json
  live2d-overrides.css
```

## 5）模型扩展：表情、动作、尺寸

这部分和参考文章一致，迁移时最常用三项：

### A. 调整模型位置和大小

给模型目录加 `config.json`：

```json
{
  "scale": 1.0,
  "translate": {
    "x": 0.0,
    "y": 0.0
  }
}
```

### B. 表情（`exp3.json`）

在 `model3.json` 的 `FileReferences.Expressions` 中声明表情列表。

### C. 动作（`motion3.json`）

在 `FileReferences.Motions` 中配置 `Idle` 或 `TapBody` 动作组。

---

## 常见坑点

- **移动端判断不一致**：旧版常用 `max-width: 1280px`，新版示例使用的是 `screen.width < 768`，要统一策略。
- **路径混用**：`modelPath` 指向的是包含 `model_list.json` 的资源根目录，不是单个模型文件。
- **重复注入脚本**：页面切换后不做去重会导致初始化异常或工具栏重复。
- **提示语 JSON 路径错误**：`waifuPath` 404 时常见现象是模型出现但对话不出现。

## 性能优化建议

可把模型里的贴图从 PNG 转为 WebP，并在 `model3.json` 更新贴图路径。体积通常会明显下降，首次加载更快。

## 验收清单

升级完成后至少确认这 6 项：

- 桌面端正常显示模型
- 工具栏按钮可用（`hitokoto / express / photo / info / quit`）
- 页面切换后模型不会丢失样式
- 模型切换与换装正常
- 表情与动作可触发（如果有配置）
- 移动端符合你的显示策略

## 参考

- 参考教程（思路来源）：https://letere-gzj.github.io/hugo-stack/p/hugo/live2d-moc3/
- 组件项目：`live2d-widget-v3`（letere-gzj）
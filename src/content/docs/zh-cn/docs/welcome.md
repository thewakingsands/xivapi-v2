---
title: 欢迎
description: XIVAPI 及其功能简介。
---

XIVAPI 是一个全面、现代的，用于获取最终幻想 14 游戏数据的 Web API。无论简单的悬浮窗，还是完整的数据库应用，XIVAPI 都能为您提供强大且可靠的数据源。

本服务是 [XIVAPI](https://v2.xivapi.com) 的部分兼容实现，使用前请您阅读[与官方版本的差异](/zh-cn/docs/guides/difference/)。如果您遇到了本服务的相关问题，请[提交反馈](https://github.com/thewakingsands/xivapi-v2/issues/new)。与 XIVAPI 官方版本有关的问题可加入[Discord 服务器](https://discord.gg/MFFVHWC)咨询。

## 功能特性

本服务通过 HTTP 提供已发布的 FFXIV 表格数据、图标和地图，并不提供所有游戏文件，具体请参阅[服务限制](/zh-cn/docs/guides/difference/)。

亮点包括：

- **[固定模式](/zh-cn/docs/guides/pinning/)：** 可以将字段名称和映射固定到某个模式修订版。表格数据始终使用本地最新发布版本，因此固定模式不会冻结底层游戏数据。
- **[全数据集搜索](/zh-cn/docs/guides/search/)：** 任何字段都可以用于搜索查询和过滤器，以帮助找到您要查找的内容——即使没有人知道它的含义！
- **[开源构建](/zh-cn/docs/software/)：** API、其依赖项以及 FFXIV 开发者生态系统的很大一部分都是开源的。看看它是如何工作的，或者加入并伸出援手！

## 它不是什么

API **只能**提供在游戏客户端文件中找到的数据。它无法访问玩家、部队等服务端信息，也无法获取库存、装备等运行时信息。

如果您希望访问这些数据，可以在[软件页面](/zh-cn/docs/software/#alternatives)查找替代方案。

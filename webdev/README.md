# 校园卡信息查询平台 - 前端模块

> &#x1F3B8; 基于Vue.js、Vux、Vue Router以及ECharts开发

## 要求

  + Node.js v8+
  + 查询平台后台已启动

## 安装 / 开始开发

```bash
  # 安装依赖
  $ cd webdev
  $ npm install

  # 启动开发模式
  $ npm run dev
```

> &#x26A0; Tips：应用将会运行在 [http://localhost:8080](http://localhost:8080)

## 相关技术栈

  + Vue.js
  + Vux
  + Webpack
  + Vue Router
  + ECharts
  + axios
  + Babel

## 目录结构

```bash
  . webdev
  ├── build                     # Webpack 及 Vue Loader 相关配置项
  ├── config                    # 配置选项
  ├── dist                      # 编译后的文件
  ├── src                       # 源文件
  │   ├── assets                # 图像资源
  │   ├── components            # 组件
  │   ├── script                # 脚本（存放 ECharts 定制化代码）
  │   ├── views                 # 页面
  │   ├── App.vue               # 主页面
  │   └── main.js               # 主脚本文件
  ├── static                    # 静态资源目录
  ├── .babelrc                  # Babel 配置项
  ├── .editorconfig             # 编辑器配置项
  ├── .eslintignore             # ESLint 忽略文件列表
  ├── .eslintrc                 # ESLint 配置文件
  ├── .gitignore                # Git 忽略文件列表
  ├── .postcssrc.js             # PostCSS 配置文件
  ├── index.html                # 主 HTML 文件
  ├── package-lock.json         # 包依赖锁定文件
  ├── package.json              # 包描述文件
  └── README.md                 # 本说明文档
```

## 整体设计思路简述

  + 我们将整个前端页面划分为四个模块&#x1F355;：
    - 基本信息（个人信息，余额信息，更新时间）卡片
    - 四六级一键报名卡片
    - 七日消费折线图
    - 一月内消费记录
  + 采用组件化开发，将四个模块作为四个组件，通过 `props` 以及事件来传递数据
  + 用一个 `view ` -> `BalanceInfo.vue` 将四个组件连接起来
    - 在这个 `view` 中对数据进行获取（axios），处理（减轻服务器负担），并分发给组件，同时使用 `localStorage` 对数据进行持久化处理
    - 主 `view` 界面需要有登录窗口，错误提示
  + 有另一个 `view` -> `CET.vue` 负责展示四六级一件缴费的界面
    - 使用 Vue Router 将主 `BalanceInfo.vue` 中的四六级缴费卡片与这个页面连接起来，页面切换需要有动画过渡，我们使用 `transition`
    - 该页面也需要有登录窗口，错误提示

> &#x26A0; Tips：欢迎在我的 [GitHub Issue](https://github.com/BlueSky1997AL/neau-card/issues) 页沟通交流并提出您的宝贵建议，您的建议是我成长的动力来源 &#x1F603;

## 开发模式跨域解决方案

在开发过程中，由于采用了前后端分离开发的方法，使得后端（Egg.js - 7001端口）与前端（Vue.js - 8080端口）产生了跨域问题 &#x1F4A2;  
&#x1F4A1; 解决方案：在 Vue.js 的 dev 环境配置中加入 `proxyTable` 设置以转发前端路由，解决跨域问题

```js
  // config/inedx.js
    ...
    module.exports = {
      ...
      dev: {
        ...
        // 在 dev 中添加 proxyTable 相关配置即可
        proxyTable: {
          // 转发 /api 路由到 7001 端口
          '/api': {
            target: 'http://localhost:7001',
            changeOrigin: true
          }
        }
      }
    }
```

> &#x26A0; Tips：在生产环境中，将已编译好的文件合并入后端系统中时不会出现跨域问题，因为前端请求路由与后端路由处于同一域名和端口下。此处的跨域问题仅出现在开发过程中

## 生产环境

&#x1F4E6; 在生产环境中发布，需要先对项目进行编译

```bash
  # 生产环境编译
  $ npm run build

  # 如果您需要查看 bundle analyzer 报告，也可以加上 --report 参数
  $ npm run build --report
```

编译成功后，将 `dist` 目录中编译好的文件转移至后端静态资源文件夹中即可  
看起来，我们做的很棒  
但是由于服务器带宽的限制 &#x26D4; ，以及并发时过多网络请求对服务器性能的消耗，这样的部署方式效果并不理想。因为我们将一些不必要的工作交给了服务器，消耗了服务器的资源，说白了，这样做有点大材小用，造成页面访问响应慢，服务器负载大  
因此，我们需要将静态资源文件的托管交给CDN，也就是下一部分我们需要讨论的内容 &#x1F447;

## CDN 加速

&#x1F680; 出于用户体验及服务器性能考虑，我们仅将编译好的 `index.html` 文件托管在了后端服务器中，将其中的所有资源链接修改指向了 CDN ，并将这些资源托管在了又拍云云存储中（非广告）

网站响应速度快了，服务器负载也小了！&#x1F389;

## 缓存问题

&#x1F4D1; 由于该平台还以 Webview 的形式嵌于“东农校内”微信小程序中，每次平台的迭代更新都会因为小程序的 Webview 缓存而出现问题

对于此问题，我们决定将访问静态资源方式

```bash
  https://card.xiaonei.io/index.html
```

改为访问路由并加入随机字符串参数的方式阻止缓存

```bash
  https://card.xiaonei.io/?rand=${Math.random()}
```

## ToDos

  + 折线图有待加入更为实用的功能

## 代码风格指南

  + 该项目使用 [ESLint Standard 标准](https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style)

## 其他

  + &#x1F4CD; 如果您有任何好的建议或想法，欢迎在我的 [GitHub Issue](https://github.com/BlueSky1997AL/neau-card/issues) 中交流探讨
  + &#x1F4E7; 您也可以向我发送邮件以取得联系： blue_sky1997@live.com

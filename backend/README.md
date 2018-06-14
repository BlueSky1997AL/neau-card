# 校园卡信息查询平台 - 后端模块

> &#x1F373; 基于egg.js、axios、cheerio以及MongoDB开发

## 要求

  + Node.js v8+
  + MongoDB 数据库已启动，运行端口27017

## 安装 / 开始开发

```bash
  # 安装依赖
  $ cd backend
  $ npm install

  # 启动开发模式
  $ npm run dev
```

> &#x26A0; Tips：应用将会运行在 [http://localhost:7001/](http://localhost:7001/)

## 部署

```bash
  $ npm start
  $ npm stop
```

## NPM Scripts

  + 使用 `npm run lint` 检查代码风格
  + 使用 `npm test` 运行单元测试
  + 使用 `npm run autod` 自动检测依赖升级， 更多信息请参考 [autod](https://www.npmjs.com/package/autod)

## 框架配置

```js
  // config/confg.default.js
    ...
    // 爬虫登录网站地址
    config.login = {
      serverUrl: 'http://card.neau.edu.cn/',
    };

    // http request 选项，内网代理配置
    config.curlOpts = {
      enableProxy: true,
      proxy: 'http://neauproxy.feit.me:6000',
      timeout: [ '30s', '30s' ],
    };

    // 静态资源托管配置
    config.static = {
      prefix: '/',
    };

    // Mongoose 连接配置
    config.mongoose = {
      client: {
        url: 'mongodb://127.0.0.1/neau_card',
        options: {},
      },
    };
    ...
```

```js
  // conig/plugin.js
    ...
    // Mongoose 插件配置
    exports.mongoose = {
      enable: true,
      package: 'egg-mongoose',
    };
    ...
```

## 代码风格指南

  + 该项目使用 [ESLint Config Egg 标准](https://github.com/eggjs/eslint-config-egg)

## 存在问题

  + 由于官方校园卡查询平台响应缓慢&#x1F6B6;，导致我们的查询平台用户体验不尽如人意&#x1F494;。虽然我们对查询算法做过很多优化，提高了不少查询速度，但是还是令人不满意

## ToDos

  + 对 Cookie 进行复用，以减少用户登录次数，优化用户体验
  + 对四六级一键报名用户信息进行跟踪记录
  + 平台日志及操作记录

## 其他

  + &#x1F4CD; 如果您有任何好的建议或想法，欢迎在我的 [GitHub Issue](https://github.com/BlueSky1997AL/neau-card/issues) 中交流探讨
  + &#x1F4E7; 您也可以向我发送邮件以取得联系： blue_sky1997@live.com

-------------------------------------------------------------------

## API Reference

### **GET /**

> *主页*

**响应**

```
  HTML Document
```
<br>

### **GET /api/cookie**

> *获取 Cookie, 用于获取验证码和登录*

**响应**

```js
  String
```
<br>

### **GET /api/captcha**

> *获取验证码*

|参数   |类型    |是否必须|描述      |
|------|--------|------|----------|
|cookie|`String`|`true`|Cookie 信息|

**响应**

```js
  Buffer
```
<br>

### **GET /api/login**

> *登录*

|参数     |类型    |是否必须|描述      |
|--------|--------|------|----------|
|cookie  |`String`|`true`|Cookie 信息|
|username|`String`|`true`|用户名     |
|password|`String`|`true`|密码       |
|chkCode |`String`|`true`|验证码     |

**响应**

```js
  { status: String, msg: String }
```
<br>


### **GET /api/basicInfo**

> *获取用户基本信息（余额及过渡余额等）*

|参数     |类型    |是否必须|描述                |
|--------|--------|------|--------------------|
|cookie  |`String`|`true`|登陆成功的 Cookie 信息|

**响应**

```js
  {
    accountId: String,
    stuId: String,
    balance: String,
    transBalance: String
  }
```
<br>

### **GET /api/dailyRecords**

> *获取用户当天消费细则*

|参数      |类型    |是否必须|描述                |
|---------|--------|------|--------------------|
|cookie   |`String`|`true`|登录成功的 Cookie 信息|
|accountId|`String`|`true`|账户ID（非用户名）    |

**响应**

```js
  [
    {
      stuId: String,
      tradeDate: String,
      firmName: String,
      transactionType: String,
      cost: String,
      balance: String,
    },
    ...
  ]
```
<br>

### **GET /api/records**

> *根据日期区间查询用户历史流水信息*

|参数      |类型    |是否必须|描述                |
|---------|--------|------|--------------------|
|cookie   |`String`|`true`|登录成功的 Cookie 信息|
|accountId|`String`|`true`|账户ID（非用户名）    |
|startDate|`String`|`true`|查询开始日期          |
|endDate  |`String`|`true`|查询结束日期          |

**响应**

```js
  {
    totalCost: String || Number,
    records: [
      {
        stuId: String,
        tradeDate: String,
        firmName: String,
        transactionType: String,
        cost: String,
        balance: String,
      },
      ...
    ]
  }
```
<br>

### **GET /api/cet**

> *获取用户四六级个人信息及缴费信息*

|参数     |类型    |是否必须|描述                |
|--------|--------|------|--------------------|
|cookie  |`String`|`true`|登录成功的 Cookie 信息|

**响应**

```js
  {
    stuInfo: {
      stuId: String,
      name: String,
      class: String,
      gender: String,
      idNo: String,
      lang: String,
      category: String,
      fee: String,
      status: String
    } || null,
    linkId: String || null
  }
```
<br>

### **GET /api/payForCET**

> *缴费操作*

|参数     |类型    |是否必须|描述                |
|--------|--------|------|--------------------|
|cookie  |`String`|`true`|登陆成功的 Cookie 信息|
|id      |`String`|`true`|缴费操作的ID值        |
|passwd  |`String`|`true`|登录密码             |

**响应**

```js
  { msg: String }
```
<br>

### **GET /api/usrInfo**

> *用于微信小程序 - 根据微信客户端传来的 Token 信息获取用户基本信息*

|参数  |类型    |是否必须|描述     |
|-----|--------|------|---------|
|token|`String`|`true`|Token 信息|

**响应**

```js
  Object
```
<br>

### **GET /api/widget/info**

> *用于微信小程序 - 根据微信客户端传来的 Token 信息获取用户当日流水，余额，更新日期等信息*

|参数  |类型    |是否必须|描述      |
|-----|--------|------|----------|
|token|`String`|`true`|Token 信息|

**响应**

```js
  {
    status: Boolean,
    balance: Number,
    transBalance: Number,
    updateAt: Date,
    weeklyCost: Number,
    dailyRecords: Array
  }
```
<br>

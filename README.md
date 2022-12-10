# ChatGPT Web

Multi-user h5 version, 3rd party ChatGPT web page. Uses OpenAPI official API.

第三方ChatGPT H5客户端，借助OpenAPI官方API实现。

**在线体验地址：** <https://chat.wyr.me>

Back-end repository（后端代码仓库）: <https://github.com/yi-ge/chatgpt-api>

本项目旨在降低中国大陆用户体验ChatGPT的成本。

文档还很乱，后面完善，先给个star吧。

## Feature

- 部署后可实现在中国大陆访问进行ChatGPT体验
- 支持多账号、多用户
- 足够简单，易于修改（前端代码200行，后端代码130行）
- 支持代码显示

## Preview

![screenshot](screenshot/preview.jpg)

## 开发

参照`.env.example`，新建`.env.development`文件，配置好环境变量。

```bash
yarn start
```

## 部署

参照`.env.example`，新建`.env`文件，配置好环境变量。

```bash
yarn build
```

`build`文件夹中即为编译后的静态资源文件。

## Disclaimers 免责声明

This is not an official OpenAI product. This is a personal project and is not affiliated with OpenAI in any way. Don't sue me.
这不是官方的 OpenAI 产品。这是一个个人项目，与 OpenAI 没有任何关系。别告我。

The code is for demo and testing only.
代码仅用于演示和测试。

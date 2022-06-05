## azure 配置

- Azure active directory
- Create the app registration

refer: https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration

## client

spa 这块的逻辑，azure 提供了各个框架的 sdk，可以直接调接口。

为了演示逻辑，这里的代码没有用 sdk，直接用的请求接口的逻辑。

注意下面用的是 auth code flow

步骤有如下几个：
1. 请求 /authorize 接口，重定向到 azure，用户登陆，重定向回来，拿到 code
2. 请求 /token 接口，拿到 access_token, refresh_token, id_token
3. 后续可以用 access_token 调 azure grpah api，拿到 azure 资源相关信息
4. 可以用 refresh_token 再次调 /token 接口，更新 token
5. 可以用 id_token 发给后端，后端 jwt 解析后做验证

上面一个操作的接口文档参考：https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

```
cd client
npm i
npm run dev
```

go to `http://localhost:3000`

## run server

`http://localhost:8080`

server 的角色是，看到用户 token，校验 token 是否有效，然后判断 token 包含的角色权限信息，确认对 api 是否有有效的访问权。

## OAuth 2.0

例如 Tom 正在访问一个网站 A，网站 A 需要你存储在网站 B 的数据来完成处理任务，此时 Tom 如何授权网站 A 拿到你在 B 上的数据？

肯定不能直接把 Tom 的 twitter username/password 发给网站 A。OAuth 就是为了解决这个问题。

OAuth 2.0 就是解决如何你如何授权 A 网站访问你在 B 网站数据的协议。

先理解几个概念：
- Resource Owner，这个就是数据的所有权人，对应上面例子的 Tom
- Client，需要请求数据的应用，对应上面的网站 A
- Authorization Server，授权服务器，对应上面的网站 B
- Resource Server，数据服务器，也对应上面的网站 B

注意这里 Authorization Server 和 Resource Server 可能不同，也可以相同。

OAuth 2.0 协议中定义的交互流程一共有四种，分别对应不同的情况：
- Authorization Code
- Implicit
- Resource Owner Password Credentials
- Client Credentials

但是基于安全考虑，OAuth 2.0 Security Best Current Practice 推荐使用 Authrization Code Flow。

1. Client 重定向到 Authorization Server 的 `/authorize` 授权页面
2. Resource Owner 输入 username/password
3. Authorization Server 重定向回 Client，并带上 Authrization code
4. Client 发送 Authorization Code 给 Authorization Server 的 `/token` 地址
5. Authrization Server 返回 access_token + refresh_token
6. Client 基于 access_token 请求 Resource Server，获取到授权的数据

## Openid Connect

OAuth 2.0 解决了授权（Authrization）的问题。Openid Connect 是对 OAuth 2.0 协议的一个扩充，用于解决认证（Authentication） 的问题。

继续以 Tom 为例，现在 Tom 想要登陆 A 网站，A 网站觉得自己实现一套用户密码系统太麻烦，想要直接利用 Tom 的别的账户（例如 Gmail/Github 等）来直接登陆。这其实就是我们经常见到的场景，我们使用使用 Gmail 账户来登陆非常多的网站，这种登陆的逻辑就是基于 Openid Connect 协议。

使用前面 OAuth 2.0 的概念，假设现在 Authrization Server 实现了 Openid Connect 可以，此时就不仅仅是授权，而是也提供了认证的功能，因此此时这个角色在 Openid Connect 中被称为 Identity Provider。

Openid Connect 实现了一个账户登陆多个应用的功能，因此这种登陆方式也被称为 single sign-on (SSO)。

下面来看 Openid Connect 的实现逻辑。

在 OAuth2.0 中，第一步是 Client 重定向到 Authorization Server 的 `/authorize` 授权页面。这个时候其实需要传递很多参数，其中一个参数是 `scope`。`scope` 的作用可以理解为，网站 A 想要访问 Tom 在网站 B 的哪些内容。因此 `scope` 可以起到控制授权范围的作用。Openid Connect 中，需要在 scope 中增加一个 openid 字段。这样，之后请求获取 access_token 的同时， Authorization Server 也会返回一个称为 id_token 的东西。

id token 是 jwt 格式，内部包含了用户名、权限、角色等信息，可以用作鉴权使用。

## OAuth 2.0

Tom さんはウェブサイトAがアクセスしている。
例えば、ウェブサイトAが、ウェブサイトBに保存されているTomさんデータにアクセスする必要がある場合。
Tom さんはどのようにこのアクセスすることを許可するのでしょうか？
OAuth2.0 は、この認証の問題を解決するためのプロトコルです。

まずは、OAuth2.0 の概念を理解することから始めましょう。
- Resource Owner，これはデータの所有者であり、上記の例では　Tom さんに相当します
- Client，これは、データをリクエストするためのアプリです、上記の例では、サイトAに対応します
- Authorization Server，これは、認可サーバーです、上記の例では、サイトBに相当します
- Resource Server，これは、リソースばーです、上記の例は、サイトBにも対応します

ここで、認証サーバとリソースサーバは異なる場合もあれば、同じ場合もあることに注意してください。

OAuth2.0 プロトコルです、異なる状況に対応する4種類のフローを定義されています。
- Authorization Code
- Implicit
- Resource Owner Password Credentials
- Client Credentials

ここでは、Authorization Code Flow を説明します。

以下のステップがある：
1. /authorizeエンドポイントをリクエストし、azureにリダイレクトした後，ユーザはログインできたら、またリダイレクトされ，クライアント側はauth_codeを取得する。
2. /tokenエンドポイントをリクエストし、access_token, refresh_token, id_tokenを取得する
3. access_tokenを用いて、azure grpah apiをリクエストし， azureの関連リソースを取得できる
4. refresh_tokenを用いて、再度 /tokenエンドポイントをアクセスし、tokenを更新する
5. id_tokenをバックエンドを送り、バックエンドはjwtを解析後に、認証を行える

## Openid Connect

OAuth 2.0 は Authrization の問題を解決します。
OpenID Connect は、Authentication の問題を解決ために、OAuth 2.0 プロトコルを拡張したものです。

继续以 Tom 为例，现在 Tom 想要登陆 A 网站，A 网站觉得自己实现一套用户密码系统太麻烦，想要直接利用 Tom 的别的账户（例如 Gmail/Github 等）来直接登陆。这其实就是我们经常见到的场景，我们使用使用 Gmail 账户来登陆非常多的网站，这种登陆的逻辑就是基于 Openid Connect 协议。

使用前面 OAuth 2.0 的概念，假设现在 Authrization Server 实现了 Openid Connect 可以，此时就不仅仅是授权，而是也提供了认证的功能，因此此时这个角色在 Openid Connect 中被称为 Identity Provider。

Openid Connect 实现了一个账户登陆多个应用的功能，因此这种登陆方式也被称为 single sign-on (SSO)。

下面来看 Openid Connect 的实现逻辑。

在 OAuth2.0 中，第一步是 Client 重定向到 Authorization Server 的 `/authorize` 授权页面。这个时候其实需要传递很多参数，其中一个参数是 `scope`。`scope` 的作用可以理解为，网站 A 想要访问 Tom 在网站 B 的哪些内容。因此 `scope` 可以起到控制授权范围的作用。Openid Connect 中，需要在 scope 中增加一个 openid 字段。这样，之后请求获取 access_token 的同时， Authorization Server 也会返回一个称为 id_token 的东西。

id token 是 jwt 格式，内部包含了用户名、权限、角色等信息，可以用作鉴权使用。

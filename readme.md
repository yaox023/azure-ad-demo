## azure コンフィグレーション

- Azure active directory
- Create the app registration

refer: https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration

## client

spaの実装に関しては、azureは各フレームワークのSDKを提供しているので、それらのインターフェースを使用すればいい。

OIDCの流れを明確に示すため、こちらはSDKをあえて使用せずに、直接にAzureを呼び出している。

本デモは auth_codeフローを使用している。

以下のステップがある：
1. /authorizeエンドポイントをリクエストし、azureにリダイレクトした後，ユーザはログインできたら、またリダイレクトされ，クライアント側はauth_codeを取得する。
2. /tokenエンドポイントをリクエストし、access_token, refresh_token, id_tokenを取得する
3. access_tokenを用いて、azure grpah apiをリクエストし， azureの関連リソースを取得できる
4. refresh_tokenを用いて、再度 /tokenエンドポイントをアクセスし、tokenを更新する
5. id_tokenをバックエンドを送り、バックエンドはjwtを解析後に、認証を行える

Azure ADのオフィシャルドキュメントに基づき、作成した。

doc: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

```
cd client
npm i
npm run dev
```

go to `http://localhost:3000`

## run server

`http://localhost:8080`

serverのロールは、ユーザのtokenを送られたら、tokenの有効性を検証し、tokenに含まれるロール権限情報を取得できる。また、それを用いて、APIへの認可を行える。

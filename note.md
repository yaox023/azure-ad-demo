

1. spa 验证，使用下面链接用到的 java 库来验证
https://ordina-jworks.github.io/security/2020/08/18/Securing-Applications-Azure-AD.html#azure-starters-for-spring-boot

2. 配置 expose api 的作用
这里的说法，似乎是使用的 access_token，然后配置 expose api
https://xsreality.medium.com/making-azure-ad-oidc-compliant-5734b70c43ff

3. resources server 验证，到底验证的是 access token 还是 id token

4. role/group 到底如何验证，下面用的 webapp 验证的例子
https://ordina-jworks.github.io/security/2020/08/18/Securing-Applications-Azure-AD.html#azure-starters-for-spring-boot


这个页面演示了如何在 springboot 中使用 springsecurity 来验证 role
https://stackoverflow.com/questions/68693386/using-user-roles-in-resource-server-to-restrict-acces-on-path

这里是 nodejs 验证 role/group 的完整例子
https://docs.microsoft.com/en-us/azure/active-directory/develop/sample-v2-code

这里是 springboot 的 example
https://github.com/Azure-Samples/azure-spring-boot-samples

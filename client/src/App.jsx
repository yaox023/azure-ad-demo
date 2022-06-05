import { useEffect, useState } from 'react';

// configured in azure ad portal
const tenantId = "25c97843-7dfd-4037-9fc8-4c585dd37ea5";
const clientId = "0640ca50-1722-4f48-9392-b9e2a1f1e0fa";

// can be found in azure portal
const authorizationEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
const apiEndpoint = "http://localhost:8080/authorized"; // 后端服务接口

// I generate a example verifier and challenge first
// should be generate dynamically
// refer to this blog to see how to generate them in js: https://www.valentinog.com/blog/challenge/
const codeVerifier = "ThisIsntRandomButItNeedsToBe43CharactersLong";
const codeChallenge = "ocYCWfMwcSjWZok91g7EAZsKLdqPI7Nn_qoUWIdHHM4";
const redirectUri = "http://localhost:3000";

// random string
const state = "123456";

// openid for openid connect
// 
// const scope = "profile openid email api://0640ca50-1722-4f48-9392-b9e2a1f1e0fa/app";
const scope = "user.read profile openid email";

// 重定向到 azure 登陆页面，请求用户登陆
const authorizeRequest = () => {
	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		response_type: "code",
		scope,
		state,
	});
	location.href = authorizationEndpoint + "?" + params.toString();
};

// used to get access/refresh/id token
const tokenRequest = async (code) => {
	const params = new URLSearchParams({
		client_id: clientId,
		code: code,
		redirect_uri: redirectUri,
		code_verifier: codeVerifier,
		grant_type: "authorization_code",
		scope,
	});

	return fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"content-type": "application/x-www-form-urlencoded",
		},
		body: params
	}).then(res => res.json());

};


// 请求后端接口，传入 id token 用作鉴权
const apiRequest = async (token) => {
	return fetch(apiEndpoint, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then(r => r.text());
};


// use access token to request user information in azure
const refreshTokenRequest = async (refresh_token) => {
	const params = new URLSearchParams({
		client_id: clientId,
		grant_type: "refresh_token",
		refresh_token: refreshToken,
		scope,
	});

	return fetch(tokenEndpoint, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"content-type": "application/x-www-form-urlencoded",
		},
		body: params
	}).then(res => res.json());
};

function App() {

	const [tokens, setTokens] = useState({});
	const [apiRes, setAPIRes] = useState("");

	// monitor url, if there is code and state parameters and state is right
	// then run the access request
	useEffect(() => {
		const url = new URL(location.href);
		if (!url.searchParams.has("code") ||
			!url.searchParams.has("state") ||
			url.searchParams.get("state") !== state
		) {
			authorizeRequest();
			return;
		}

		tokenRequest(url.searchParams.get("code"))
			.then(tokens => {
				setTokens(tokens);
				return tokens.id_token;
			})
			.then(id_token => {
				return apiRequest(id_token);
			})
			.then(res => setAPIRes(res))
			.catch(e => console.error(e));

	}, []);


	return (
		<div className="App">
			<div>
				<pre>{JSON.stringify(tokens, null, 2)}</pre>
				<div>{apiRes}</div>
			</div>
		</div>
	);
}

export default App;

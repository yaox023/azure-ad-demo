import { useEffect, useState } from 'react';

// configured in azure ad portal
const tenantId = "25c97843-7dfd-4037-9fc8-4c585dd37ea5";
const clientId = "0640ca50-1722-4f48-9392-b9e2a1f1e0fa";

// can be found in azure portal
const authorizationEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
const apiEndpoint = "http://localhost:8080/api"; // 后端服务接口

// I generate a example verifier and challenge first
// should be generate dynamically
// refer to this blog to see how to generate them in js: https://www.valentinog.com/blog/challenge/
const codeVerifier = "ThisIsntRandomButItNeedsToBe43CharactersLong";
const codeChallenge = "ocYCWfMwcSjWZok91g7EAZsKLdqPI7Nn_qoUWIdHHM4";
const redirectUri = "http://localhost:3000";

// random string
const state = "123456";

// openid for openid connect
const scope = "user.read profile openid email";

function App() {

	const [accessToken, setAccessToken] = useState("");
	const [refreshToken, setRefreshToken] = useState("");
	const [idToken, setIdToken] = useState("");

	// used to get authorization code
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

	// monitor url, if there is code and state parameters and state is right
	// then run the access request
	useEffect(() => {
		const url = new URL(location.href);
		if (!url.searchParams.has("code")) return;
		if (!url.searchParams.has("state")) return;
		if (url.searchParams.get("state") !== state) return;
		const params = new URLSearchParams({
			client_id: clientId,
			code: url.searchParams.get("code"),
			redirect_uri: redirectUri,
			code_verifier: codeVerifier,
			grant_type: "authorization_code",
			scope,
		});

		// used to get access/refresh/id token
		fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: params
		})
			.then(res => res.json())
			.then(res => {
				setAccessToken(res.access_token);
				setRefreshToken(res.refresh_token);
				setIdToken(res.id_token);
			})
			.catch(e => {
				console.error(e);
			});
	}, []);

	const resourcesRequest = () => {
		fetch(graphEndpoint, {
			headers: {
				"Authorization": `Bearer ${accessToken}`
			}
		})
			.then(res => res.json())
			.then(res => {
				console.log(res);
			});
	};

	// use access token to request user information in azure
	const refreshTokenRequest = () => {
		const params = new URLSearchParams({
			client_id: clientId,
			grant_type: "refresh_token",
			refresh_token: refreshToken,
			scope,
		});

		fetch(tokenEndpoint, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"content-type": "application/x-www-form-urlencoded",
			},
			body: params
		})
			.then(res => res.json())
			.then(res => {
				setAccessToken(res.access_token);
				setRefreshToken(res.refresh_token);
				setIdToken(res.id_token);
			})
			.catch(e => {
				console.error(e);
			});
	};

	const apiRequest = () => {
		// demo 演示，直接传 token 给后端
		fetch(apiEndpoint + "?token=" + idToken)
			.then(r => r.text())
			.then(r => {
				console.log(r);
			})
			.catch(e => {
				console.error(e);
			});
	};

	// monitor to see token change
	useEffect(() => {
		console.log({ accessToken });
	}, [accessToken]);
	useEffect(() => {
		console.log({ refreshToken });
	}, [refreshToken]);
	useEffect(() => {
		console.log({ idToken });
	}, [idToken]);

	return (
		<div className="App">
			<div>
				<button onClick={authorizeRequest}>authorizeRequest</button>
				<button onClick={resourcesRequest}>resourcesRequest</button>
				<button onClick={refreshTokenRequest}>refreshTokenRequest</button>
				<button onClick={apiRequest}>api request</button>
			</div>
		</div>
	);
}

export default App;

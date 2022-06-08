import { useEffect, useState } from 'react';
import "./App.css";

// configured in azure ad portal
const tenantId = "25c97843-7dfd-4037-9fc8-4c585dd37ea5";
const clientId = "0640ca50-1722-4f48-9392-b9e2a1f1e0fa";
const redirectUri = "http://localhost:3000";

// can be found in azure portal
const authorizationEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
const logoutEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${redirectUri}`;
const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
const publicAPIEndpoint = "http://localhost:8080/public";
const privateAPIEndpoint = "http://localhost:8080/private";

// I generate a example verifier and challenge first
// should be generate dynamically
// refer to this blog to see how to generate them in js: https://www.valentinog.com/blog/challenge/
const codeVerifier = "ThisIsntRandomButItNeedsToBe43CharactersLong";
const codeChallenge = "ocYCWfMwcSjWZok91g7EAZsKLdqPI7Nn_qoUWIdHHM4";

// random string
const state = "123456";

// openid for openid connect
// 
// const scope = "profile openid email api://0640ca50-1722-4f48-9392-b9e2a1f1e0fa/app";
const scope = "user.read profile openid email";

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

const logoutRequest = () => {
	location.href = logoutEndpoint;
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
	});
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

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [tokens, setTokens] = useState({});
	const [publicAPIResult, setPublicAPIResult] = useState("");
	const [privateAPIResult, setPrivateAPIResult] = useState("");

	const handleLoginLogout = async () => {
		if (isLoggedIn) {
			logoutRequest();
		} else {
			authorizeRequest();
		}
	};

	const handlePublicReq = async () => {
		const res = await fetch(publicAPIEndpoint);
		const text = await res.text();
		setPublicAPIResult(text);
	};

	const handlePrivateReq = async () => {
		try {
			if (tokens.id_token) {
				const res = await fetch(privateAPIEndpoint, {
					headers: {
						"Authorization": `Bearer ${tokens.id_token}`
					}
				});
				const text = await res.text();
				setPrivateAPIResult(text);
			} else {
				const res = await fetch(privateAPIEndpoint);
				if (res.ok) {
					const text = await res.text();
					setPrivateAPIResult(text);
				} else {
					setPrivateAPIResult(JSON.stringify({ ok: res.ok, status: res.status }));
				}
			}
		} catch (e) {
			setPrivateAPIResult(String(e));
		}
	};

	useEffect(() => {
		const url = new URL(location.href);
		if (!url.searchParams.has("code") ||
			!url.searchParams.has("state") ||
			url.searchParams.get("state") !== state
		) {
			return;
		}

		tokenRequest(url.searchParams.get("code"))
			.then(res => {
				if (res.ok) {
					return res.json();
				} else {
					throw new Error("request fail");
				}
			})
			.then(ts => {
				setTokens(ts);
				setIsLoggedIn(true);
			})
			.catch(e => {
				console.error(e);
			});
	}, []);

	return (
		<div className="App">
			<button onClick={handleLoginLogout}>{isLoggedIn ? "Logout" : "Login"}</button>
			<div>
				<div>
					<button onClick={handlePublicReq}>Public API</button>
					<textarea cols="30" rows="15" value={publicAPIResult} readOnly></textarea>
				</div>
				<div>
					<button onClick={handlePrivateReq}>Private API</button>
					<textarea cols="30" rows="15" value={privateAPIResult} readOnly></textarea>
				</div>

			</div>
		</div>
	);
}

export default App;

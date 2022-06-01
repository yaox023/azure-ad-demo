package com.example.validatedemo;

import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.net.URL;
import java.security.interfaces.RSAPublicKey;

@SpringBootApplication
@RestController
public class ValidateDemoApplication {

	@GetMapping("/api")
	@CrossOrigin(origins = "*")
	public String validate(String token) {

		DecodedJWT jwt = JWT.decode(token);

		String url = "https://login.microsoftonline.com/25c97843-7dfd-4037-9fc8-4c585dd37ea5/discovery/v2.0/keys";

		try {
			JwkProvider jwkProvider = new UrlJwkProvider(new URL(url));
			Jwk jwk = jwkProvider.get(jwt.getKeyId());
			Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
			algorithm.verify(jwt);
			return "success";
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (JwkException e) {
			e.printStackTrace();
		} catch (SignatureVerificationException e) {
			e.printStackTrace();
			return "verify fail";
		}

		return "fail";
	}

	public static void main(String[] args) {
		SpringApplication.run(ValidateDemoApplication.class, args);
	}

}

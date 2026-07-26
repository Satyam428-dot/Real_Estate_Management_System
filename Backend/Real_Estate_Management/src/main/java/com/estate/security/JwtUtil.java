package com.estate.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.estate.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	// creating a secret key of type string
	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long jwtExpiration;

	// Convert this string secret into SecretKey object
	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	/**
	 * Now generate token
	 */
	public String generateToken(User user) {
		return Jwts.builder().subject(user.getEmail()).claim("userId", user.getId())
				.claim("firstName", user.getFirstName()).claim("lastName", user.getLastName())
				.claim("role", user.getUserRoles()).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + jwtExpiration)).signWith(getSigningKey()).compact();
	}

	/**
	 * Extract all claims from JWT
	 */
	private Claims extractAllClaims(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
	}

	/**
	 * Extract Email (Subject)
	 */
	public String extractEmail(String token) {
		return extractAllClaims(token).getSubject();
	}

	/**
	 * Extract Expiration Date
	 */
	public Date extractExpiration(String token) {
		return extractAllClaims(token).getExpiration();
	}

	/**
	 * Check whether token is expired
	 */
	public boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	/**
	 * Validate JWT
	 */
	public boolean validateToken(String token, UserDetails userDetails) {

		String extractedEmail = extractEmail(token);

		return extractedEmail.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}
}

package com.flight.management.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtService {
	private static final String SECURITY = "cnjh81521302rpvqcdfswkja55r6jkdfuiuidaadagyui8954abjcjhlayujk89954sopmclpddmnkdoianlksoifsfkdby96w8eadf32tazjkad";

	// 1. Generates a JWT token for the given userName.
	public String generateToken(String userName) {
		// Prepare claims for the token
		Map<String, Object> claims = new HashMap<>();

		// Build JWT token with claims, subject, issued time, expiration time, and
		// signing algorithm
		// Token valid for 10 minutes
		return Jwts.builder().claims().add(claims).subject(userName).issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 10)).and().signWith(getSignKey())
				.compact();
	}

	// 2. Creates a signing key from the base64 encoded secret.
	// returns a Key object for signing the JWT.
	private SecretKey getSignKey() {
		// Decode the base64 encoded secret key and return a Key object
		byte[] keyBytes = Decoders.BASE64.decode(SECURITY);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	// 3. Extracts the userName from the JWT token.
	// return -> The userName contained in the token.
	public String extractUserName(String token) {
		// Extract and return the subject claim from the token
		return extractClaim(token, Claims::getSubject);
	}

	// 4. Extracts the expiration date from the JWT token.
	// @return The expiration date of the token.
	public Date extractExpiration(String token) {
		// Extract and return the expiration claim from the token
		return extractClaim(token, Claims::getExpiration);
	}

	// 5. Extracts a specific claim from the JWT token.
	// claimResolver A function to extract the claim.
	// return-> The value of the specified claim.
	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
		// Extract the specified claim using the provided function
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}

	// 6. Extracts all claims from the JWT token.
	// return-> Claims object containing all claims.
	private Claims extractAllClaims(String token) {
		// Parse and return all claims from the token
		return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token).getPayload();
	}

	// 7. Checks if the JWT token is expired.
	// return-> True if the token is expired, false otherwise.
	public Boolean isTokenExpired(String token) {
		// Check if the token's expiration time is before the current time
		return extractExpiration(token).before(new Date());
	}

	// 8. Validates the JWT token against the UserDetails.
	// return-> True if the token is valid, false otherwise.
	public Boolean validateToken(String token, UserDetails userDetails) {
		// Extract username from token and check if it matches UserDetails' username
		final String userName = extractUserName(token);
		// Also check if the token is expired
		return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));

	}

	public String getTokenFromRequest(HttpServletRequest request) {
		// TODO Auto-generated method stub
		if (request.getHeader("Authorization") != null)
			return request.getHeader("Authorization");

		else
			return null;
	}
}

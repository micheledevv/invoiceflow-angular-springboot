package com.invoiceflow.security;

import com.invoiceflow.user.AppUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Value("${jwt.expiration}")
  private long jwtExpiration;

  public String generateToken(AppUser user) {
    Date now = new Date();
    Date expirationDate = new Date(now.getTime() + jwtExpiration);

    return Jwts.builder()
      .subject(user.getEmail())
      .claim("userId", user.getId())
      .claim("fullName", user.getFullName())
      .issuedAt(now)
      .expiration(expirationDate)
      .signWith(getSigningKey())
      .compact();
  }

  public String extractEmail(String token) {
    return extractClaims(token).getSubject();
  }

  public boolean isTokenValid(String token, AppUser user) {
    String email = extractEmail(token);

    return email.equals(user.getEmail()) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return extractClaims(token)
      .getExpiration()
      .before(new Date());
  }

  private Claims extractClaims(String token) {
    return Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  private SecretKey getSigningKey() {
    byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}

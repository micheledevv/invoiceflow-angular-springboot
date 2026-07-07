package com.invoiceflow.auth;

public record AuthResponse(
  String token,
  Long userId,
  String fullName,
  String email,
  String avatarBase64
) {
}

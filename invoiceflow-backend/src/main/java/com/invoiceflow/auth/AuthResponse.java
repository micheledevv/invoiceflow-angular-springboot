package com.invoiceflow.auth;

import com.invoiceflow.model.Address;

public record AuthResponse(
  String token,
  Long userId,
  String fullName,
  String email,
  String avatarBase64,
  Address senderAddress
) {
}

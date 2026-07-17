package com.invoiceflow.settings;

import com.invoiceflow.model.Address;

public record UserSettingsResponse(
  Long userId,
  String fullName,
  String email,
  String avatarBase64,
  Address senderAddress,
  Integer defaultPaymentTerms
) {
}

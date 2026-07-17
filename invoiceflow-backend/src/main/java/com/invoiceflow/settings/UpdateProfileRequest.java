package com.invoiceflow.settings;

import com.invoiceflow.model.Address;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateProfileRequest(
  @NotBlank(message = "Il nome completo è obbligatorio")
  String fullName,

  String avatarBase64,

  @Valid
  @NotNull(message = "L'indirizzo mittente è obbligatorio")
  Address senderAddress
) {
}

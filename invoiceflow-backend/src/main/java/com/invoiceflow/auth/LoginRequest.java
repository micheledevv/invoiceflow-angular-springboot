package com.invoiceflow.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
  @NotBlank(message = "L'email è obbligatoria")
  @Email(message = "Email non valida")
  String email,

  @NotBlank(message = "La password è obbligatoria")
  String password
) {
}

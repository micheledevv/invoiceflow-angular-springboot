package com.invoiceflow.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
  @NotBlank(message = "Il nome completo è obbligatorio")
  String fullName,

  @NotBlank(message = "L'email è obbligatoria")
  @Email(message = "Email non valida")
  String email,

  @NotBlank(message = "La password è obbligatoria")
  @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
  String password,

  @NotBlank(message = "L'immagine profilo è obbligatoria")
  String avatarBase64
) {
}

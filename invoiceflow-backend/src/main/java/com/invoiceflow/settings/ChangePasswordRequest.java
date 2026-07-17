package com.invoiceflow.settings;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
  @NotBlank(message = "La password attuale è obbligatoria")
  String currentPassword,

  @NotBlank(message = "La nuova password è obbligatoria")
  @Size(min = 8, message = "La nuova password deve contenere almeno 8 caratteri")
  String newPassword
) {
}

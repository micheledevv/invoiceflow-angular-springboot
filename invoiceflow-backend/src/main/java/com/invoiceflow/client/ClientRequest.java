package com.invoiceflow.client;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClientRequest(
  @NotBlank(message = "Il nome cliente è obbligatorio")
  @Size(min = 2, max = 60, message = "Il nome deve contenere tra 2 e 60 caratteri")
  String name,

  @NotBlank(message = "L'email cliente è obbligatoria")
  @Email(message = "Email cliente non valida")
  @Size(max = 80, message = "L'email non può superare 80 caratteri")
  String email,

  @Size(max = 20, message = "Il telefono non può superare 20 caratteri")
  String phone,

  @Size(max = 20, message = "La partita IVA non può superare 20 caratteri")
  String vatNumber,

  @Size(max = 20, message = "Il codice fiscale non può superare 20 caratteri")
  String taxCode,

  @Valid
  @NotNull(message = "L'indirizzo cliente è obbligatorio")
  ClientAddressRequest address,

  @Size(max = 250, message = "Le note non possono superare 250 caratteri")
  String notes
) {}

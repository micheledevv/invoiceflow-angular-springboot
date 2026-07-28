package com.invoiceflow.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClientAddressRequest(
  @NotBlank(message = "L'indirizzo del cliente è obbligatorio")
  @Size(min = 5, max = 80, message = "L'indirizzo deve contenere tra 5 e 80 caratteri")
  String street,

  @NotBlank(message = "La città del cliente è obbligatoria")
  @Size(min = 2, max = 40, message = "La città deve contenere tra 2 e 40 caratteri")
  String city,

  @NotBlank(message = "Il CAP del cliente è obbligatorio")
  @Pattern(regexp = "^[0-9]{5}$", message = "Il CAP deve contenere 5 numeri")
  String postCode,

  @NotBlank(message = "Il paese del cliente è obbligatorio")
  @Size(min = 2, max = 40, message = "Il paese deve contenere tra 2 e 40 caratteri")
  String country
) {}

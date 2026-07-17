package com.invoiceflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ClientAddressRequest(
  @NotBlank(message = "L'indirizzo del cliente è obbligatorio")
  @Size(min = 5, max = 70, message = "L'indirizzo del cliente deve contenere tra 5 e 70 caratteri")
  String street,

  @NotBlank(message = "La città del cliente è obbligatoria")
  @Size(min = 2, max = 35, message = "La città del cliente deve contenere tra 2 e 35 caratteri")
  String city,

  @NotBlank(message = "Il CAP del cliente è obbligatorio")
  @Pattern(regexp = "^[0-9]{5}$", message = "Il CAP del cliente deve contenere 5 numeri")
  String postCode,

  @NotBlank(message = "Il paese del cliente è obbligatorio")
  @Size(min = 2, max = 35, message = "Il paese del cliente deve contenere tra 2 e 35 caratteri")
  String country
) {}

package com.invoiceflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SenderAddressRequest(
  @NotBlank(message = "L'indirizzo del mittente è obbligatorio")
  @Size(min = 5, max = 80, message = "L'indirizzo del mittente deve contenere tra 5 e 80 caratteri")
  String street,

  @NotBlank(message = "La città del mittente è obbligatoria")
  @Size(min = 2, max = 40, message = "La città del mittente deve contenere tra 2 e 40 caratteri")
  String city,

  @NotBlank(message = "Il CAP del mittente è obbligatorio")
  @Pattern(regexp = "^[0-9]{5}$", message = "Il CAP del mittente deve contenere 5 numeri")
  String postCode,

  @NotBlank(message = "Il paese del mittente è obbligatorio")
  @Size(min = 2, max = 40, message = "Il paese del mittente deve contenere tra 2 e 40 caratteri")
  String country
) {}

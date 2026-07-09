package com.invoiceflow.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

  @NotBlank(message = "L'indirizzo è obbligatorio")
  private String street;

  @NotBlank(message = "La città è obbligatoria")
  private String city;

  @NotBlank(message = "Il CAP è obbligatorio")
  @Pattern(regexp = "^[0-9]{5}$", message = "Il CAP deve contenere 5 numeri")
  private String postCode;

  @NotBlank(message = "Il paese è obbligatorio")
  private String country;
}

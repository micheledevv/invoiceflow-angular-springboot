package com.invoiceflow.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record InvoiceItemRequest(
  @NotBlank(message = "Il nome articolo è obbligatorio")
  @Size(min = 2, max = 50, message = "Il nome articolo deve contenere tra 2 e 50 caratteri")
  String name,

  @NotNull(message = "La quantità è obbligatoria")
  @Min(value = 1, message = "La quantità deve essere almeno 1")
  @Max(value = 999, message = "La quantità non può superare 999")
  Integer quantity,

  @NotNull(message = "Il prezzo è obbligatorio")
  @DecimalMin(value = "0.01", message = "Il prezzo deve essere almeno 0.01")
  @DecimalMax(value = "99999.99", message = "Il prezzo non può superare 99999.99")
  BigDecimal price
) {}

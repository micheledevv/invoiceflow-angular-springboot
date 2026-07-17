package com.invoiceflow.settings;

import jakarta.validation.constraints.NotNull;

public record UpdateInvoicePreferencesRequest(
  @NotNull(message = "I termini di pagamento sono obbligatori")
  Integer defaultPaymentTerms
) {
}

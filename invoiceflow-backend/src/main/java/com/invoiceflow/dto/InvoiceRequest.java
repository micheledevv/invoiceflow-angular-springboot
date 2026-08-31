package com.invoiceflow.dto;

import com.invoiceflow.model.InvoiceStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record InvoiceRequest(
  @Pattern(
    regexp = "^CL-[A-Z]{2}[0-9]{4}$",
    message = "L'id cliente deve avere il formato CL-AB1234"
  )
  String clientId,

  @NotBlank(message = "L'id fattura è obbligatorio")
  @Pattern(regexp = "^[A-Z]{2}[0-9]{4}$", message = "L'id fattura deve avere il formato AB1234")
  String id,

  @NotBlank(message = "La data fattura è obbligatoria")
  @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La data fattura deve avere formato yyyy-MM-dd")
  String createdAt,

  @NotBlank(message = "La descrizione progetto è obbligatoria")
  @Size(min = 3, max = 80, message = "La descrizione deve contenere tra 3 e 80 caratteri")
  String description,

  @NotNull(message = "I termini di pagamento sono obbligatori")
  Integer paymentTerms,

  @NotBlank(message = "Il nome cliente è obbligatorio")
  @Size(min = 2, max = 50, message = "Il nome cliente deve contenere tra 2 e 50 caratteri")
  String clientName,

  @NotBlank(message = "L'email cliente è obbligatoria")
  @Email(message = "Email cliente non valida")
  @Size(max = 80, message = "L'email cliente non può superare 80 caratteri")
  String clientEmail,

  @NotBlank(message = "Il nome del mittente è obbligatorio")
  @Size(min = 2, max = 60, message = "Il nome del mittente deve contenere tra 2 e 60 caratteri")
  String senderName,

  @NotNull(message = "Lo stato fattura è obbligatorio")
  InvoiceStatus status,

  @Valid
  @NotNull(message = "L'indirizzo del mittente è obbligatorio")
  SenderAddressRequest senderAddress,

  @Valid
  @NotNull(message = "L'indirizzo del cliente è obbligatorio")
  ClientAddressRequest clientAddress,

  @Valid
  @NotEmpty(message = "La fattura deve contenere almeno un articolo")
  @Size(max = 10, message = "La fattura può contenere al massimo 10 articoli")
  List<InvoiceItemRequest> items
) {
  @AssertTrue(message = "I termini di pagamento devono essere 1, 7, 14 o 30 giorni")
  public boolean isPaymentTermsAllowed() {
    return paymentTerms == null ||
      paymentTerms == 1 ||
      paymentTerms == 7 ||
      paymentTerms == 14 ||
      paymentTerms == 30;
  }
}

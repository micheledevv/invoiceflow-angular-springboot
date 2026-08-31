package com.invoiceflow.client;

import com.invoiceflow.model.InvoiceStatus;

public record ClientInvoiceResponse(
  String id,
  String createdAt,
  String paymentDue,
  String description,
  InvoiceStatus status,
  Double total
) {}

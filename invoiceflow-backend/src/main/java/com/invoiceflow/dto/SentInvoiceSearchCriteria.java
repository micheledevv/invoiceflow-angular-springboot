package com.invoiceflow.dto;

import com.invoiceflow.model.InvoiceStatus;

public record SentInvoiceSearchCriteria(
  String search,
  InvoiceStatus status,
  String dateFrom,
  String dateTo,
  Double minTotal,
  Double maxTotal,
  String sortBy,
  String sortDirection
) {
}

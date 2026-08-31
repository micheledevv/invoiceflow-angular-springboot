package com.invoiceflow.client;

import com.invoiceflow.model.Address;

public record ClientResponse(
  String id,
  String name,
  String email,
  String phone,
  String vatNumber,
  String taxCode,
  Address address,
  String notes,
  Long invoicesCount,
  Double totalBilled,
  String createdAt
) {}

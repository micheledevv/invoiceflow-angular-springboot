package com.invoiceflow.controller;

import com.invoiceflow.dto.InvoiceRequest;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.service.InvoiceService;
import com.invoiceflow.user.AppUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

  private final InvoiceService invoiceService;

  @GetMapping
  public List<Invoice> getAllInvoices(@AuthenticationPrincipal AppUser user) {
    return invoiceService.getAllInvoices(user);
  }

  @GetMapping("/{id}")
  public Invoice getInvoiceById(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    return invoiceService.getInvoiceById(id, user);
  }

  @PostMapping
  public Invoice createInvoice(
    @Valid @RequestBody InvoiceRequest request,
    @AuthenticationPrincipal AppUser user
  ) {
    return invoiceService.createInvoice(request, user);
  }

  @PutMapping("/{id}")
  public Invoice updateInvoice(
    @PathVariable String id,
    @Valid @RequestBody InvoiceRequest request,
    @AuthenticationPrincipal AppUser user
  ) {
    return invoiceService.updateInvoice(id, request, user);
  }

  @DeleteMapping("/{id}")
  public void deleteInvoice(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    invoiceService.deleteInvoice(id, user);
  }

  @PatchMapping("/{id}/mark-as-paid")
  public Invoice markAsPaid(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    return invoiceService.markAsPaid(id, user);
  }
}

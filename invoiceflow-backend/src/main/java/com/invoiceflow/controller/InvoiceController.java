package com.invoiceflow.controller;

import com.invoiceflow.model.Invoice;
import com.invoiceflow.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

  private final InvoiceService invoiceService;

  public InvoiceController(InvoiceService invoiceService) {
    this.invoiceService = invoiceService;
  }

  @GetMapping
  public List<Invoice> getInvoices() {
    return invoiceService.getInvoices();
  }

  @GetMapping("/{id}")
  public Invoice getInvoiceById(@PathVariable String id) {
    return invoiceService.getInvoiceById(id);
  }

  @PostMapping
  public Invoice createInvoice(@RequestBody Invoice invoice) {
    return invoiceService.createInvoice(invoice);
  }

  @PutMapping("/{id}")
  public Invoice updateInvoice(
    @PathVariable String id,
    @RequestBody Invoice invoice
  ) {
    return invoiceService.updateInvoice(id, invoice);
  }

  @DeleteMapping("/{id}")
  public void deleteInvoice(@PathVariable String id) {
    invoiceService.deleteInvoice(id);
  }

  @PatchMapping("/{id}/mark-as-paid")
  public Invoice markAsPaid(@PathVariable String id) {
    return invoiceService.markAsPaid(id);
  }
}

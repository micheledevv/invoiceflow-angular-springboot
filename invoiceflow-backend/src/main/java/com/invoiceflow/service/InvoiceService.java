package com.invoiceflow.service;

import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceStatus;
import com.invoiceflow.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

  private final InvoiceRepository invoiceRepository;

  public InvoiceService(InvoiceRepository invoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  public List<Invoice> getInvoices() {
    return invoiceRepository.findAll();
  }

  public Invoice getInvoiceById(String id) {
    return invoiceRepository.findById(id)
      .orElseThrow(() -> new RuntimeException("Fattura non trovata con id: " + id));
  }

  public Invoice createInvoice(Invoice invoice) {
    invoice.setItems(invoice.getItems());
    invoice.calculateTotal();

    return invoiceRepository.save(invoice);
  }

  public Invoice updateInvoice(String id, Invoice invoiceUpdated) {
    Invoice invoice = getInvoiceById(id);

    invoice.setCreatedAt(invoiceUpdated.getCreatedAt());
    invoice.setPaymentDue(invoiceUpdated.getPaymentDue());
    invoice.setDescription(invoiceUpdated.getDescription());
    invoice.setPaymentTerms(invoiceUpdated.getPaymentTerms());
    invoice.setClientName(invoiceUpdated.getClientName());
    invoice.setClientEmail(invoiceUpdated.getClientEmail());
    invoice.setStatus(invoiceUpdated.getStatus());
    invoice.setSenderAddress(invoiceUpdated.getSenderAddress());
    invoice.setClientAddress(invoiceUpdated.getClientAddress());
    invoice.setItems(invoiceUpdated.getItems());
    invoice.calculateTotal();

    return invoiceRepository.save(invoice);
  }

  public void deleteInvoice(String id) {
    invoiceRepository.deleteById(id);
  }

  public Invoice markAsPaid(String id) {
    Invoice invoice = getInvoiceById(id);
    invoice.setStatus(InvoiceStatus.paid);

    return invoiceRepository.save(invoice);
  }
}

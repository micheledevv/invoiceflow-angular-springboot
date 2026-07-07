package com.invoiceflow.service;

import com.invoiceflow.model.Invoice;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.user.AppUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

  private final InvoiceRepository invoiceRepository;

  public List<Invoice> getAllInvoices(AppUser user) {
    return invoiceRepository.findByUser(user);
  }

  public Invoice getInvoiceById(String id, AppUser user) {
    return invoiceRepository.findByIdAndUser(id, user)
      .orElseThrow(() -> new RuntimeException("Fattura non trovata"));
  }

  @Transactional
  public Invoice createInvoice(Invoice invoice, AppUser user) {
    invoice.setUser(user);
    invoice.prepareItemsForSave();

    return invoiceRepository.save(invoice);
  }

  @Transactional
  public Invoice updateInvoice(String id, Invoice invoiceUpdated, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);

    invoice.setCreatedAt(invoiceUpdated.getCreatedAt());
    invoice.setPaymentDue(invoiceUpdated.getPaymentDue());
    invoice.setDescription(invoiceUpdated.getDescription());
    invoice.setPaymentTerms(invoiceUpdated.getPaymentTerms());
    invoice.setClientName(invoiceUpdated.getClientName());
    invoice.setClientEmail(invoiceUpdated.getClientEmail());
    invoice.setStatus(invoiceUpdated.getStatus());
    invoice.setSenderAddress(invoiceUpdated.getSenderAddress());
    invoice.setClientAddress(invoiceUpdated.getClientAddress());

    invoice.replaceItems(invoiceUpdated.getItems());

    return invoiceRepository.save(invoice);
  }

  @Transactional
  public void deleteInvoice(String id, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);
    invoiceRepository.delete(invoice);
  }

  @Transactional
  public Invoice markAsPaid(String id, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);
    invoice.setStatus(com.invoiceflow.model.InvoiceStatus.paid);

    return invoiceRepository.save(invoice);
  }
}

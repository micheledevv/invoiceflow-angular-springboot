package com.invoiceflow.service;

import com.invoiceflow.dto.ClientAddressRequest;
import com.invoiceflow.dto.InvoiceItemRequest;
import com.invoiceflow.dto.InvoiceRequest;
import com.invoiceflow.dto.SenderAddressRequest;
import com.invoiceflow.client.Client;
import com.invoiceflow.client.ClientRepository;
import com.invoiceflow.model.Address;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceItem;
import com.invoiceflow.model.InvoiceStatus;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.user.AppUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class InvoiceService {

  private final InvoiceRepository invoiceRepository;
  private final ClientRepository clientRepository;

  public List<Invoice> getAllInvoices(AppUser user) {
    return invoiceRepository.findByUser(user);
  }

  public Invoice getInvoiceById(String id, AppUser user) {
    return invoiceRepository.findByIdAndUser(id, user)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Fattura non trovata"
      ));
  }

  @Transactional
  public Invoice createInvoice(InvoiceRequest request, AppUser user) {
    validateCreateStatus(request.status());

    if (invoiceRepository.existsById(request.id())) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Esiste già una fattura con questo id"
      );
    }

    Client linkedClient = getLinkedClient(request.clientId(), user);

    Invoice invoice = buildInvoiceFromRequest(request, linkedClient);
    invoice.setUser(user);
    invoice.setClient(linkedClient);
    invoice.prepareItemsForSave();

    return invoiceRepository.save(invoice);
  }

  @Transactional
  public Invoice updateInvoice(String id, InvoiceRequest request, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);
    Client linkedClient = getLinkedClient(request.clientId(), user);

    invoice.setCreatedAt(request.createdAt().trim());
    invoice.setPaymentTerms(request.paymentTerms());
    invoice.setPaymentDue(calculatePaymentDue(request.createdAt(), request.paymentTerms()));
    invoice.setDescription(normalizeText(request.description()));
    invoice.setSenderName(normalizeText(request.senderName()));
    invoice.setStatus(request.status());
    invoice.setSenderAddress(mapSenderAddress(request.senderAddress()));
    invoice.setClient(linkedClient);

    if (linkedClient != null) {
      invoice.setClientName(linkedClient.getName());
      invoice.setClientEmail(linkedClient.getEmail());
      invoice.setClientAddress(copyAddress(linkedClient.getAddress()));
    } else {
      invoice.setClientName(normalizeText(request.clientName()));
      invoice.setClientEmail(normalizeEmail(request.clientEmail()));
      invoice.setClientAddress(mapClientAddress(request.clientAddress()));
    }

    invoice.replaceItems(mapItems(request.items()));

    return invoiceRepository.save(invoice);
  }

  private Invoice buildInvoiceFromRequest(InvoiceRequest request, Client linkedClient) {
    Invoice invoice = new Invoice();

    invoice.setId(request.id().trim());
    invoice.setCreatedAt(request.createdAt().trim());
    invoice.setPaymentTerms(request.paymentTerms());
    invoice.setPaymentDue(calculatePaymentDue(request.createdAt(), request.paymentTerms()));
    invoice.setDescription(normalizeText(request.description()));
    invoice.setSenderName(normalizeText(request.senderName()));
    invoice.setStatus(request.status());
    invoice.setSenderAddress(mapSenderAddress(request.senderAddress()));
    invoice.setItems(mapItems(request.items()));

    if (linkedClient != null) {
      invoice.setClientName(linkedClient.getName());
      invoice.setClientEmail(linkedClient.getEmail());
      invoice.setClientAddress(copyAddress(linkedClient.getAddress()));
    } else {
      invoice.setClientName(normalizeText(request.clientName()));
      invoice.setClientEmail(normalizeEmail(request.clientEmail()));
      invoice.setClientAddress(mapClientAddress(request.clientAddress()));
    }

    return invoice;
  }

  private Client getLinkedClient(String clientId, AppUser user) {
    if (clientId == null || clientId.isBlank()) {
      return null;
    }

    return clientRepository.findByIdAndUser(clientId.trim(), user)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Cliente selezionato non trovato"
      ));
  }

  private Address copyAddress(Address address) {
    return new Address(
      address.getStreet(),
      address.getCity(),
      address.getPostCode(),
      address.getCountry()
    );
  }

  @Transactional
  public void deleteInvoice(String id, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);
    invoiceRepository.delete(invoice);
  }

  @Transactional
  public Invoice markAsPaid(String id, AppUser user) {
    Invoice invoice = getInvoiceById(id, user);
    invoice.setStatus(InvoiceStatus.paid);

    return invoiceRepository.save(invoice);
  }

  private Address mapSenderAddress(SenderAddressRequest request) {
    return new Address(
      normalizeText(request.street()),
      normalizeText(request.city()),
      request.postCode().trim(),
      normalizeText(request.country())
    );
  }

  private Address mapClientAddress(ClientAddressRequest request) {
    return new Address(
      normalizeText(request.street()),
      normalizeText(request.city()),
      request.postCode().trim(),
      normalizeText(request.country())
    );
  }

  private List<InvoiceItem> mapItems(List<InvoiceItemRequest> requests) {
    return requests.stream()
      .map(this::mapItem)
      .toList();
  }

  private InvoiceItem mapItem(InvoiceItemRequest request) {
    InvoiceItem item = new InvoiceItem();

    item.setName(normalizeText(request.name()));
    item.setQuantity(request.quantity());
    item.setPrice(request.price().doubleValue());
    item.calculateTotal();

    return item;
  }

  private String calculatePaymentDue(String createdAt, Integer paymentTerms) {
    try {
      LocalDate date = LocalDate.parse(createdAt.trim());
      return date.plusDays(paymentTerms).toString();
    } catch (DateTimeParseException exception) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Data fattura non valida"
      );
    }
  }

  private void validateCreateStatus(InvoiceStatus status) {
    if (status != InvoiceStatus.draft && status != InvoiceStatus.pending) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "Una nuova fattura può essere creata solo come bozza o in attesa"
      );
    }
  }

  private String normalizeText(String value) {
    return value.trim().replaceAll("\\s+", " ");
  }

  private String normalizeEmail(String value) {
    return value.trim().toLowerCase(Locale.ROOT);
  }
}

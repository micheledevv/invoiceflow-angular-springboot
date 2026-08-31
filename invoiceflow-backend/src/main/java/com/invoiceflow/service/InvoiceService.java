package com.invoiceflow.service;

import com.invoiceflow.dto.ClientAddressRequest;
import com.invoiceflow.dto.InvoiceItemRequest;
import com.invoiceflow.dto.InvoiceRequest;
import com.invoiceflow.dto.SentInvoiceSearchCriteria;
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
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
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

  public List<Invoice> searchSentInvoices(
    SentInvoiceSearchCriteria criteria,
    AppUser user
  ) {
    validateSentInvoiceCriteria(criteria);

    Specification<Invoice> specification = buildSentInvoiceSpecification(
      criteria,
      user
    );

    return invoiceRepository.findAll(
      specification,
      buildSentInvoiceSort(criteria)
    );
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

  private Specification<Invoice> buildSentInvoiceSpecification(
    SentInvoiceSearchCriteria criteria,
    AppUser user
  ) {
    return (root, query, builder) -> {
      List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

      predicates.add(builder.equal(root.get("user"), user));
      predicates.add(
        root.<InvoiceStatus>get("status").in(
          InvoiceStatus.pending,
          InvoiceStatus.paid
        )
      );

      if (criteria.status() != null) {
        predicates.add(builder.equal(root.get("status"), criteria.status()));
      }

      String searchPattern = buildSearchPattern(criteria.search());

      if (searchPattern != null) {
        predicates.add(builder.or(
          builder.like(builder.lower(root.get("id")), searchPattern, '\\'),
          builder.like(builder.lower(root.get("clientName")), searchPattern, '\\'),
          builder.like(builder.lower(root.get("clientEmail")), searchPattern, '\\'),
          builder.like(builder.lower(root.get("description")), searchPattern, '\\')
        ));
      }

      String dateFrom = normalizeOptionalText(criteria.dateFrom());
      String dateTo = normalizeOptionalText(criteria.dateTo());

      if (dateFrom != null) {
        predicates.add(
          builder.greaterThanOrEqualTo(root.get("createdAt"), dateFrom)
        );
      }

      if (dateTo != null) {
        predicates.add(
          builder.lessThanOrEqualTo(root.get("createdAt"), dateTo)
        );
      }

      if (criteria.minTotal() != null) {
        predicates.add(
          builder.greaterThanOrEqualTo(root.get("total"), criteria.minTotal())
        );
      }

      if (criteria.maxTotal() != null) {
        predicates.add(
          builder.lessThanOrEqualTo(root.get("total"), criteria.maxTotal())
        );
      }

      return builder.and(predicates.toArray(
        jakarta.persistence.criteria.Predicate[]::new
      ));
    };
  }

  private Sort buildSentInvoiceSort(SentInvoiceSearchCriteria criteria) {
    String requestedField = normalizeOptionalText(criteria.sortBy());
    String sortField = switch (requestedField != null ? requestedField : "createdAt") {
      case "createdAt" -> "createdAt";
      case "paymentDue" -> "paymentDue";
      case "total" -> "total";
      case "clientName" -> "clientName";
      default -> throw badRequest("Ordinamento fatture non valido");
    };

    String requestedDirection = normalizeOptionalText(criteria.sortDirection());
    Sort.Direction direction;

    try {
      direction = Sort.Direction.fromString(
        requestedDirection != null ? requestedDirection : "desc"
      );
    } catch (IllegalArgumentException exception) {
      throw badRequest("Direzione di ordinamento non valida");
    }

    return Sort.by(direction, sortField)
      .and(Sort.by(direction, "id"));
  }

  private void validateSentInvoiceCriteria(SentInvoiceSearchCriteria criteria) {
    if (criteria.status() == InvoiceStatus.draft) {
      throw badRequest("Le bozze non fanno parte delle fatture inviate");
    }

    String search = normalizeOptionalText(criteria.search());

    if (search != null && search.length() > 100) {
      throw badRequest("La ricerca non può superare 100 caratteri");
    }

    LocalDate dateFrom = parseOptionalDate(criteria.dateFrom());
    LocalDate dateTo = parseOptionalDate(criteria.dateTo());

    if (dateFrom != null && dateTo != null && dateFrom.isAfter(dateTo)) {
      throw badRequest("La data iniziale non può essere successiva alla data finale");
    }

    validateAmount(criteria.minTotal(), "L'importo minimo");
    validateAmount(criteria.maxTotal(), "L'importo massimo");

    if (
      criteria.minTotal() != null
      && criteria.maxTotal() != null
      && criteria.minTotal() > criteria.maxTotal()
    ) {
      throw badRequest("L'importo minimo non può superare l'importo massimo");
    }
  }

  private void validateAmount(Double amount, String label) {
    if (amount != null && (!Double.isFinite(amount) || amount < 0)) {
      throw badRequest(label + " deve essere un numero positivo");
    }
  }

  private LocalDate parseOptionalDate(String value) {
    String normalizedValue = normalizeOptionalText(value);

    if (normalizedValue == null) {
      return null;
    }

    try {
      return LocalDate.parse(normalizedValue);
    } catch (DateTimeParseException exception) {
      throw badRequest("Intervallo di date non valido");
    }
  }

  private String buildSearchPattern(String value) {
    String normalizedValue = normalizeOptionalText(value);

    if (normalizedValue == null) {
      return null;
    }

    if (normalizedValue.startsWith("#")) {
      normalizedValue = normalizedValue.substring(1).trim();
    }

    String escapedValue = normalizedValue
      .toLowerCase(Locale.ROOT)
      .replace("\\", "\\\\")
      .replace("%", "\\%")
      .replace("_", "\\_");

    return "%" + escapedValue + "%";
  }

  private String normalizeOptionalText(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }

    return value.trim();
  }

  private ResponseStatusException badRequest(String message) {
    return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
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

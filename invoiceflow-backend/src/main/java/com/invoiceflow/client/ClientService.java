package com.invoiceflow.client;

import com.invoiceflow.model.Address;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.user.AppUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.security.SecureRandom;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ClientService {

  private static final String CLIENT_ID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final SecureRandom RANDOM = new SecureRandom();

  private final ClientRepository clientRepository;
  private final InvoiceRepository invoiceRepository;

  public List<ClientResponse> getAllClients(AppUser user) {
    return clientRepository.findByUserOrderByCreatedAtDescNameAsc(user)
      .stream()
      .map((client) -> mapToClientResponse(client, user))
      .toList();
  }

  public ClientResponse getClientById(String id, AppUser user) {
    Client client = getClientEntityById(id, user);

    return mapToClientResponse(client, user);
  }

  public List<ClientInvoiceResponse> getInvoicesByClient(String id, AppUser user) {
    Client client = getClientEntityById(id, user);

    return invoiceRepository.findByClientAndUserOrderByCreatedAtDesc(client, user)
      .stream()
      .map(this::mapToClientInvoiceResponse)
      .toList();
  }

  @Transactional
  public ClientResponse createClient(ClientRequest request, AppUser user) {
    String normalizedEmail = normalizeEmail(request.email());

    if (clientRepository.existsByEmailAndUser(normalizedEmail, user)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Esiste già un cliente con questa email"
      );
    }

    Client client = Client.builder()
      .id(generateClientId())
      .name(normalizeText(request.name()))
      .email(normalizedEmail)
      .phone(normalizeOptionalText(request.phone()))
      .vatNumber(normalizeOptionalText(request.vatNumber()))
      .taxCode(normalizeOptionalText(request.taxCode()))
      .address(mapAddress(request.address()))
      .notes(normalizeOptionalText(request.notes()))
      .invoicesCount(0)
      .totalBilled(0.0)
      .createdAt(LocalDate.now().toString())
      .user(user)
      .build();

    Client savedClient = clientRepository.save(client);

    return mapToClientResponse(savedClient, user);
  }

  @Transactional
  public ClientResponse updateClient(String id, ClientRequest request, AppUser user) {
    Client client = getClientEntityById(id, user);

    String normalizedEmail = normalizeEmail(request.email());

    if (clientRepository.existsByEmailAndUserAndIdNot(normalizedEmail, user, id)) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Esiste già un altro cliente con questa email"
      );
    }

    client.setName(normalizeText(request.name()));
    client.setEmail(normalizedEmail);
    client.setPhone(normalizeOptionalText(request.phone()));
    client.setVatNumber(normalizeOptionalText(request.vatNumber()));
    client.setTaxCode(normalizeOptionalText(request.taxCode()));
    client.setAddress(mapAddress(request.address()));
    client.setNotes(normalizeOptionalText(request.notes()));

    Client updatedClient = clientRepository.save(client);

    return mapToClientResponse(updatedClient, user);
  }

  @Transactional
  public void deleteClient(String id, AppUser user) {
    Client client = getClientEntityById(id, user);

    invoiceRepository.detachClient(client, user);
    clientRepository.delete(client);
  }

  private Client getClientEntityById(String id, AppUser user) {
    return clientRepository.findByIdAndUser(id, user)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Cliente non trovato"
      ));
  }

  private ClientResponse mapToClientResponse(Client client, AppUser user) {
    Long invoicesCount = invoiceRepository.countByClientAndUser(client, user);
    Double totalBilled = invoiceRepository.sumTotalByClientAndUser(client, user);

    return new ClientResponse(
      client.getId(),
      client.getName(),
      client.getEmail(),
      client.getPhone(),
      client.getVatNumber(),
      client.getTaxCode(),
      client.getAddress(),
      client.getNotes(),
      invoicesCount,
      totalBilled != null ? totalBilled : 0.0,
      client.getCreatedAt()
    );
  }

  private ClientInvoiceResponse mapToClientInvoiceResponse(Invoice invoice) {
    return new ClientInvoiceResponse(
      invoice.getId(),
      invoice.getCreatedAt(),
      invoice.getPaymentDue(),
      invoice.getDescription(),
      invoice.getStatus(),
      invoice.getTotal()
    );
  }

  private Address mapAddress(ClientAddressRequest request) {
    return new Address(
      normalizeText(request.street()),
      normalizeText(request.city()),
      request.postCode().trim(),
      normalizeText(request.country())
    );
  }

  private String generateClientId() {
    String id;

    do {
      String prefix = "" + CLIENT_ID_LETTERS.charAt(RANDOM.nextInt(CLIENT_ID_LETTERS.length()))
        + CLIENT_ID_LETTERS.charAt(RANDOM.nextInt(CLIENT_ID_LETTERS.length()));
      int number = RANDOM.nextInt(9000) + 1000;

      id = "CL-" + prefix + number;
    } while (clientRepository.existsById(id));

    return id;
  }

  private String normalizeText(String value) {
    return value.trim().replaceAll("\\s+", " ");
  }

  private String normalizeOptionalText(String value) {
    if (value == null || value.trim().isEmpty()) {
      return "";
    }

    return normalizeText(value);
  }

  private String normalizeEmail(String value) {
    return value.trim().toLowerCase(Locale.ROOT);
  }
}

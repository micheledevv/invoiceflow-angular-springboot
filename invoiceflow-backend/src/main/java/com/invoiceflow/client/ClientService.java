package com.invoiceflow.client;

import com.invoiceflow.model.Address;
import com.invoiceflow.user.AppUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ClientService {

  private final ClientRepository clientRepository;

  public List<Client> getAllClients(AppUser user) {
    return clientRepository.findByUserOrderByCreatedAtDescNameAsc(user);
  }

  public Client getClientById(String id, AppUser user) {
    return clientRepository.findByIdAndUser(id, user)
      .orElseThrow(() -> new ResponseStatusException(
        HttpStatus.NOT_FOUND,
        "Cliente non trovato"
      ));
  }

  @Transactional
  public Client createClient(ClientRequest request, AppUser user) {
    String normalizedEmail = request.email().trim().toLowerCase();

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

    return clientRepository.save(client);
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
    String letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    Random random = new Random();

    String prefix = "" + letters.charAt(random.nextInt(letters.length()))
      + letters.charAt(random.nextInt(letters.length()));

    int number = random.nextInt(9000) + 1000;

    String id = "CL-" + prefix + number;

    if (clientRepository.existsById(id)) {
      return generateClientId();
    }

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
}

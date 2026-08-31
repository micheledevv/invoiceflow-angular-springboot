package com.invoiceflow.client;

import com.invoiceflow.user.AppUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ClientController {

  private final ClientService clientService;

  @GetMapping
  public List<ClientResponse> getAllClients(@AuthenticationPrincipal AppUser user) {
    return clientService.getAllClients(user);
  }

  @GetMapping("/{id}")
  public ClientResponse getClientById(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.getClientById(id, user);
  }

  @GetMapping("/{id}/invoices")
  public List<ClientInvoiceResponse> getInvoicesByClient(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.getInvoicesByClient(id, user);
  }

  @PostMapping
  public ClientResponse createClient(
    @Valid @RequestBody ClientRequest request,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.createClient(request, user);
  }

  @PutMapping("/{id}")
  public ClientResponse updateClient(
    @PathVariable String id,
    @Valid @RequestBody ClientRequest request,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.updateClient(id, request, user);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteClient(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    clientService.deleteClient(id, user);

    return ResponseEntity.noContent().build();
  }
}

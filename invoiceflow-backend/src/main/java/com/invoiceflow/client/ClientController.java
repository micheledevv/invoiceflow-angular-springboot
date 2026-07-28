package com.invoiceflow.client;

import com.invoiceflow.user.AppUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
  public List<Client> getAllClients(@AuthenticationPrincipal AppUser user) {
    return clientService.getAllClients(user);
  }

  @GetMapping("/{id}")
  public Client getClientById(
    @PathVariable String id,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.getClientById(id, user);
  }

  @PostMapping
  public Client createClient(
    @Valid @RequestBody ClientRequest request,
    @AuthenticationPrincipal AppUser user
  ) {
    return clientService.createClient(request, user);
  }
}

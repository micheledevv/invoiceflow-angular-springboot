package com.invoiceflow;

import com.invoiceflow.client.Client;
import com.invoiceflow.client.ClientAddressRequest;
import com.invoiceflow.client.ClientRepository;
import com.invoiceflow.client.ClientRequest;
import com.invoiceflow.client.ClientResponse;
import com.invoiceflow.client.ClientService;
import com.invoiceflow.model.Address;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.user.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ClientServiceTests {

  @Mock
  private ClientRepository clientRepository;

  @Mock
  private InvoiceRepository invoiceRepository;

  @InjectMocks
  private ClientService clientService;

  @Test
  void createClientNormalizesDataAndReturnsComputedSummary() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    ClientRequest request = request("  Mario   Rossi  ", "  MARIO.ROSSI@TEST.IT ");

    when(clientRepository.existsByEmailAndUser("mario.rossi@test.it", user)).thenReturn(false);
    when(clientRepository.existsById(any(String.class))).thenReturn(false);
    when(clientRepository.save(any(Client.class))).thenAnswer(invocation -> invocation.getArgument(0));
    when(invoiceRepository.countByClientAndUser(any(Client.class), any(AppUser.class))).thenReturn(0L);
    when(invoiceRepository.sumTotalByClientAndUser(any(Client.class), any(AppUser.class))).thenReturn(0.0);

    ClientResponse response = clientService.createClient(request, user);

    ArgumentCaptor<Client> clientCaptor = ArgumentCaptor.forClass(Client.class);
    verify(clientRepository).save(clientCaptor.capture());

    Client savedClient = clientCaptor.getValue();
    assertTrue(savedClient.getId().matches("^CL-[A-Z]{2}[0-9]{4}$"));
    assertEquals("Mario Rossi", savedClient.getName());
    assertEquals("mario.rossi@test.it", savedClient.getEmail());
    assertEquals(user, savedClient.getUser());
    assertEquals(0L, response.invoicesCount());
    assertEquals(0.0, response.totalBilled());
  }

  @Test
  void createClientRejectsDuplicateEmailForSameUser() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    ClientRequest request = request("Mario Rossi", "mario.rossi@test.it");

    when(clientRepository.existsByEmailAndUser("mario.rossi@test.it", user)).thenReturn(true);

    ResponseStatusException exception = assertThrows(
      ResponseStatusException.class,
      () -> clientService.createClient(request, user)
    );

    assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    verify(clientRepository, never()).save(any(Client.class));
  }

  @Test
  void deleteClientDetachesOnlyOwnersInvoicesBeforeDeletion() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    Client client = Client.builder()
      .id("CL-AB1234")
      .name("Mario Rossi")
      .email("mario.rossi@test.it")
      .address(new Address("Via Roma 1", "Roma", "00100", "Italia"))
      .user(user)
      .build();

    when(clientRepository.findByIdAndUser("CL-AB1234", user)).thenReturn(Optional.of(client));

    clientService.deleteClient("CL-AB1234", user);

    verify(invoiceRepository).detachClient(client, user);
    verify(clientRepository).delete(client);
  }

  private ClientRequest request(String name, String email) {
    return new ClientRequest(
      name,
      email,
      "+39 333 1234567",
      "IT12345678901",
      "RSSMRA90A01H501Z",
      new ClientAddressRequest("Via Roma 1", "Roma", "00100", "Italia"),
      "Cliente ricorrente"
    );
  }
}

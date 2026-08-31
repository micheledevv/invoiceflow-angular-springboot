package com.invoiceflow;

import com.invoiceflow.client.Client;
import com.invoiceflow.client.ClientRepository;
import com.invoiceflow.dto.ClientAddressRequest;
import com.invoiceflow.dto.InvoiceItemRequest;
import com.invoiceflow.dto.InvoiceRequest;
import com.invoiceflow.dto.SenderAddressRequest;
import com.invoiceflow.model.Address;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceStatus;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.service.InvoiceService;
import com.invoiceflow.user.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InvoiceClientLinkTests {

  @Mock
  private InvoiceRepository invoiceRepository;

  @Mock
  private ClientRepository clientRepository;

  @InjectMocks
  private InvoiceService invoiceService;

  @Test
  void createInvoiceLinksOwnedClientAndCopiesBillingSnapshot() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    Address clientAddress = new Address("Via Roma 1", "Roma", "00100", "Italia");
    Client client = Client.builder()
      .id("CL-AB1234")
      .name("Mario Rossi")
      .email("mario.rossi@test.it")
      .address(clientAddress)
      .user(user)
      .build();
    InvoiceRequest request = request("CL-AB1234");

    when(invoiceRepository.existsById("AB1234")).thenReturn(false);
    when(clientRepository.findByIdAndUser("CL-AB1234", user)).thenReturn(Optional.of(client));
    when(invoiceRepository.save(any(Invoice.class))).thenAnswer(invocation -> invocation.getArgument(0));

    Invoice invoice = invoiceService.createInvoice(request, user);

    assertEquals("CL-AB1234", invoice.getClientId());
    assertEquals(client, invoice.getClient());
    assertEquals("Mario Rossi", invoice.getClientName());
    assertEquals("mario.rossi@test.it", invoice.getClientEmail());
    assertNotSame(clientAddress, invoice.getClientAddress());
    assertEquals(clientAddress.getStreet(), invoice.getClientAddress().getStreet());
    assertEquals(clientAddress.getCity(), invoice.getClientAddress().getCity());
    assertEquals(clientAddress.getPostCode(), invoice.getClientAddress().getPostCode());
    assertEquals(clientAddress.getCountry(), invoice.getClientAddress().getCountry());
    assertEquals(20.0, invoice.getTotal());
    verify(invoiceRepository).save(invoice);
  }

  @Test
  void createInvoiceCannotLinkAnotherUsersClient() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    InvoiceRequest request = request("CL-AB1234");

    when(invoiceRepository.existsById("AB1234")).thenReturn(false);
    when(clientRepository.findByIdAndUser("CL-AB1234", user)).thenReturn(Optional.empty());

    ResponseStatusException exception = assertThrows(
      ResponseStatusException.class,
      () -> invoiceService.createInvoice(request, user)
    );

    assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    verify(invoiceRepository, never()).save(any(Invoice.class));
  }

  private InvoiceRequest request(String clientId) {
    return new InvoiceRequest(
      clientId,
      "AB1234",
      "2026-08-31",
      "Consulenza",
      30,
      "Dati ignorati",
      "ignored@test.it",
      "Michele Pugliese",
      InvoiceStatus.pending,
      new SenderAddressRequest("Via Milano 2", "Milano", "20100", "Italia"),
      new ClientAddressRequest("Via Ignorata 3", "Torino", "10100", "Italia"),
      List.of(new InvoiceItemRequest("Sviluppo", 2, BigDecimal.TEN))
    );
  }
}

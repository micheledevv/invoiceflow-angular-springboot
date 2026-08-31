package com.invoiceflow;

import com.invoiceflow.client.ClientRepository;
import com.invoiceflow.dto.SentInvoiceSearchCriteria;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceStatus;
import com.invoiceflow.repository.InvoiceRepository;
import com.invoiceflow.service.InvoiceService;
import com.invoiceflow.user.AppUser;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SentInvoiceSearchTests {

  @Mock
  private InvoiceRepository invoiceRepository;

  @Mock
  private ClientRepository clientRepository;

  @InjectMocks
  private InvoiceService invoiceService;

  @Test
  void searchesSentInvoicesWithWhitelistedSorting() {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();
    SentInvoiceSearchCriteria criteria = criteria(
      InvoiceStatus.pending,
      "2026-01-01",
      "2026-12-31",
      100.0,
      500.0,
      "total",
      "asc"
    );

    when(invoiceRepository.findAll(
      any(Specification.class),
      any(Sort.class)
    )).thenReturn(List.of());

    List<Invoice> result = invoiceService.searchSentInvoices(criteria, user);

    ArgumentCaptor<Sort> sortCaptor = ArgumentCaptor.forClass(Sort.class);
    verify(invoiceRepository).findAll(any(Specification.class), sortCaptor.capture());

    assertEquals(List.of(), result);
    assertEquals(Sort.Direction.ASC, sortCaptor.getValue().getOrderFor("total").getDirection());
  }

  @Test
  void rejectsDraftsFromSentInvoices() {
    assertBadRequest(criteria(
      InvoiceStatus.draft,
      null,
      null,
      null,
      null,
      "createdAt",
      "desc"
    ));
  }

  @Test
  void rejectsInvalidDateAndAmountRanges() {
    assertBadRequest(criteria(
      null,
      "2026-12-31",
      "2026-01-01",
      null,
      null,
      "createdAt",
      "desc"
    ));

    assertBadRequest(criteria(
      null,
      null,
      null,
      500.0,
      100.0,
      "createdAt",
      "desc"
    ));
  }

  @Test
  void rejectsUnsupportedSorting() {
    assertBadRequest(criteria(
      null,
      null,
      null,
      null,
      null,
      "user.password",
      "desc"
    ));
  }

  private void assertBadRequest(SentInvoiceSearchCriteria criteria) {
    AppUser user = AppUser.builder().id(1L).email("owner@test.it").build();

    ResponseStatusException exception = assertThrows(
      ResponseStatusException.class,
      () -> invoiceService.searchSentInvoices(criteria, user)
    );

    assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    verify(invoiceRepository, never()).findAll(
      any(Specification.class),
      any(Sort.class)
    );
  }

  private SentInvoiceSearchCriteria criteria(
    InvoiceStatus status,
    String dateFrom,
    String dateTo,
    Double minTotal,
    Double maxTotal,
    String sortBy,
    String sortDirection
  ) {
    return new SentInvoiceSearchCriteria(
      "cliente",
      status,
      dateFrom,
      dateTo,
      minTotal,
      maxTotal,
      sortBy,
      sortDirection
    );
  }
}

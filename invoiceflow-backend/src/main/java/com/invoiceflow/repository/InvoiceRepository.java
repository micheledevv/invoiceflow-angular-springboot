package com.invoiceflow.repository;

import com.invoiceflow.client.Client;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.user.AppUser;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends
  JpaRepository<Invoice, String>,
  JpaSpecificationExecutor<Invoice> {
  @Override
  @EntityGraph(attributePaths = "items")
  List<Invoice> findAll(Specification<Invoice> specification, Sort sort);

  List<Invoice> findByUser(AppUser user);

  Optional<Invoice> findByIdAndUser(String id, AppUser user);

  List<Invoice> findByClientAndUserOrderByCreatedAtDesc(Client client, AppUser user);

  Long countByClientAndUser(Client client, AppUser user);

  @Query("""
    select coalesce(sum(invoice.total), 0)
    from Invoice invoice
    where invoice.client = :client
    and invoice.user = :user
  """)
  Double sumTotalByClientAndUser(
    @Param("client") Client client,
    @Param("user") AppUser user
  );

  @Modifying(clearAutomatically = true, flushAutomatically = true)
  @Query("""
    update Invoice invoice
    set invoice.client = null
    where invoice.client = :client
    and invoice.user = :user
  """)
  int detachClient(
    @Param("client") Client client,
    @Param("user") AppUser user
  );
}

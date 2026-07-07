package com.invoiceflow.repository;

import com.invoiceflow.model.Invoice;
import com.invoiceflow.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, String> {
  List<Invoice> findByUser(AppUser user);

  Optional<Invoice> findByIdAndUser(String id, AppUser user);
}

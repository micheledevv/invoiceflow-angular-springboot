package com.invoiceflow.client;

import com.invoiceflow.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, String> {
  List<Client> findByUserOrderByCreatedAtDescNameAsc(AppUser user);

  Optional<Client> findByIdAndUser(String id, AppUser user);

  boolean existsByEmailAndUser(String email, AppUser user);
}

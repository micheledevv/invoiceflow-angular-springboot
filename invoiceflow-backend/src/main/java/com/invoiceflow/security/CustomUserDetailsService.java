package com.invoiceflow.security;

import com.invoiceflow.user.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final AppUserRepository appUserRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return appUserRepository.findByEmail(email)
      .map(user -> User.builder()
        .username(user.getEmail())
        .password(user.getPassword())
        .roles("USER")
        .build()
      )
      .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato"));
  }
}

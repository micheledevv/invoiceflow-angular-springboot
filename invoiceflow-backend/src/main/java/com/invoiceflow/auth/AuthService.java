package com.invoiceflow.auth;

import com.invoiceflow.model.Address;
import com.invoiceflow.security.JwtService;
import com.invoiceflow.user.AppUser;
import com.invoiceflow.user.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private static final String DEFAULT_AVATAR = "assets/images/default_logo.jpeg";
  private static final int DEFAULT_PAYMENT_TERMS = 30;

  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthResponse register(RegisterRequest request) {
    if (appUserRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("Email già registrata");
    }

    String avatar = normalizeAvatar(request.avatarBase64());

    validateSenderAddress(request.senderAddress());

    AppUser user = AppUser.builder()
      .fullName(request.fullName())
      .email(request.email())
      .password(passwordEncoder.encode(request.password()))
      .avatarBase64(avatar)
      .senderAddress(request.senderAddress())
      .defaultPaymentTerms(DEFAULT_PAYMENT_TERMS)
      .build();

    AppUser savedUser = appUserRepository.save(user);
    String token = jwtService.generateToken(savedUser);

    return buildAuthResponse(token, savedUser);
  }

  public AuthResponse login(LoginRequest request) {
    AppUser user = appUserRepository.findByEmail(request.email())
      .orElseThrow(() -> new BadCredentialsException("Credenziali non valide"));

    boolean passwordMatches = passwordEncoder.matches(
      request.password(),
      user.getPassword()
    );

    if (!passwordMatches) {
      throw new BadCredentialsException("Credenziali non valide");
    }

    String token = jwtService.generateToken(user);

    return buildAuthResponse(token, user);
  }

  private AuthResponse buildAuthResponse(String token, AppUser user) {
    return new AuthResponse(
      token,
      user.getId(),
      user.getFullName(),
      user.getEmail(),
      user.getAvatarBase64(),
      user.getSenderAddress(),
      user.getDefaultPaymentTerms() != null ? user.getDefaultPaymentTerms() : DEFAULT_PAYMENT_TERMS
    );
  }

  private String normalizeAvatar(String avatarBase64) {
    if (isBlank(avatarBase64)) {
      return DEFAULT_AVATAR;
    }

    if (avatarBase64.equals(DEFAULT_AVATAR)) {
      return DEFAULT_AVATAR;
    }

    validateAvatar(avatarBase64);

    return avatarBase64;
  }

  private void validateAvatar(String avatarBase64) {
    boolean isValidImage =
      avatarBase64 != null &&
        (
          avatarBase64.startsWith("data:image/png;base64,") ||
            avatarBase64.startsWith("data:image/jpeg;base64,") ||
            avatarBase64.startsWith("data:image/webp;base64,")
        );

    if (!isValidImage) {
      throw new IllegalArgumentException("Formato immagine non valido");
    }

    int maxBase64Length = 1_400_000;

    if (avatarBase64.length() > maxBase64Length) {
      throw new IllegalArgumentException("Immagine troppo grande");
    }
  }

  private void validateSenderAddress(Address address) {
    if (address == null) {
      throw new IllegalArgumentException("Indirizzo mittente obbligatorio");
    }

    if (isBlank(address.getStreet())) {
      throw new IllegalArgumentException("Indirizzo mittente obbligatorio");
    }

    if (isBlank(address.getCity())) {
      throw new IllegalArgumentException("Città mittente obbligatoria");
    }

    if (isBlank(address.getPostCode()) || !address.getPostCode().matches("^[0-9]{5}$")) {
      throw new IllegalArgumentException("CAP mittente non valido");
    }

    if (isBlank(address.getCountry())) {
      throw new IllegalArgumentException("Paese mittente obbligatorio");
    }
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}

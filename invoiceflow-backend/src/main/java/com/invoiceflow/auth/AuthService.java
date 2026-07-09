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

  private static final String DEFAULT_AVATAR = "assets/images/logo.svg";

  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthResponse register(RegisterRequest request) {
    if (appUserRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("Email già registrata");
    }

    String avatar = isBlank(request.avatarBase64())
      ? DEFAULT_AVATAR
      : request.avatarBase64();

    if (!avatar.equals(DEFAULT_AVATAR)) {
      validateAvatar(avatar);
    }

    validateSenderAddress(request.senderAddress());

    AppUser user = AppUser.builder()
      .fullName(request.fullName())
      .email(request.email())
      .password(passwordEncoder.encode(request.password()))
      .avatarBase64(avatar)
      .senderAddress(request.senderAddress())
      .build();

    AppUser savedUser = appUserRepository.save(user);
    String token = jwtService.generateToken(savedUser);

    return new AuthResponse(
      token,
      savedUser.getId(),
      savedUser.getFullName(),
      savedUser.getEmail(),
      savedUser.getAvatarBase64(),
      savedUser.getSenderAddress()
    );
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

    return new AuthResponse(
      token,
      user.getId(),
      user.getFullName(),
      user.getEmail(),
      user.getAvatarBase64(),
      user.getSenderAddress()
    );
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

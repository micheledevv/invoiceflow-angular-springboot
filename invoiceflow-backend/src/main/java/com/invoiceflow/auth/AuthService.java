package com.invoiceflow.auth;

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

  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthResponse register(RegisterRequest request) {
    if (appUserRepository.existsByEmail(request.email())) {
      throw new IllegalArgumentException("Email già registrata");
    }

    validateAvatar(request.avatarBase64());

    AppUser user = AppUser.builder()
      .fullName(request.fullName())
      .email(request.email())
      .password(passwordEncoder.encode(request.password()))
      .avatarBase64(request.avatarBase64())
      .build();

    AppUser savedUser = appUserRepository.save(user);
    String token = jwtService.generateToken(savedUser);

    return new AuthResponse(
      token,
      savedUser.getId(),
      savedUser.getFullName(),
      savedUser.getEmail(),
      savedUser.getAvatarBase64()
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
      user.getAvatarBase64()
    );
  }

  private void validateAvatar(String avatarBase64) {
    boolean isValidImage =
      avatarBase64.startsWith("data:image/png;base64,") ||
        avatarBase64.startsWith("data:image/jpeg;base64,") ||
        avatarBase64.startsWith("data:image/webp;base64,");

    if (!isValidImage) {
      throw new IllegalArgumentException("Formato immagine non valido");
    }

    int maxBase64Length = 1_400_000;

    if (avatarBase64.length() > maxBase64Length) {
      throw new IllegalArgumentException("Immagine troppo grande");
    }
  }
}

package com.invoiceflow.settings;

import com.invoiceflow.model.Address;
import com.invoiceflow.user.AppUser;
import com.invoiceflow.user.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

  private static final String DEFAULT_AVATAR = "assets/images/default_logo.jpeg";
  private static final int DEFAULT_PAYMENT_TERMS = 30;

  private final AppUserRepository appUserRepository;
  private final PasswordEncoder passwordEncoder;

  public UserSettingsResponse getSettings(AppUser authenticatedUser) {
    AppUser user = getManagedUser(authenticatedUser);

    return buildResponse(user);
  }

  public UserSettingsResponse updateProfile(
    AppUser authenticatedUser,
    UpdateProfileRequest request
  ) {
    AppUser user = getManagedUser(authenticatedUser);

    validateSenderAddress(request.senderAddress());

    String avatar = normalizeAvatar(request.avatarBase64());

    user.setFullName(request.fullName());
    user.setAvatarBase64(avatar);
    user.setSenderAddress(request.senderAddress());

    AppUser savedUser = appUserRepository.save(user);

    return buildResponse(savedUser);
  }

  public UserSettingsResponse updateInvoicePreferences(
    AppUser authenticatedUser,
    UpdateInvoicePreferencesRequest request
  ) {
    AppUser user = getManagedUser(authenticatedUser);

    validatePaymentTerms(request.defaultPaymentTerms());

    user.setDefaultPaymentTerms(request.defaultPaymentTerms());

    AppUser savedUser = appUserRepository.save(user);

    return buildResponse(savedUser);
  }

  public void changePassword(
    AppUser authenticatedUser,
    ChangePasswordRequest request
  ) {
    AppUser user = getManagedUser(authenticatedUser);

    boolean passwordMatches = passwordEncoder.matches(
      request.currentPassword(),
      user.getPassword()
    );

    if (!passwordMatches) {
      throw new BadCredentialsException("Password attuale non valida");
    }

    user.setPassword(passwordEncoder.encode(request.newPassword()));

    appUserRepository.save(user);
  }

  private AppUser getManagedUser(AppUser authenticatedUser) {
    return appUserRepository.findById(authenticatedUser.getId())
      .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
  }

  private UserSettingsResponse buildResponse(AppUser user) {
    return new UserSettingsResponse(
      user.getId(),
      user.getFullName(),
      user.getEmail(),
      user.getAvatarBase64(),
      user.getSenderAddress(),
      user.getDefaultPaymentTerms() != null ? user.getDefaultPaymentTerms() : DEFAULT_PAYMENT_TERMS
    );
  }

  private void validatePaymentTerms(Integer paymentTerms) {
    if (
      paymentTerms == null ||
        (
          paymentTerms != 1 &&
            paymentTerms != 7 &&
            paymentTerms != 14 &&
            paymentTerms != 30
        )
    ) {
      throw new IllegalArgumentException("Termini di pagamento non validi");
    }
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

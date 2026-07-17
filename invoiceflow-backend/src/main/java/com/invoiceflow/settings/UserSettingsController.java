package com.invoiceflow.settings;

import com.invoiceflow.user.AppUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserSettingsController {

  private final UserSettingsService userSettingsService;

  @GetMapping
  public UserSettingsResponse getSettings(
    @AuthenticationPrincipal AppUser user
  ) {
    return userSettingsService.getSettings(user);
  }

  @PutMapping("/profile")
  public UserSettingsResponse updateProfile(
    @AuthenticationPrincipal AppUser user,
    @Valid @RequestBody UpdateProfileRequest request
  ) {
    return userSettingsService.updateProfile(user, request);
  }

  @PutMapping("/invoice-preferences")
  public UserSettingsResponse updateInvoicePreferences(
    @AuthenticationPrincipal AppUser user,
    @Valid @RequestBody UpdateInvoicePreferencesRequest request
  ) {
    return userSettingsService.updateInvoicePreferences(user, request);
  }

  @PutMapping("/password")
  public void changePassword(
    @AuthenticationPrincipal AppUser user,
    @Valid @RequestBody ChangePasswordRequest request
  ) {
    userSettingsService.changePassword(user, request);
  }
}

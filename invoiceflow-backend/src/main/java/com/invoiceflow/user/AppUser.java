package com.invoiceflow.user;

import com.invoiceflow.model.Address;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String fullName;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(columnDefinition = "TEXT")
  private String avatarBase64;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "street", column = @Column(name = "sender_street")),
    @AttributeOverride(name = "city", column = @Column(name = "sender_city")),
    @AttributeOverride(name = "postCode", column = @Column(name = "sender_post_code")),
    @AttributeOverride(name = "country", column = @Column(name = "sender_country"))
  })
  private Address senderAddress;
}

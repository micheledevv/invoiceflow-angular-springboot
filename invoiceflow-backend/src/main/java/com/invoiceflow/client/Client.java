package com.invoiceflow.client;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.invoiceflow.model.Address;
import com.invoiceflow.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

  @Id
  private String id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String email;

  private String phone;

  private String vatNumber;

  private String taxCode;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "street", column = @Column(name = "client_street")),
    @AttributeOverride(name = "city", column = @Column(name = "client_city")),
    @AttributeOverride(name = "postCode", column = @Column(name = "client_post_code")),
    @AttributeOverride(name = "country", column = @Column(name = "client_country"))
  })
  private Address address;

  @Column(columnDefinition = "TEXT")
  private String notes;

  private Integer invoicesCount;

  private Double totalBilled;

  private String createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private AppUser user;
}

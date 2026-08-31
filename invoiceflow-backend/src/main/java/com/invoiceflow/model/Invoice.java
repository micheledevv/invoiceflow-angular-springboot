package com.invoiceflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.invoiceflow.client.Client;
import com.invoiceflow.user.AppUser;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

  @Id
  private String id;

  private String createdAt;

  private String paymentDue;

  private String description;

  private Integer paymentTerms;

  private String clientName;

  private String clientEmail;

  private String senderName;

  @Enumerated(EnumType.STRING)
  private InvoiceStatus status;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "street", column = @Column(name = "sender_street")),
    @AttributeOverride(name = "city", column = @Column(name = "sender_city")),
    @AttributeOverride(name = "postCode", column = @Column(name = "sender_post_code")),
    @AttributeOverride(name = "country", column = @Column(name = "sender_country"))
  })
  private Address senderAddress;

  @Embedded
  @AttributeOverrides({
    @AttributeOverride(name = "street", column = @Column(name = "client_street")),
    @AttributeOverride(name = "city", column = @Column(name = "client_city")),
    @AttributeOverride(name = "postCode", column = @Column(name = "client_post_code")),
    @AttributeOverride(name = "country", column = @Column(name = "client_country"))
  })
  private Address clientAddress;

  @OneToMany(
    mappedBy = "invoice",
    cascade = CascadeType.ALL,
    orphanRemoval = true
  )
  @Builder.Default
  private List<InvoiceItem> items = new ArrayList<>();

  private Double total;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private AppUser user;

  public void prepareItemsForSave() {
    if (items == null) {
      items = new ArrayList<>();
    }

    for (InvoiceItem item : items) {
      item.setInvoice(this);
      item.calculateTotal();
    }

    calculateTotal();
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "client_id")
  @JsonIgnore
  private Client client;

  @JsonProperty("clientId")
  public String getClientId() {
    return client != null ? client.getId() : null;
  }

  public void replaceItems(List<InvoiceItem> newItems) {
    this.items.clear();

    if (newItems != null) {
      for (InvoiceItem item : newItems) {
        item.setInvoice(this);
        item.calculateTotal();
        this.items.add(item);
      }
    }

    calculateTotal();
  }

  public void calculateTotal() {
    this.total = this.items.stream()
      .mapToDouble(item -> item.getTotal() != null ? item.getTotal() : 0)
      .sum();
  }
}

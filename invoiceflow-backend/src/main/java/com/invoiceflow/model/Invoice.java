package com.invoiceflow.model;
import com.invoiceflow.user.AppUser;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Invoice {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private AppUser user;

  @Id
  private String id;

  private String createdAt;
  private String paymentDue;
  private String description;
  private Integer paymentTerms;
  private String clientName;
  private String clientEmail;

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

  @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<InvoiceItem> items = new ArrayList<>();

  private Double total;

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

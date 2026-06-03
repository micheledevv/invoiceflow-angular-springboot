package com.invoiceflow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class InvoiceItem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long itemId;

  private String name;
  private Integer quantity;
  private Double price;
  private Double total;

  @ManyToOne
  @JoinColumn(name = "invoice_id")
  @JsonIgnore
  private Invoice invoice;

  public void calculateTotal() {
    if (quantity != null && price != null) {
      this.total = quantity * price;
    }
  }
}

package com.invoiceflow.model;

import java.util.List;

public class Invoice {
    private String id;
    private String createdAt;
    private String paymentDue;
    private String description;
    private int paymentTerms;
    private String clientName;
    private String clientEmail;
    private String status;
    private Address senderAddress;
    private Address clientAddress;
    private List<InvoiceItem> items;
    private double total;

    public Invoice(
            String id,
            String createdAt,
            String paymentDue,
            String description,
            int paymentTerms,
            String clientName,
            String clientEmail,
            String status,
            Address senderAddress,
            Address clientAddress,
            List<InvoiceItem> items
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.paymentDue = paymentDue;
        this.description = description;
        this.paymentTerms = paymentTerms;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.status = status;
        this.senderAddress = senderAddress;
        this.clientAddress = clientAddress;
        this.items = items;
        this.total = calculateTotal(items);
    }

    private double calculateTotal(List<InvoiceItem> items) {
        return items.stream()
                .mapToDouble(InvoiceItem::getTotal)
                .sum();
    }

    public String getId() {
        return id;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public String getPaymentDue() {
        return paymentDue;
    }

    public String getDescription() {
        return description;
    }

    public int getPaymentTerms() {
        return paymentTerms;
    }

    public String getClientName() {
        return clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public String getStatus() {
        return status;
    }

    public Address getSenderAddress() {
        return senderAddress;
    }

    public Address getClientAddress() {
        return clientAddress;
    }

    public List<InvoiceItem> getItems() {
        return items;
    }

    public double getTotal() {
        return total;
    }
}
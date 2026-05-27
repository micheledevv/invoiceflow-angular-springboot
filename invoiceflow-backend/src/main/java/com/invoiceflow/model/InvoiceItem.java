package com.invoiceflow.model;

public class InvoiceItem {
    private String name;
    private int quantity;
    private double price;
    private double total;

    public InvoiceItem(String name, int quantity, double price) {
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.total = quantity * price;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }

    public double getPrice() {
        return price;
    }

    public double getTotal() {
        return total;
    }
}
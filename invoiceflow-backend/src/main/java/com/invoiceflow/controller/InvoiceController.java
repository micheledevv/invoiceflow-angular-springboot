package com.invoiceflow.controller;

import com.invoiceflow.model.Invoice;
import com.invoiceflow.service.InvoiceService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping("/api/invoices")
    public List<Invoice> getInvoices() {
        return invoiceService.getInvoices();
    }

    @GetMapping("/api/invoices/{id}")
    public Invoice getInvoiceById(@PathVariable String id) {
        return invoiceService.getInvoiceById(id);
    }
}
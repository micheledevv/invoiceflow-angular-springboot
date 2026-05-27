package com.invoiceflow.service;

import com.invoiceflow.model.Address;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceItem;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    public List<Invoice> getInvoices() {
        return List.of(
                new Invoice(
                        "RT3080",
                        "2021-08-18",
                        "2021-08-19",
                        "Rebranding aziendale",
                        1,
                        "Giovanni Rossi",
                        "giovanni.rossi@mail.com",
                        "paid",
                        new Address("Via Roma 19", "Milano", "20121", "Italia"),
                        new Address("Via Verdi 106", "Torino", "10121", "Italia"),
                        List.of(
                                new InvoiceItem("Linee guida del brand", 1, 1800.90)
                        )
                ),
                new Invoice(
                        "XM9141",
                        "2021-09-20",
                        "2021-09-30",
                        "Progettazione grafica",
                        10,
                        "Alessandro Grimaldi",
                        "alessandro.grimaldi@mail.com",
                        "pending",
                        new Address("Via Garibaldi 45", "Roma", "00184", "Italia"),
                        new Address("Corso Vittorio Emanuele 22", "Palermo", "90133", "Italia"),
                        List.of(
                                new InvoiceItem("Design banner pubblicitario", 1, 156.00),
                                new InvoiceItem("Design email promozionale", 2, 200.00)
                        )
                ),
                new Invoice(
                        "RG0314",
                        "2021-10-01",
                        "2021-10-31",
                        "Sviluppo sito web",
                        30,
                        "Luca Bianchi",
                        "luca.bianchi@mail.com",
                        "paid",
                        new Address("Via Dante Alighieri 8", "Firenze", "50122", "Italia"),
                        new Address("Via Etnea 240", "Catania", "95131", "Italia"),
                        List.of(
                                new InvoiceItem("Sviluppo homepage", 1, 1200.00),
                                new InvoiceItem("Sviluppo pagina contatti", 1, 650.00),
                                new InvoiceItem("Ottimizzazione responsive", 1, 450.00)
                        )
                ),
                new Invoice(
                        "RT2080",
                        "2021-10-12",
                        "2021-11-11",
                        "Consulenza UX/UI",
                        30,
                        "Martina Ferraro",
                        "martina.ferraro@mail.com",
                        "pending",
                        new Address("Via Manzoni 12", "Napoli", "80121", "Italia"),
                        new Address("Via Libertà 88", "Bari", "70123", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi esperienza utente", 1, 750.00),
                                new InvoiceItem("Wireframe applicazione", 2, 400.00)
                        )
                ),
                new Invoice(
                        "AA1449",
                        "2021-10-14",
                        "2021-11-13",
                        "Campagna social media",
                        30,
                        "Sofia Romano",
                        "sofia.romano@mail.com",
                        "pending",
                        new Address("Via Torino 55", "Genova", "16129", "Italia"),
                        new Address("Via Mazzini 73", "Bologna", "40121", "Italia"),
                        List.of(
                                new InvoiceItem("Creazione contenuti social", 5, 120.00),
                                new InvoiceItem("Gestione campagna sponsorizzata", 1, 900.00)
                        )
                ),
                new Invoice(
                        "TY9141",
                        "2021-10-31",
                        "2021-11-30",
                        "Realizzazione landing page",
                        30,
                        "Francesco Marino",
                        "francesco.marino@mail.com",
                        "pending",
                        new Address("Via Po 17", "Torino", "10124", "Italia"),
                        new Address("Via Roma 120", "Marsala", "91025", "Italia"),
                        List.of(
                                new InvoiceItem("Design landing page", 1, 850.00),
                                new InvoiceItem("Sviluppo landing page", 1, 1250.00),
                                new InvoiceItem("Integrazione form contatti", 1, 350.00)
                        )
                ),
                new Invoice(
                        "FV2353",
                        "2021-11-12",
                        "2021-12-12",
                        "Bozza preventivo ecommerce",
                        30,
                        "Anna Ricci",
                        "anna.ricci@mail.com",
                        "draft",
                        new Address("Via Monte Napoleone 5", "Milano", "20121", "Italia"),
                        new Address("Via Archimede 14", "Siracusa", "96100", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi requisiti ecommerce", 1, 500.00),
                                new InvoiceItem("Prototipo interfaccia", 1, 700.00)
                        )
                ),
                new Invoice(
                        "FV2353",
                        "2021-11-12",
                        "2021-12-12",
                        "Bozza preventivo ecommerce",
                        30,
                        "Anna Ricci",
                        "anna.ricci@mail.com",
                        "draft",
                        new Address("Via Monte Napoleone 5", "Milano", "20121", "Italia"),
                        new Address("Via Archimede 14", "Siracusa", "96100", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi requisiti ecommerce", 1, 500.00),
                                new InvoiceItem("Prototipo interfaccia", 1, 700.00)
                        )
                ),
                new Invoice(
                        "FV2353",
                        "2021-11-12",
                        "2021-12-12",
                        "Bozza preventivo ecommerce",
                        30,
                        "Anna Ricci",
                        "anna.ricci@mail.com",
                        "draft",
                        new Address("Via Monte Napoleone 5", "Milano", "20121", "Italia"),
                        new Address("Via Archimede 14", "Siracusa", "96100", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi requisiti ecommerce", 1, 500.00),
                                new InvoiceItem("Prototipo interfaccia", 1, 700.00)
                        )
                ),
                new Invoice(
                        "FV2353",
                        "2021-11-12",
                        "2021-12-12",
                        "Bozza preventivo ecommerce",
                        30,
                        "Anna Ricci",
                        "anna.ricci@mail.com",
                        "draft",
                        new Address("Via Monte Napoleone 5", "Milano", "20121", "Italia"),
                        new Address("Via Archimede 14", "Siracusa", "96100", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi requisiti ecommerce", 1, 500.00),
                                new InvoiceItem("Prototipo interfaccia", 1, 700.00)
                        )
                ),
                new Invoice(
                        "FV2353",
                        "2021-11-12",
                        "2021-12-12",
                        "Bozza preventivo ecommerce",
                        30,
                        "Anna Ricci",
                        "anna.ricci@mail.com",
                        "draft",
                        new Address("Via Monte Napoleone 5", "Milano", "20121", "Italia"),
                        new Address("Via Archimede 14", "Siracusa", "96100", "Italia"),
                        List.of(
                                new InvoiceItem("Analisi requisiti ecommerce", 1, 500.00),
                                new InvoiceItem("Prototipo interfaccia", 1, 700.00)
                        )
                )
        );
    }

    public Invoice getInvoiceById(String id) {
        return getInvoices()
                .stream()
                .filter(invoice -> invoice.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
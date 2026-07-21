package com.invoiceflow.service;

import com.invoiceflow.model.Address;
import com.invoiceflow.model.Invoice;
import com.invoiceflow.model.InvoiceItem;
import com.invoiceflow.model.InvoiceStatus;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class InvoicePdfService {

  private static final float MARGIN = 48;
  private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
  private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
  private static final float BOTTOM_MARGIN = 56;

  private static final PDFont FONT_REGULAR = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
  private static final PDFont FONT_BOLD = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

  public byte[] generateInvoicePdf(Invoice invoice) {
    try (
      PDDocument document = new PDDocument();
      ByteArrayOutputStream outputStream = new ByteArrayOutputStream()
    ) {
      PdfContext context = new PdfContext(document);
      context.addPage();

      drawHeader(context, invoice);
      drawInvoiceMeta(context, invoice);
      drawAddresses(context, invoice);
      drawItemsTable(context, invoice);
      drawTotal(context, invoice);
      drawFooter(context);

      context.close();
      document.save(outputStream);

      return outputStream.toByteArray();
    } catch (IOException exception) {
      throw new ResponseStatusException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Impossibile generare il PDF della fattura"
      );
    }
  }

  private void drawHeader(PdfContext context, Invoice invoice) throws IOException {
    drawText(context, "InvoiceFlow", FONT_BOLD, 20, MARGIN, context.y);
    drawTextRight(context, "FATTURA", FONT_BOLD, 22, PAGE_WIDTH - MARGIN, context.y);

    context.y -= 24;

    drawText(context, "Copia PDF di cortesia generata dall'app", FONT_REGULAR, 10, MARGIN, context.y);
    drawTextRight(context, "#" + safeText(invoice.getId()), FONT_BOLD, 12, PAGE_WIDTH - MARGIN, context.y);

    context.y -= 34;

    drawLine(context, MARGIN, context.y, PAGE_WIDTH - MARGIN, context.y);

    context.y -= 32;
  }

  private void drawInvoiceMeta(PdfContext context, Invoice invoice) throws IOException {
    float leftX = MARGIN;
    float middleX = 230;
    float rightX = 410;

    drawLabelValue(context, "Data fattura", formatDate(invoice.getCreatedAt()), leftX, context.y);
    drawLabelValue(context, "Scadenza", formatDate(invoice.getPaymentDue()), middleX, context.y);
    drawLabelValue(context, "Stato", formatStatus(invoice.getStatus()), rightX, context.y);

    context.y -= 42;

    drawLabelValue(context, "Descrizione", invoice.getDescription(), leftX, context.y);

    context.y -= 44;
  }

  private void drawAddresses(PdfContext context, Invoice invoice) throws IOException {
    float startY = context.y;

    drawAddressBlock(
      context,
      "Mittente",
      invoice.getSenderName(),
      invoice.getSenderAddress(),
      MARGIN,
      startY
    );

    drawAddressBlock(
      context,
      "Cliente",
      invoice.getClientName(),
      invoice.getClientAddress(),
      320,
      startY
    );

    context.y = startY - 116;
  }

  private void drawAddressBlock(
    PdfContext context,
    String title,
    String name,
    Address address,
    float x,
    float y
  ) throws IOException {
    drawText(context, title, FONT_BOLD, 11, x, y);

    y -= 18;

    drawText(context, safeText(name), FONT_BOLD, 10, x, y);

    y -= 15;

    if (address == null) {
      drawText(context, "-", FONT_REGULAR, 10, x, y);
      return;
    }

    drawText(context, safeText(address.getStreet()), FONT_REGULAR, 10, x, y);
    y -= 14;

    drawText(
      context,
      safeText(address.getPostCode()) + " " + safeText(address.getCity()),
      FONT_REGULAR,
      10,
      x,
      y
    );

    y -= 14;

    drawText(context, safeText(address.getCountry()), FONT_REGULAR, 10, x, y);
  }

  private void drawItemsTable(PdfContext context, Invoice invoice) throws IOException {
    context.ensureSpace(120);

    drawText(context, "Articoli", FONT_BOLD, 13, MARGIN, context.y);

    context.y -= 24;

    float tableX = MARGIN;
    float tableWidth = PAGE_WIDTH - (MARGIN * 2);

    drawFilledRectangle(context, tableX, context.y - 22, tableWidth, 30);

    drawText(context, "Nome", FONT_BOLD, 9, tableX + 12, context.y - 11);
    drawTextRight(context, "Q.ta", FONT_BOLD, 9, tableX + 340, context.y - 11);
    drawTextRight(context, "Prezzo", FONT_BOLD, 9, tableX + 430, context.y - 11);
    drawTextRight(context, "Totale", FONT_BOLD, 9, tableX + tableWidth - 12, context.y - 11);

    context.y -= 44;

    List<InvoiceItem> items = invoice.getItems() != null ? invoice.getItems() : List.of();

    if (items.isEmpty()) {
      drawText(context, "Nessun articolo presente", FONT_REGULAR, 10, tableX + 12, context.y);
      context.y -= 24;
      return;
    }

    for (InvoiceItem item : items) {
      drawItemRow(context, item);
    }
  }

  private void drawItemRow(PdfContext context, InvoiceItem item) throws IOException {
    float tableX = MARGIN;
    float tableWidth = PAGE_WIDTH - (MARGIN * 2);

    String name = safeText(item.getName());
    List<String> nameLines = wrapText(name, FONT_REGULAR, 10, 250);

    float rowHeight = Math.max(30, 18 + (nameLines.size() * 13));

    context.ensureSpace(rowHeight + 12);

    float rowTopY = context.y;

    for (int i = 0; i < nameLines.size(); i++) {
      drawText(context, nameLines.get(i), FONT_REGULAR, 10, tableX + 12, rowTopY - (i * 13));
    }

    drawTextRight(context, String.valueOf(safeQuantity(item)), FONT_REGULAR, 10, tableX + 340, rowTopY);
    drawTextRight(context, formatAmount(item.getPrice()), FONT_REGULAR, 10, tableX + 430, rowTopY);
    drawTextRight(context, formatAmount(resolveItemTotal(item)), FONT_BOLD, 10, tableX + tableWidth - 12, rowTopY);

    context.y -= rowHeight;

    drawLine(context, tableX, context.y + 8, tableX + tableWidth, context.y + 8);

    context.y -= 10;
  }

  private void drawTotal(PdfContext context, Invoice invoice) throws IOException {
    context.ensureSpace(76);

    float boxWidth = 220;
    float boxHeight = 54;
    float boxX = PAGE_WIDTH - MARGIN - boxWidth;
    float boxY = context.y - boxHeight;

    drawDarkRectangle(context, boxX, boxY, boxWidth, boxHeight);

    setFillColor(context, 255, 255, 255);

    drawText(context, "Totale fattura", FONT_BOLD, 11, boxX + 16, boxY + 32);
    drawTextRight(context, formatAmount(invoice.getTotal()), FONT_BOLD, 16, boxX + boxWidth - 16, boxY + 29);

    setFillColor(context, 0, 0, 0);

    context.y -= 84;
  }

  private void drawFooter(PdfContext context) throws IOException {
    context.ensureSpace(40);

    drawLine(context, MARGIN, context.y, PAGE_WIDTH - MARGIN, context.y);

    context.y -= 18;

    drawText(
      context,
      "Documento PDF generato da InvoiceFlow. Non sostituisce eventuali obblighi fiscali elettronici.",
      FONT_REGULAR,
      8,
      MARGIN,
      context.y
    );
  }

  private void drawLabelValue(
    PdfContext context,
    String label,
    String value,
    float x,
    float y
  ) throws IOException {
    drawText(context, label, FONT_REGULAR, 9, x, y);
    drawText(context, safeText(value), FONT_BOLD, 11, x, y - 16);
  }

  private void drawText(
    PdfContext context,
    String text,
    PDFont font,
    float fontSize,
    float x,
    float y
  ) throws IOException {
    context.contentStream.beginText();
    context.contentStream.setFont(font, fontSize);
    context.contentStream.newLineAtOffset(x, y);
    context.contentStream.showText(safeText(text));
    context.contentStream.endText();
  }

  private void drawTextRight(
    PdfContext context,
    String text,
    PDFont font,
    float fontSize,
    float rightX,
    float y
  ) throws IOException {
    String safeText = safeText(text);
    float textWidth = font.getStringWidth(safeText) / 1000 * fontSize;

    drawText(context, safeText, font, fontSize, rightX - textWidth, y);
  }

  private void drawLine(
    PdfContext context,
    float startX,
    float startY,
    float endX,
    float endY
  ) throws IOException {
    context.contentStream.setLineWidth(0.5f);
    context.contentStream.moveTo(startX, startY);
    context.contentStream.lineTo(endX, endY);
    context.contentStream.stroke();
  }

  private void drawFilledRectangle(
    PdfContext context,
    float x,
    float y,
    float width,
    float height
  ) throws IOException {
    setFillColor(context, 245, 246, 250);
    context.contentStream.addRect(x, y, width, height);
    context.contentStream.fill();
    setFillColor(context, 0, 0, 0);
  }

  private void setFillColor(
    PdfContext context,
    int red,
    int green,
    int blue
  ) throws IOException {
    context.contentStream.setNonStrokingColor(
      red / 255f,
      green / 255f,
      blue / 255f
    );
  }

  private void drawDarkRectangle(
    PdfContext context,
    float x,
    float y,
    float width,
    float height
  ) throws IOException {
    setFillColor(context, 55, 59, 83);
    context.contentStream.addRect(x, y, width, height);
    context.contentStream.fill();
    setFillColor(context, 0, 0, 0);
  }

  private List<String> wrapText(
    String text,
    PDFont font,
    float fontSize,
    float maxWidth
  ) throws IOException {
    String safeText = safeText(text);
    String[] words = safeText.split("\\s+");

    List<String> lines = new ArrayList<>();
    StringBuilder currentLine = new StringBuilder();

    for (String word : words) {
      String candidate = currentLine.isEmpty()
        ? word
        : currentLine + " " + word;

      float candidateWidth = font.getStringWidth(candidate) / 1000 * fontSize;

      if (candidateWidth <= maxWidth) {
        currentLine = new StringBuilder(candidate);
      } else {
        if (!currentLine.isEmpty()) {
          lines.add(currentLine.toString());
        }

        currentLine = new StringBuilder(word);
      }
    }

    if (!currentLine.isEmpty()) {
      lines.add(currentLine.toString());
    }

    return lines.isEmpty() ? List.of("-") : lines;
  }

  private String formatStatus(InvoiceStatus status) {
    if (status == null) {
      return "-";
    }

    return switch (status.name()) {
      case "paid" -> "Pagata";
      case "pending" -> "In attesa";
      case "draft" -> "Bozza";
      default -> status.name();
    };
  }

  private String formatDate(String value) {
    if (value == null || value.isBlank()) {
      return "-";
    }

    try {
      LocalDate date = LocalDate.parse(value);
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ITALIAN);

      return date.format(formatter);
    } catch (Exception exception) {
      return safeText(value);
    }
  }

  private String formatAmount(Double amount) {
    double safeAmount = amount != null ? amount : 0;

    return "EUR " + String.format(Locale.ITALY, "%,.2f", safeAmount);
  }

  private int safeQuantity(InvoiceItem item) {
    return item.getQuantity() != null ? item.getQuantity() : 0;
  }

  private double resolveItemTotal(InvoiceItem item) {
    if (item.getTotal() != null) {
      return item.getTotal();
    }

    if (item.getQuantity() == null || item.getPrice() == null) {
      return 0;
    }

    return item.getQuantity() * item.getPrice();
  }

  private String safeText(String value) {
    if (value == null || value.isBlank()) {
      return "-";
    }

    String normalized = Normalizer.normalize(value.trim(), Normalizer.Form.NFKD)
      .replaceAll("\\p{M}", "");

    return normalized
      .replace("€", "EUR")
      .replace("’", "'")
      .replace("“", "\"")
      .replace("”", "\"")
      .replace("–", "-")
      .replace("—", "-")
      .replaceAll("[^\\x20-\\x7E]", "?");
  }

  private static class PdfContext {
    private final PDDocument document;
    private PDPageContentStream contentStream;
    private float y;

    private PdfContext(PDDocument document) {
      this.document = document;
    }

    private void addPage() throws IOException {
      PDPage page = new PDPage(PDRectangle.A4);
      document.addPage(page);

      contentStream = new PDPageContentStream(document, page);
      y = PAGE_HEIGHT - MARGIN;
    }

    private void ensureSpace(float requiredSpace) throws IOException {
      if (y - requiredSpace > BOTTOM_MARGIN) {
        return;
      }

      close();
      addPage();
    }

    private void close() throws IOException {
      if (contentStream != null) {
        contentStream.close();
      }
    }
  }
}

package com.robodynamics.model;

import java.sql.Date;
import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_finance_ledger")
public class RDFinanceLedger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ledger_id")
    private Integer ledgerId;

    @Column(name = "transaction_date", nullable = false)
    private Date transactionDate;

    @Column(name = "type", length = 30, nullable = false)
    private String type; // INCOME / EXPENSE

    @Column(name = "category", length = 100)
    private String category; // e.g. Student Payment, Mentor Payout

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "reference", length = 100)
    private String reference;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // --- Getters & Setters ---
    public Integer getLedgerId() { return ledgerId; }
    public void setLedgerId(Integer ledgerId) { this.ledgerId = ledgerId; }

    public Date getTransactionDate() { return transactionDate; }
    public void setTransactionDate(Date transactionDate) { this.transactionDate = transactionDate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}

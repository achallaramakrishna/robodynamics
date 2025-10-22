package com.robodynamics.model;

import java.sql.Date;
import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_other_income")
public class RDOtherIncome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "income_id")
    private Integer incomeId;

    @Column(name = "income_date", nullable = false)
    private Date incomeDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private RDIncomeSource source;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "reference_no", length = 100)
    private String referenceNo;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Getters & Setters
    public Integer getIncomeId() { return incomeId; }
    public void setIncomeId(Integer incomeId) { this.incomeId = incomeId; }

    public Date getIncomeDate() { return incomeDate; }
    public void setIncomeDate(Date incomeDate) { this.incomeDate = incomeDate; }

    public RDIncomeSource getSource() { return source; }
    public void setSource(RDIncomeSource source) { this.source = source; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String referenceNo) { this.referenceNo = referenceNo; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}

package com.robodynamics.model;

import java.sql.Date;
import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_mentor_payouts")
public class RDMentorPayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payout_id")
    private Integer payoutId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", nullable = false)
    private RDUser mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_offering_id", nullable = true)
    private RDCourseOffering courseOffering;

    @Column(name = "payout_date", nullable = false)
    private Date payoutDate;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "payment_mode", length = 50)
    private String paymentMode;

    @Column(name = "payment_reference", length = 100)
    private String paymentReference;

    @Column(name = "status", length = 50)
    private String status; // e.g., PENDING, PAID, ON-HOLD

    @Column(name = "remarks", length = 255)
    private String remarks;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // --- Getters and Setters ---
    public Integer getPayoutId() { return payoutId; }
    public void setPayoutId(Integer payoutId) { this.payoutId = payoutId; }

    public RDUser getMentor() { return mentor; }
    public void setMentor(RDUser mentor) { this.mentor = mentor; }

    public RDCourseOffering getCourseOffering() { return courseOffering; }
    public void setCourseOffering(RDCourseOffering courseOffering) { this.courseOffering = courseOffering; }

    public Date getPayoutDate() { return payoutDate; }
    public void setPayoutDate(Date payoutDate) { this.payoutDate = payoutDate; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getPaymentReference() { return paymentReference; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}

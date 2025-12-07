package com.robodynamics.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "rd_competition_registration")
public class RDCompetitionRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registration_id")
    private int registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private RDCompetition competition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_user_id")
    private RDUser student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_user_id")
    private RDUser parent;

    @Column(name = "mode")
    private String mode;     // online / offline

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "registration_date")
    private Date registrationDate = new Date(); // auto-set at registration

    // ------------------- NEW FIELDS -------------------

    @Column(name = "payment_status")
    private String paymentStatus = "PENDING";  // PAID / PENDING

    @Column(name = "payment_amount")
    private Double paymentAmount;   // competition fee

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "payment_date")
    private Date paymentDate;       // when parent pays

    // ---------------- Getters & Setters ----------------

    public int getRegistrationId() {
        return registrationId;
    }

    public void setRegistrationId(int registrationId) {
        this.registrationId = registrationId;
    }

    public RDCompetition getCompetition() {
        return competition;
    }

    public void setCompetition(RDCompetition competition) {
        this.competition = competition;
    }

    public RDUser getStudent() {
        return student;
    }

    public void setStudent(RDUser student) {
        this.student = student;
    }

    public RDUser getParent() {
        return parent;
    }

    public void setParent(RDUser parent) {
        this.parent = parent;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Double getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(Double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public Date getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }
}

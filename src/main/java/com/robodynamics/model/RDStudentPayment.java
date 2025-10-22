package com.robodynamics.model;

import java.sql.Date;
import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_student_payments")
public class RDStudentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private RDStudentEnrollment enrollment;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_user_id", nullable = false)
    private RDUser student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_user_id", nullable = false)
    private RDUser parent;

    @Column(name = "payment_date")
    private Date paymentDate;

    @Column(name = "month_for")
    private String monthFor;

    @Column(name = "amount")
    private Double amount;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "payment_reference")
    private String paymentReference;

    @Column(name = "status")
    private String status;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "created_at")
    private Timestamp createdAt;

	public Integer getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Integer paymentId) {
		this.paymentId = paymentId;
	}

	public RDStudentEnrollment getEnrollment() {
		return enrollment;
	}

	public void setEnrollment(RDStudentEnrollment enrollment) {
		this.enrollment = enrollment;
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

	public Date getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getMonthFor() {
		return monthFor;
	}

	public void setMonthFor(String monthFor) {
		this.monthFor = monthFor;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getPaymentMode() {
		return paymentMode;
	}

	public void setPaymentMode(String paymentMode) {
		this.paymentMode = paymentMode;
	}

	public String getPaymentReference() {
		return paymentReference;
	}

	public void setPaymentReference(String paymentReference) {
		this.paymentReference = paymentReference;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

    
}

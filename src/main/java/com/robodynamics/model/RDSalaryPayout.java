package com.robodynamics.model;

import java.sql.Date;
import java.sql.Timestamp;
import javax.persistence.*;

@Entity
@Table(name = "rd_salary_payouts")
public class RDSalaryPayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salary_id")
    private Integer salaryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_user_id", nullable = false)
    private RDUser employee;

    @Column(name = "month_for", length = 7)
    private String monthFor;

    @Column(name = "base_salary")
    private Double baseSalary;

    @Column(name = "bonus")
    private Double bonus;

    @Column(name = "deductions")
    private Double deductions;

    @Column(name = "net_salary")
    private Double netSalary;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "payment_date")
    private Date paymentDate;

    @Column(name = "created_at")
    private Timestamp createdAt;

	public Integer getSalaryId() {
		return salaryId;
	}

	public void setSalaryId(Integer salaryId) {
		this.salaryId = salaryId;
	}

	public RDUser getEmployee() {
		return employee;
	}

	public void setEmployee(RDUser employee) {
		this.employee = employee;
	}

	public String getMonthFor() {
		return monthFor;
	}

	public void setMonthFor(String monthFor) {
		this.monthFor = monthFor;
	}

	public Double getBaseSalary() {
		return baseSalary;
	}

	public void setBaseSalary(Double baseSalary) {
		this.baseSalary = baseSalary;
	}

	public Double getBonus() {
		return bonus;
	}

	public void setBonus(Double bonus) {
		this.bonus = bonus;
	}

	public Double getDeductions() {
		return deductions;
	}

	public void setDeductions(Double deductions) {
		this.deductions = deductions;
	}

	public Double getNetSalary() {
		return netSalary;
	}

	public void setNetSalary(Double netSalary) {
		this.netSalary = netSalary;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public Date getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(Date paymentDate) {
		this.paymentDate = paymentDate;
	}

	public Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Timestamp createdAt) {
		this.createdAt = createdAt;
	}

    
}

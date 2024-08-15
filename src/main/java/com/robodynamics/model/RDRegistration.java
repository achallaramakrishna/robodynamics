package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_registrations")
public class RDRegistration {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "registration_id")
	private int registrationId;

	@Column(name = "name")
    private String name;
	
	@Column(name = "email")
    private String email;
	
	@Column(name = "phone")
	private String phone;

    @ManyToOne
    @JoinColumn(name = "workshop_id")
    private RDWorkshop workshop;

	public int getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(int registrationId) {
		this.registrationId = registrationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public RDWorkshop getWorkshop() {
		return workshop;
	}

	public void setWorkshop(RDWorkshop workshop) {
		this.workshop = workshop;
	}

	@Override
	public String toString() {
		return "RDRegistration [registrationId=" + registrationId + ", name=" + name + ", email=" + email + ", phone="
				+ phone + ", workshop=" + workshop + "]";
	}

    public RDRegistration() {
    	
    }
}

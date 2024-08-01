package com.robodynamics.model;



import javax.persistence.Column;
import javax.persistence.Table;

@Table(name = "rd_contacts")
public class RDContact {
	
	@Column(name = "contact_id")
	private int contactId;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "email")
	private String email;
	
	@Column(name = "cell_phone")
	private String cellPhone;
	
	@Column(name = "message")
	private String message;
	
	public RDContact() {
		
	}

	

	public int getContactId() {
		return contactId;
	}



	public void setContactId(int contactId) {
		this.contactId = contactId;
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

	public String getCellPhone() {
		return cellPhone;
	}

	public void setCellPhone(String cellPhone) {
		this.cellPhone = cellPhone;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}



	@Override
	public String toString() {
		return "RDContact [contactId=" + contactId + ", name=" + name + ", email=" + email + ", cellPhone=" + cellPhone
				+ ", message=" + message + "]";
	}
	

	
	
	

}

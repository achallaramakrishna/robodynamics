package com.robodynamics.model;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_workshops")
public class RDWorkshop {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "workshop_id")
	private int workshopId;

	@Column(name = "name")
    private String name;
	
	@Column(name = "description")
    private String description;
	
	@Column(name = "date")
    private Date date;
    
	@Column(name = "location")
    private String location;

	public int getWorkshopId() {
		return workshopId;
	}

	public void setWorkshopId(int workshopId) {
		this.workshopId = workshopId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	@Override
	public String toString() {
		return "RDWorkshop [workshopId=" + workshopId + ", name=" + name + ", description=" + description + ", date="
				+ date + ", location=" + location + "]";
	}

    // Getters and Setters
	public RDWorkshop() {
		
	}
	
}

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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "rd_competitions")
public class RDCompetition {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "competition_id")
    private int competition_id;

	@Column(name = "name")
    private String name;
    
	@Column(name = "description")
    private String description;
    
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "start_date")
    private Date startDate;
    
	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "end_date")
    private Date endDate;
    
	@Column(name = "category")
    private String category;
    
    
	@Column(name = "status")
    private String status;


	public int getCompetition_id() {
		return competition_id;
	}


	public void setCompetition_id(int competition_id) {
		this.competition_id = competition_id;
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


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public String getCategory() {
		return category;
	}


	public void setCategory(String category) {
		this.category = category;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}

	// default public constructor
		public RDCompetition() {
			
		}


		@Override
		public int hashCode() {
			return Objects.hash(category, competition_id, description, endDate, name, startDate, status);
		}


		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			RDCompetition other = (RDCompetition) obj;
			return Objects.equals(category, other.category) && competition_id == other.competition_id
					&& Objects.equals(description, other.description) && Objects.equals(endDate, other.endDate)
					&& Objects.equals(name, other.name) && Objects.equals(startDate, other.startDate)
					&& Objects.equals(status, other.status);
		}


		@Override
		public String toString() {
			return "RDCompetition [competition_id=" + competition_id + ", name=" + name + ", description=" + description
					+ ", startDate=" + startDate + ", endDate=" + endDate + ", category=" + category + ", status="
					+ status + "]";
		}
	
}

package com.robodynamics.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "rd_asset_rentals")
public class RDAssetRentals {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_rental_id")
	private int rentalId;
	
	@Column(name = "user_id")
	private int userId;
	
	@Column(name = "asset_id")
	private int assetId;
	
	@Column(name = "rental_start_date")
	private Date rentalStartDate;
	
	@Column(name = "rental_end_date")
	private Date rentalEndDate;
	
	@Column(name = "status")
	private String rentalStatus;
	
	
	public int getRentalId() {
		return rentalId;
	}
	public void setRentalId(int rentalId) {
		this.rentalId = rentalId;
	}
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public int getAssetId() {
		return assetId;
	}
	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}
	public Date getRentalStartDate() {
		return rentalStartDate;
	}
	public void setRentalStartDate(Date rentalStartDate) {
		this.rentalStartDate = rentalStartDate;
	}
	public Date getRentalEndDate() {
		return rentalEndDate;
	}
	public void setRentalEndDate(Date rentalEndDate) {
		this.rentalEndDate = rentalEndDate;
	}
	
	public String getRentalStatus() {
		return rentalStatus;
	}
	public void setRentalStatus(String rentalStatus) {
		this.rentalStatus = rentalStatus;
	}
	@Override
	public String toString() {
		return "RDAssetRentals [rentalId=" + rentalId + ", userId=" + userId + ", assetId=" + assetId
				+ ", rentalStartDate=" + rentalStartDate + ", rentalEndDate=" + rentalEndDate + ", rentalStatus="
				+ rentalStatus + "]";
	}
	
	
	
	
	
}






package com.robodynamics.model;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@Table(name = "rd_assets")
public class RDAsset {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_id")
	private int assetId;
	
	@Column(name = "asset_name")
	private String assetName;
	
	@Column(name = "availability_status")
	private String availabilityStatus;
	
	@Column(name = "asset_quantity")
	private int assetQuantity;
	
	
	@ManyToOne
    @JoinColumn(name = "asset_category_id")
    private RDAssetCategory assetCategory;
	
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JoinColumn(name="asset_resource_id", nullable = true)
	private Set<RDAssetResource> assetResources = new HashSet<RDAssetResource>();
	
	
	public RDAsset() {
		
	}

	public int getAssetId() {
		return assetId;
	}

	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}

	public String getAssetName() {
		return assetName;
	}

	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}

	
	
	public String getAvailabilityStatus() {
		return availabilityStatus;
	}

	public void setAvailabilityStatus(String availabilityStatus) {
		this.availabilityStatus = availabilityStatus;
	}

	public RDAssetCategory getAssetCategory() {
		return assetCategory;
	}

	public void setAssetCategory(RDAssetCategory assetCategory) {
		this.assetCategory = assetCategory;
	}

	public Set<RDAssetResource> getAssetResources() {
		return assetResources;
	}

	public void setAssetResources(Set<RDAssetResource> assetResources) {
		this.assetResources = assetResources;
	}

	public int getAssetQuantity() {
		return assetQuantity;
	}

	public void setAssetQuantity(int assetQuantity) {
		this.assetQuantity = assetQuantity;
	}
	
	

}

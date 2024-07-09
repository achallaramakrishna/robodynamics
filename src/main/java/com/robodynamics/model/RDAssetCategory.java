package com.robodynamics.model;

import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_asset_categories")
public class RDAssetCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_category_id")
	private int assetCategoryId;
	
	@Column(name = "asset_category_name")
	private String assetCategoryName;
	
	@Column(name = "asset_category_type")
	private String assetCategoryType;
	
	// default public constructor
	public RDAssetCategory() {
		
	}



	public int getAssetCategoryId() {
		return assetCategoryId;
	}



	public void setAssetCategoryId(int assetCategoryId) {
		this.assetCategoryId = assetCategoryId;
	}



	public String getAssetCategoryName() {
		return assetCategoryName;
	}



	public void setAssetCategoryName(String assetCategoryName) {
		this.assetCategoryName = assetCategoryName;
	}



	public String getAssetCategoryType() {
		return assetCategoryType;
	}



	public void setAssetCategoryType(String assetCategoryType) {
		this.assetCategoryType = assetCategoryType;
	}



	public RDAssetCategory(int assetCategoryId, String assetCategoryName, String assetCategoryType) {
		super();
		this.assetCategoryId = assetCategoryId;
		this.assetCategoryName = assetCategoryName;
		this.assetCategoryType = assetCategoryType;
	}



	@Override
	public int hashCode() {
		return Objects.hash(assetCategoryId, assetCategoryName, assetCategoryType);
	}



	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDAssetCategory other = (RDAssetCategory) obj;
		return assetCategoryId == other.assetCategoryId && Objects.equals(assetCategoryName, other.assetCategoryName)
				&& Objects.equals(assetCategoryType, other.assetCategoryType);
	}



	@Override
	public String toString() {
		return "RDAssetCategory [assetCategoryId=" + assetCategoryId + ", assetCategoryName=" + assetCategoryName
				+ ", assetCategoryType=" + assetCategoryType + "]";
	}
	
	
	
	
	
	
	
}

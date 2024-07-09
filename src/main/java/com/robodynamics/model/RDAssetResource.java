package com.robodynamics.model;

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
@Table(name = "rd_asset_resources")
public class RDAssetResource {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_resource_id")
	private int assetResourceId;
	
	@Column(name = "asset_resource_file_name")
	private String assetResourceFileName;
	
	@Column(name = "asset_resource_type")
	private String assetResourceType;
	
	
	@ManyToOne
    @JoinColumn(name = "asset_id")
    private RDAsset asset;
	
	
	public int getAssetResourceId() {
		return assetResourceId;
	}

	public void setAssetResourceId(int assetResourceId) {
		this.assetResourceId = assetResourceId;
	}

	public String getAssetResourceFileName() {
		return assetResourceFileName;
	}

	public RDAssetResource() {
		
	}

	public String getAssetResourceType() {
		return assetResourceType;
	}

	public void setAssetResourceType(String assetResourceType) {
		this.assetResourceType = assetResourceType;
	}

	public void setAssetResourceFileName(String assetResourceFileName) {
		this.assetResourceFileName = assetResourceFileName;
	}

	public RDAsset getAsset() {
		return asset;
	}

	public void setAsset(RDAsset asset) {
		this.asset = asset;
	}

}

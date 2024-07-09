package com.robodynamics.model;

import java.util.ArrayList;
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
@Table(name = "rd_asset_items")
public class RDAssetItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_item_id")
	private int assetItemId;
	
	@Column(name = "asset_item_name")
	private String assetItemName;
	
	@Column(name = "asset_num_pieces")
	private int assetNumPieces;
	
	@Column(name = "asset_item_image")
	private String assetItemImage;
	
	@ManyToOne
    @JoinColumn(name = "asset_id")
    private RDAsset asset;
	
	public RDAssetItem() {
		
	}

	public int getAssetItemId() {
		return assetItemId;
	}

	public void setAssetItemId(int assetItemId) {
		this.assetItemId = assetItemId;
	}

	public String getAssetItemName() {
		return assetItemName;
	}

	public void setAssetItemName(String assetItemName) {
		this.assetItemName = assetItemName;
	}

	public String getAssetItemImage() {
		return assetItemImage;
	}

	public void setAssetItemImage(String assetItemImage) {
		this.assetItemImage = assetItemImage;
	}

	public RDAsset getAsset() {
		return asset;
	}

	public void setAsset(RDAsset asset) {
		this.asset = asset;
	}

	public int getAssetNumPieces() {
		return assetNumPieces;
	}

	public void setAssetNumPieces(int assetNumPieces) {
		this.assetNumPieces = assetNumPieces;
	}

	
}

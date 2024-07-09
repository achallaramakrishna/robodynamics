package com.robodynamics.form;

import org.springframework.web.multipart.MultipartFile;

public class RDAssetForm {

	private int assetId;
	private String assetName;
	private int assetCategoryId;
	private int assetQuantity;
	
    private MultipartFile imageFile;
    
    
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
	public int getAssetCategoryId() {
		return assetCategoryId;
	}
	public void setAssetCategoryId(int assetCategoryId) {
		this.assetCategoryId = assetCategoryId;
	}
	public MultipartFile getImageFile() {
		return imageFile;
	}
	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}
	
	

    public int getAssetQuantity() {
		return assetQuantity;
	}
	public void setAssetQuantity(int assetQuantity) {
		this.assetQuantity = assetQuantity;
	}
	public RDAssetForm() {
    	
    }
	@Override
	public String toString() {
		return "RDAssetForm [assetId=" + assetId + ", assetName=" + assetName + ", assetCategoryId=" + assetCategoryId
				+ ", assetQuantity=" + assetQuantity + ", imageFile=" + imageFile + "]";
	}
	
	
	
}

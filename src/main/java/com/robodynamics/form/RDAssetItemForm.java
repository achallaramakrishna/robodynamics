package com.robodynamics.form;

import org.springframework.web.multipart.MultipartFile;

public class RDAssetItemForm {

	private int assetId;
	
    private MultipartFile imageFile;
    
    
	public int getAssetId() {
		return assetId;
	}
	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}
	public MultipartFile getImageFile() {
		return imageFile;
	}
	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}

    public RDAssetItemForm() {
    	
    }
	
}

package com.robodynamics.form;

import org.springframework.web.multipart.MultipartFile;

public class RDMatchingItemForm {

	private int itemId;
	private String itemName;
	private String matchingText;
	private int categoryId;
	private MultipartFile imageFile;

	public int getItemId() {
		return itemId;
	}

	public void setItemId(int itemId) {
		this.itemId = itemId;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getMatchingText() {
		return matchingText;
	}

	public void setMatchingText(String matchingText) {
		this.matchingText = matchingText;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public MultipartFile getImageFile() {
		return imageFile;
	}

	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}


	public RDMatchingItemForm() {

	}

	@Override
	public String toString() {
		return "RDMatchingItemForm [itemId=" + itemId + ", itemName=" + itemName + ", matchingText=" + matchingText
				+ ", categoryId=" + categoryId + ", imageFile=" + imageFile + "]";
	}
	

}

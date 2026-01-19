package com.robodynamics.dto;

import java.util.List;

public class RDMatchingCategoryDTO {
    private int categoryId;
    private String categoryName;
    private String imageName;
    private List<RDMatchingItemDTO> items;
	public int getCategoryId() {
		return categoryId;
	}
	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}
	public String getCategoryName() {
		return categoryName;
	}
	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}
	public String getImageName() {
		return imageName;
	}
	public void setImageName(String imageName) {
		this.imageName = imageName;
	}
	public List<RDMatchingItemDTO> getItems() {
		return items;
	}
	public void setItems(List<RDMatchingItemDTO> items) {
		this.items = items;
	}

    
}

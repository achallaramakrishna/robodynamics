package com.robodynamics.dto;

import java.util.List;

public class RDMatchingGameDTO {
    private int gameId;
    private String name;
    private String description;
    private List<RDMatchingCategoryDTO> categories;
	public int getGameId() {
		return gameId;
	}
	public void setGameId(int gameId) {
		this.gameId = gameId;
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
	public List<RDMatchingCategoryDTO> getCategories() {
		return categories;
	}
	public void setCategories(List<RDMatchingCategoryDTO> categories) {
		this.categories = categories;
	}


}

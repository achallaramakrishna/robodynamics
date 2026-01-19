package com.robodynamics.dto;

import java.util.List;

public class RDMatchingGameResponseDTO {

    private RDMatchingGameDTO game;
    private List<RDMatchingCategoryDTO> categories;
	public RDMatchingGameDTO getGame() {
		return game;
	}
	public void setGame(RDMatchingGameDTO game) {
		this.game = game;
	}
	public List<RDMatchingCategoryDTO> getCategories() {
		return categories;
	}
	public void setCategories(List<RDMatchingCategoryDTO> categories) {
		this.categories = categories;
	}

    
}

package com.robodynamics.dto;

public class OptionDTO {
	 private Integer optionId;
     private String  optionText;
     private String  optionImage;
     private boolean correct;
	public Integer getOptionId() {
		return optionId;
	}
	public void setOptionId(Integer optionId) {
		this.optionId = optionId;
	}
	public String getOptionText() {
		return optionText;
	}
	public void setOptionText(String optionText) {
		this.optionText = optionText;
	}
	public String getOptionImage() {
		return optionImage;
	}
	public void setOptionImage(String optionImage) {
		this.optionImage = optionImage;
	}
	public boolean isCorrect() {
		return correct;
	}
	public void setCorrect(boolean correct) {
		this.correct = correct;
	}
     

}

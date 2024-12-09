package com.robodynamics.form;

import org.springframework.web.multipart.MultipartFile;

public class RDMatchingCategoryForm {

    private int categoryId;
    private String categoryName;
    private int gameId; // To associate the category with a game
    private MultipartFile imageFile;

    public RDMatchingCategoryForm() {}

    // Getters and Setters
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

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public MultipartFile getImageFile() {
        return imageFile;
    }

    public void setImageFile(MultipartFile imageFile) {
        this.imageFile = imageFile;
    }

    @Override
    public String toString() {
        return "RDMatchingCategoryForm{" +
                "categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", gameId=" + gameId +
                ", imageFile=" + imageFile  +
                '}';
    }
}

package com.robodynamics.model;

import java.util.List;
import java.util.Objects;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "rd_matching_categories")
public class RDMatchingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    @JsonBackReference
    private RDMatchingGame game;

    @Column(name = "category_name")
    private String categoryName;
    
    @Column(name = "image_name", nullable = true)
    private String imageName; // For category images


    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<RDMatchingItem> items;

    public RDMatchingCategory() {}

    public RDMatchingCategory(int categoryId, RDMatchingGame game, String categoryName) {
        this.categoryId = categoryId;
        this.game = game;
        this.categoryName = categoryName;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public RDMatchingGame getGame() {
        return game;
    }

    public void setGame(RDMatchingGame game) {
        this.game = game;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public List<RDMatchingItem> getItems() {
        return items;
    }

    public void setItems(List<RDMatchingItem> items) {
        this.items = items;
    }



	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	@Override
	public String toString() {
		final int maxLen = 10;
		return "RDMatchingCategory [categoryId=" + categoryId + ", game=" + game + ", categoryName=" + categoryName
				+ ", imageName=" + imageName + ", items="
				+ (items != null ? items.subList(0, Math.min(items.size(), maxLen)) : null) + "]";
	}
    
    
}

package com.robodynamics.model;

import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "rd_matching_categories")
public class RDMatchingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private RDMatchingGame game;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "image_name")
    private String imageName;   // optional

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDMatchingItem> items;

    public RDMatchingCategory() {}

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

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public List<RDMatchingItem> getItems() {
        return items;
    }

    public void setItems(List<RDMatchingItem> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "RDMatchingCategory [categoryId=" + categoryId +
               ", categoryName=" + categoryName +
               ", imageName=" + imageName + "]";
    }
}

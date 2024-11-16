package com.robodynamics.model;

import java.util.List;
import java.util.Objects;
import javax.persistence.*;

@Entity
@Table(name = "rd_matching_categories")
public class RDMatchingCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private RDMatchingGame game;

    @Column(name = "category_name")
    private String categoryName;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDMatchingItem> items;

    public RDMatchingCategory() {}

    public RDMatchingCategory(Long categoryId, RDMatchingGame game, String categoryName) {
        this.categoryId = categoryId;
        this.game = game;
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
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

    @Override
    public String toString() {
        return "RDMatchingCategory [categoryId=" + categoryId + ", categoryName=" + categoryName + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDMatchingCategory)) return false;
        RDMatchingCategory that = (RDMatchingCategory) o;
        return Objects.equals(categoryId, that.categoryId) && Objects.equals(categoryName, that.categoryName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryId, categoryName);
    }
}

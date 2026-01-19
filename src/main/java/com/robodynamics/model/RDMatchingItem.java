package com.robodynamics.model;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "rd_matching_items")
public class RDMatchingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "matching_text")
    private String matchingText;   // optional

    @Column(name = "image_name")
    private String imageName;       // optional

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "correct_category_id", nullable = false)
    private RDMatchingCategory category;

    public RDMatchingItem() {}

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

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public RDMatchingCategory getCategory() {
        return category;
    }

    public void setCategory(RDMatchingCategory category) {
        this.category = category;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDMatchingItem)) return false;
        RDMatchingItem that = (RDMatchingItem) o;
        return itemId == that.itemId;
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId);
    }

    @Override
    public String toString() {
        return "RDMatchingItem [itemId=" + itemId +
               ", itemName=" + itemName +
               ", matchingText=" + matchingText +
               ", imageName=" + imageName + "]";
    }
}

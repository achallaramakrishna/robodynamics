package com.robodynamics.model;

import java.util.Objects;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "rd_matching_items")
public class RDMatchingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private int itemId;

    @Column(name = "item_name")
    private String itemName;
    
    @Column(name = "matching_text", nullable = true)
    private String matchingText; // Ensure this field exists
    
    @Column(name = "image_name", nullable = true)
    private String imageName; // For item images

    

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "correct_category_id", nullable = false)
    @JsonBackReference
    private RDMatchingCategory category;

    public RDMatchingItem() {}

    public RDMatchingItem(int itemId, String itemName, RDMatchingCategory category) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.category = category;
    }

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

    public RDMatchingCategory getCategory() {
        return category;
    }

    public void setCategory(RDMatchingCategory category) {
        this.category = category;
    }

    @Override
	public String toString() {
		return "RDMatchingItem [itemId=" + itemId + ", itemName=" + itemName + ", matchingText=" + matchingText
				+ ", imageName=" + imageName + ",  category=" + category
				+ "]";
	}
    
    

    public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}



	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDMatchingItem)) return false;
        RDMatchingItem that = (RDMatchingItem) o;
        return Objects.equals(itemId, that.itemId) && Objects.equals(itemName, that.itemName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId, itemName);
    }

	public String getMatchingText() {
		return matchingText;
	}

	public void setMatchingText(String matchingText) {
		this.matchingText = matchingText;
	}
    
    
}

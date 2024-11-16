package com.robodynamics.model;

import java.util.Objects;
import javax.persistence.*;

@Entity
@Table(name = "rd_matching_items")
public class RDMatchingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private RDMatchingGame game;

    @Column(name = "item_name")
    private String itemName;

    @ManyToOne
    @JoinColumn(name = "correct_category_id", nullable = false)
    private RDMatchingCategory category;

    public RDMatchingItem() {}

    public RDMatchingItem(Long itemId, RDMatchingGame game, String itemName, RDMatchingCategory category) {
        this.itemId = itemId;
        this.game = game;
        this.itemName = itemName;
        this.category = category;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public RDMatchingGame getGame() {
        return game;
    }

    public void setGame(RDMatchingGame game) {
        this.game = game;
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
        return "RDMatchingItem [itemId=" + itemId + ", itemName=" + itemName + "]";
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
}

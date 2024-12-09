package com.robodynamics.dao;

import com.robodynamics.model.RDMatchingItem;
import java.util.List;

public interface RDMatchingItemDao {

    RDMatchingItem getItemById(int itemId);

    List<RDMatchingItem> getItemsByCategoryId(int categoryId);

    List<RDMatchingItem> getItemsByGameId(int gameId);

    void saveItem(RDMatchingItem item);

	void deleteItem(int itemId);

	void updateItem(RDMatchingItem item);
}

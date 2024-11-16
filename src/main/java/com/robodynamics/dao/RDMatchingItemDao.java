package com.robodynamics.dao;

import com.robodynamics.model.RDMatchingItem;
import java.util.List;

public interface RDMatchingItemDao {

    RDMatchingItem getItemById(Long itemId);

    List<RDMatchingItem> getItemsByCategoryId(Long categoryId);

    List<RDMatchingItem> getItemsByGameId(Long gameId);

    void saveItem(RDMatchingItem item);
}

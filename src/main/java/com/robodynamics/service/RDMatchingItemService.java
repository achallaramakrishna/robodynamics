package com.robodynamics.service;

import com.robodynamics.model.RDMatchingItem;
import java.util.List;

public interface RDMatchingItemService {

    RDMatchingItem getItemById(Long itemId);

    List<RDMatchingItem> getItemsByCategoryId(Long categoryId);

    List<RDMatchingItem> getItemsByGameId(Long gameId);

    void saveItem(RDMatchingItem item);
}

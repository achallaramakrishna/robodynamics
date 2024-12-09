package com.robodynamics.service;

import com.robodynamics.model.RDMatchingItem;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface RDMatchingItemService {

    RDMatchingItem getItemById(int itemId);

    List<RDMatchingItem> getItemsByCategoryId(int categoryId);

    List<RDMatchingItem> getItemsByGameId(int gameId);

    void saveItem(RDMatchingItem item);
    
    void deleteItem(int itemId);

}

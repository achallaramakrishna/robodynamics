package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMatchingItemDao;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDMatchingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMatchingItemServiceImpl implements RDMatchingItemService {

    @Autowired
    private RDMatchingItemDao matchingItemDao;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingItem getItemById(Long itemId) {
        return matchingItemDao.getItemById(itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByCategoryId(Long categoryId) {
        return matchingItemDao.getItemsByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByGameId(Long gameId) {
        return matchingItemDao.getItemsByGameId(gameId);
    }

    @Override
    @Transactional
    public void saveItem(RDMatchingItem item) {
        matchingItemDao.saveItem(item);
    }
}

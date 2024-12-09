package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMatchingItemDao;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDMatchingItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletContext;

@Service
public class RDMatchingItemServiceImpl implements RDMatchingItemService {

    @Autowired
    private RDMatchingItemDao matchingItemDao;

    @Autowired
    private ServletContext servletContext;
    
    @Override
    @Transactional(readOnly = true)
    public RDMatchingItem getItemById(int itemId) {
        return matchingItemDao.getItemById(itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByCategoryId(int categoryId) {
        return matchingItemDao.getItemsByCategoryId(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByGameId(int gameId) {
        return matchingItemDao.getItemsByGameId(gameId);
    }

    @Override
    @Transactional
    public void saveItem(RDMatchingItem item) {
        matchingItemDao.saveItem(item);
    }

	@Override
	@Transactional
	public void deleteItem(int itemId) {
		matchingItemDao.deleteItem(itemId);
		
	}

	
}

package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMatchingCategoryDao;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.service.RDMatchingCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMatchingCategoryServiceImpl implements RDMatchingCategoryService {

    @Autowired
    private RDMatchingCategoryDao matchingCategoryDao;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingCategory getCategoryById(Long categoryId) {
        return matchingCategoryDao.getCategoryById(categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingCategory> getCategoriesByGameId(Long gameId) {
        return matchingCategoryDao.getCategoriesByGameId(gameId);
    }

    @Override
    @Transactional
    public void saveCategory(RDMatchingCategory category) {
        matchingCategoryDao.saveCategory(category);
    }
}

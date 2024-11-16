package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingCategoryDao;
import com.robodynamics.model.RDMatchingCategory;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class RDMatchingCategoryDaoImpl implements RDMatchingCategoryDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingCategory getCategoryById(Long categoryId) {
        return sessionFactory.getCurrentSession().get(RDMatchingCategory.class, categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingCategory> getCategoriesByGameId(Long gameId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingCategory where game.id = :gameId", RDMatchingCategory.class)
                .setParameter("gameId", gameId)
                .list();
    }

    @Override
    @Transactional
    public void saveCategory(RDMatchingCategory category) {
        sessionFactory.getCurrentSession().saveOrUpdate(category);
    }
}

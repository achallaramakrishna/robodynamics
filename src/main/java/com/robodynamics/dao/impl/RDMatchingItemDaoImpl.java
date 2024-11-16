package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingItemDao;
import com.robodynamics.model.RDMatchingItem;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class RDMatchingItemDaoImpl implements RDMatchingItemDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingItem getItemById(Long itemId) {
        return sessionFactory.getCurrentSession().get(RDMatchingItem.class, itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByCategoryId(Long categoryId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingItem where category.id = :categoryId", RDMatchingItem.class)
                .setParameter("categoryId", categoryId)
                .list();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByGameId(Long gameId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingItem where game.id = :gameId", RDMatchingItem.class)
                .setParameter("gameId", gameId)
                .list();
    }

    @Override
    @Transactional
    public void saveItem(RDMatchingItem item) {
        sessionFactory.getCurrentSession().saveOrUpdate(item);
    }
}

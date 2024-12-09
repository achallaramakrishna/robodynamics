package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingItemDao;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingItem;

import org.hibernate.Session;
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
    public RDMatchingItem getItemById(int itemId) {
    	
        return sessionFactory.getCurrentSession().get(RDMatchingItem.class, itemId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByCategoryId(int categoryId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingItem where category.id = :categoryId", RDMatchingItem.class)
                .setParameter("categoryId", categoryId)
                .list();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingItem> getItemsByGameId(int gameId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingItem item where item.category.game.id = :gameId", RDMatchingItem.class)
                .setParameter("gameId", gameId)
                .list();
    }

    @Override
    @Transactional
    public void saveItem(RDMatchingItem item) {
        sessionFactory.getCurrentSession().saveOrUpdate(item);
    }

	@Override
	@Transactional
	public void deleteItem(int itemId) {
		Session session = sessionFactory.getCurrentSession();
		RDMatchingItem item = session.get(RDMatchingItem.class, itemId);
	    if (item.getCategory() != null) {
	        item.getCategory().getItems().remove(item);
	    }
	    session.delete(item);
	}

	@Override
	public void updateItem(RDMatchingItem item) {
        sessionFactory.getCurrentSession().update(item);

		
	}
}

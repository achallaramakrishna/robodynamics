package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingCategoryDao;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDMatchingCategory;

import org.hibernate.Query;
import org.hibernate.Session;
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
    public RDMatchingCategory getCategoryById(int categoryId) {
        return sessionFactory.getCurrentSession().get(RDMatchingCategory.class, categoryId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingCategory> getCategoriesByGameId(int gameId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from RDMatchingCategory c WHERE c.game.gameId = :gameId", RDMatchingCategory.class)
                .setParameter("gameId", gameId)
                .list();
    }

    @Override
    @Transactional
    public void saveCategory(RDMatchingCategory category) {
        sessionFactory.getCurrentSession().saveOrUpdate(category);
    }

	@Override
	@Transactional
	public void deleteCategory(int categoryId) {
		 Session session = sessionFactory.getCurrentSession();
		 RDMatchingCategory matchingCategory = session.byId(RDMatchingCategory.class).load(categoryId);
	        session.delete(matchingCategory);
		
	}

	@Override
	public RDMatchingCategory getFirstCategory() {
	    // Create HQL query to fetch the first category ordered by ID
		Session session = sessionFactory.getCurrentSession();
		try {
			String hql = "FROM RDMatchingCategory ORDER BY categoryId ASC";
			Query<RDMatchingCategory> query = session.createQuery(hql, RDMatchingCategory.class);
			query.setMaxResults(1); // Limit to only the first result
			return query.uniqueResult();
		} catch (Exception e) {
			e.printStackTrace();
			return null; // Handle or log exception as per your requirement
		}

	}
}

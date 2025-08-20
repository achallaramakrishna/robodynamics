package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCollectionDao;
import com.robodynamics.model.RDCollection;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class RDCollectionDaoImpl implements RDCollectionDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<RDCollection> getCollections() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM RDCollection", RDCollection.class).list();  // Fetch all collections
    }
}

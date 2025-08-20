package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDDemoDao;
import com.robodynamics.model.RDDemo;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class RDDemoDaoImpl implements RDDemoDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<RDDemo> getUpcomingDemos() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM RDDemo WHERE isUpcoming = true", RDDemo.class).list(); // Fetch upcoming demos
    }
}

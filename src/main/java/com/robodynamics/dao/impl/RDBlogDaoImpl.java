package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDBlogDao;
import com.robodynamics.model.RDBlogPost;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class RDBlogDaoImpl implements RDBlogDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<RDBlogPost> getBlogPosts() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("FROM RDBlogPost WHERE isPublished = true", RDBlogPost.class).list(); // Fetch published blog posts
    }
}

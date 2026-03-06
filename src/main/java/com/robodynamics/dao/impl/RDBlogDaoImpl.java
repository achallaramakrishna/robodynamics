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
        return session.createQuery(
                "FROM RDBlogPost WHERE isPublished = true ORDER BY id DESC",
                RDBlogPost.class
        ).list();
    }

    @Override
    public List<RDBlogPost> getAllBlogPostsForAdmin() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery(
                "FROM RDBlogPost ORDER BY id DESC",
                RDBlogPost.class
        ).list();
    }

    @Override
    public RDBlogPost getBlogPostById(int postId) {
        return sessionFactory.getCurrentSession().get(RDBlogPost.class, postId);
    }

    @Override
    public void saveOrUpdateBlogPost(RDBlogPost post) {
        sessionFactory.getCurrentSession().saveOrUpdate(post);
    }

    @Override
    public void deleteBlogPostById(int postId) {
        Session session = sessionFactory.getCurrentSession();
        RDBlogPost post = session.get(RDBlogPost.class, postId);
        if (post != null) {
            session.delete(post);
        }
    }
}

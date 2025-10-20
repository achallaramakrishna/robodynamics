package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDTestimonialDAO;
import com.robodynamics.model.RDTestimonial;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RDTestimonialDAOImpl implements RDTestimonialDAO {

    private final SessionFactory sessionFactory;

    @Autowired
    public RDTestimonialDAOImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public RDTestimonial findById(Long id) {
        RDTestimonial t = s().get(RDTestimonial.class, id);
        return t;
    }

    @Override
    public List<RDTestimonial> findAllActive() {
        String hql = """
            FROM RDTestimonial t
            WHERE t.active = true
            ORDER BY t.displayOrder DESC, t.createdAt DESC
        """;
        return s().createQuery(hql, RDTestimonial.class).getResultList();
    }

    @Override
    public List<RDTestimonial> latest(int limit) {
        String hql = """
            FROM RDTestimonial t
            WHERE t.active = true
            ORDER BY t.displayOrder DESC, t.createdAt DESC
        """;
        Query<RDTestimonial> q = s().createQuery(hql, RDTestimonial.class);
        q.setMaxResults(limit <= 0 ? 6 : Math.min(limit, 50));
        return q.getResultList();
    }

    @Override
    public List<RDTestimonial> pageActive(int page, int size) {
        int p = Math.max(page, 0);
        int sz = (size <= 0 || size > 100) ? 12 : size;

        String hql = """
            FROM RDTestimonial t
            WHERE t.active = true
            ORDER BY t.displayOrder DESC, t.createdAt DESC
        """;
        Query<RDTestimonial> q = s().createQuery(hql, RDTestimonial.class);
        q.setFirstResult(p * sz);
        q.setMaxResults(sz);
        return q.getResultList();
    }

    @Override
    public Long save(RDTestimonial t) {
        return (Long) s().save(t);
    }

    @Override
    public void update(RDTestimonial t) {
        s().update(t);
    }

    @Override
    public void delete(RDTestimonial t) {
        s().delete(t);
    }

    @Override
    public int setActive(Long id, boolean active) {
        String hql = "UPDATE RDTestimonial t SET t.active = :a WHERE t.id = :id";
        return s().createQuery(hql)
                .setParameter("a", active)
                .setParameter("id", id)
                .executeUpdate();
    }

	@Override
	public List<RDTestimonial> getAllTestimonials() {
		Session session = sessionFactory.getCurrentSession();
        Query<RDTestimonial> query = session.createQuery("from RDTestimonial", RDTestimonial.class);
        return query.getResultList();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RDTestimonial> getParentStudentTestimonials() {
	    Session session = sessionFactory.getCurrentSession();
	    String hql = "SELECT DISTINCT t FROM RDTestimonial t "
	               + "LEFT JOIN FETCH t.student s "
	               + "LEFT JOIN FETCH t.course c "
	               + "WHERE t.mentor IS NULL "
	               + "ORDER BY t.createdAt DESC";
	    return session.createQuery(hql).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<RDTestimonial> getMentorTestimonials() {
	    Session session = sessionFactory.getCurrentSession();
	    String hql = "SELECT DISTINCT t FROM RDTestimonial t "
	               + "LEFT JOIN FETCH t.mentor m "
	               + "LEFT JOIN FETCH t.course c "
	               + "WHERE t.mentor IS NOT NULL "
	               + "ORDER BY t.createdAt DESC";
	    return session.createQuery(hql).list();
	}

}

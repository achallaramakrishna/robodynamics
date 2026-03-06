package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDContentRadarSourceDao;
import com.robodynamics.model.RDContentRadarSource;

@Repository
public class RDContentRadarSourceDaoImpl implements RDContentRadarSourceDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDContentRadarSource source) {
        getCurrentSession().saveOrUpdate(source);
    }

    @Override
    public RDContentRadarSource findById(Long sourceId) {
        if (sourceId == null) {
            return null;
        }
        return getCurrentSession().get(RDContentRadarSource.class, sourceId);
    }

    @Override
    public List<RDContentRadarSource> findAll() {
        return getCurrentSession()
                .createQuery("FROM RDContentRadarSource s ORDER BY s.sourceName ASC", RDContentRadarSource.class)
                .getResultList();
    }

    @Override
    public List<RDContentRadarSource> findActive() {
        return getCurrentSession()
                .createQuery("FROM RDContentRadarSource s WHERE s.active = true ORDER BY s.authorityWeight DESC, s.sourceName ASC",
                        RDContentRadarSource.class)
                .getResultList();
    }

    @Override
    public void deleteById(Long sourceId) {
        RDContentRadarSource source = findById(sourceId);
        if (source != null) {
            getCurrentSession().delete(source);
        }
    }
}

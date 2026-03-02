package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDVisitorLogDao;
import com.robodynamics.model.RDVisitorLog;
import com.robodynamics.service.RDVisitorLogService;

@Service
public class RDVisitorLogServiceImpl implements RDVisitorLogService {

    @Autowired
    private RDVisitorLogDao rdVisitorDao;

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional
    public void saveRDVisitorLog(RDVisitorLog rdVisitorLog) {
        rdVisitorDao.saveRDVisitorLog(rdVisitorLog);
    }

    @Override
    @Transactional(readOnly = true)
    public RDVisitorLog getRDVisitorLog(int visitorLogId) {
        return rdVisitorDao.getRDVisitorLog(visitorLogId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDVisitorLog> getRDVisitorLogs() {
        return rdVisitorDao.getRDVisitorLogs();
    }

    @Override
    @Transactional
    public void deleteRDVisitorLog(int id) {
        rdVisitorDao.deleteRDVisitorLog(id);
    }

    @Override
    @Transactional
    public void logVisit(String ipAddress, String url) {
        RDVisitorLog visitorLog = new RDVisitorLog();
        visitorLog.setIpAddress(ipAddress);
        visitorLog.setUrl(url);
        visitorLog.setTimestamp(LocalDateTime.now());
        rdVisitorDao.saveRDVisitorLog(visitorLog);
    }

    @Override
    public void logVisitAsync(String clientIP, String url) {
        try {
            logVisit(clientIP, url);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public long countVisitsSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(v) from RDVisitorLog v where v.timestamp >= :fromTime", Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countDistinctIpsSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(distinct v.ipAddress) from RDVisitorLog v where v.timestamp >= :fromTime", Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countDistinctUrlsSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(distinct v.url) from RDVisitorLog v where v.timestamp >= :fromTime", Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countLoggedInVisitsSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(v) from RDVisitorLog v where v.timestamp >= :fromTime and v.loggedIn = true", Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countAnonymousVisitsSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(v) from RDVisitorLog v where v.timestamp >= :fromTime and (v.loggedIn is null or v.loggedIn = false)",
                Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countDistinctLoggedInUsersSince(LocalDateTime fromTime) {
        Query<Long> query = currentSession().createQuery(
                "select count(distinct v.userId) from RDVisitorLog v " +
                        "where v.timestamp >= :fromTime and v.loggedIn = true and v.userId is not null",
                Long.class);
        query.setParameter("fromTime", fromTime);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public long countVisitsByUrlPatternSince(LocalDateTime fromTime, String urlPattern) {
        String pattern = urlPattern == null ? "" : urlPattern.trim().toLowerCase();
        if (pattern.isEmpty()) {
            return 0L;
        }
        Query<Long> query = currentSession().createQuery(
                "select count(v) from RDVisitorLog v " +
                        "where v.timestamp >= :fromTime and lower(v.url) like :pattern",
                Long.class);
        query.setParameter("fromTime", fromTime);
        query.setParameter("pattern", pattern);
        return nvl(query.uniqueResult());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> topUrlsSince(LocalDateTime fromTime, int maxRows) {
        Query<Object[]> query = currentSession().createQuery(
                "select v.url, count(v) from RDVisitorLog v " +
                        "where v.timestamp >= :fromTime and v.url is not null " +
                        "group by v.url order by count(v) desc",
                Object[].class);
        query.setParameter("fromTime", fromTime);
        query.setMaxResults(Math.max(1, maxRows));
        return query.getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> topLoggedInUsersSince(LocalDateTime fromTime, int maxRows) {
        Query<Object[]> query = currentSession().createQuery(
                "select v.userId, v.userName, count(v) from RDVisitorLog v " +
                        "where v.timestamp >= :fromTime and v.loggedIn = true and v.userId is not null " +
                        "group by v.userId, v.userName order by count(v) desc",
                Object[].class);
        query.setParameter("fromTime", fromTime);
        query.setMaxResults(Math.max(1, maxRows));
        return query.getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Object[]> topCountriesSince(LocalDateTime fromTime, int maxRows) {
        Query<Object[]> query = currentSession().createQuery(
                "select coalesce(v.countryCode, 'UNKNOWN'), count(v) from RDVisitorLog v " +
                        "where v.timestamp >= :fromTime " +
                        "group by coalesce(v.countryCode, 'UNKNOWN') order by count(v) desc",
                Object[].class);
        query.setParameter("fromTime", fromTime);
        query.setMaxResults(Math.max(1, maxRows));
        return query.getResultList();
    }

    @Override
    @Transactional
    public int deleteLogsBefore(LocalDateTime cutoff) {
        Query<?> query = currentSession().createQuery(
                "delete from RDVisitorLog v where v.timestamp < :cutoff");
        query.setParameter("cutoff", cutoff);
        return query.executeUpdate();
    }

    private Session currentSession() {
        return sessionFactory.getCurrentSession();
    }

    private long nvl(Long value) {
        return value == null ? 0L : value;
    }
}

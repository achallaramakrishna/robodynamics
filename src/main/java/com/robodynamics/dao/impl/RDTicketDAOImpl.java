package com.robodynamics.dao.impl;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.hibernate.SessionFactory;
// ❗ Use the modern Query type:
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDTicketDao;
import com.robodynamics.model.RDTicket;

@Repository
public class RDTicketDAOImpl implements RDTicketDao {
    @Autowired
    private SessionFactory sf;

    @Override
    public RDTicket save(RDTicket t) {
        sf.getCurrentSession().saveOrUpdate(t);
        return t;
    }

    @Override
    public Optional<RDTicket> findById(Long id) {
        return Optional.ofNullable(sf.getCurrentSession().get(RDTicket.class, id));
    }

    @Override
    public void delete(Long id) {
        RDTicket t = sf.getCurrentSession().byId(RDTicket.class).load(id);
        sf.getCurrentSession().delete(t);
    }

    @Override
    public List<RDTicket> findAll(int page, int size,
                                  String status,
                                  Integer assigneeId,
                                  Integer creatorId,
                                  String q) {
        StringBuilder hql = new StringBuilder(
            "select t from RDTicket t " +
            "left join fetch t.createdBy cb " +
            "left join fetch t.assignedTo at " +
            "where 1=1"
        );

        if (status != null && !status.isBlank())  hql.append(" and t.status = :status");
        if (assigneeId != null)                   hql.append(" and t.assignedTo.userID = :assigneeId");
        if (creatorId  != null)                   hql.append(" and t.createdBy.userID  = :creatorId");
        if (q != null && !q.isBlank())            hql.append(" and (lower(t.title) like :q or lower(t.description) like :q or lower(t.category) like :q)");

        hql.append(" order by t.updatedAt desc");

        Query<RDTicket> query = sf.getCurrentSession().createQuery(hql.toString(), RDTicket.class);

        if (status != null && !status.isBlank()) {
            try { query.setParameter("status", RDTicket.Status.valueOf(status)); }
            catch (IllegalArgumentException ex) { query.setParameter("status", status); }
        }
        if (assigneeId != null) query.setParameter("assigneeId", assigneeId);
        if (creatorId  != null) query.setParameter("creatorId",  creatorId);
        if (q != null && !q.isBlank()) query.setParameter("q", "%" + q.toLowerCase(Locale.ROOT) + "%");

        query.setFirstResult(Math.max(0, page) * Math.max(1, size));
        query.setMaxResults(Math.max(1, size));
        return query.list();
    }

    @Override
    public long count(String status,
                      Integer assigneeId,
                      Integer creatorId,
                      String q) {
        StringBuilder hql = new StringBuilder("select count(t) from RDTicket t where 1=1");

        if (status != null && !status.isBlank())  hql.append(" and t.status = :status");
        if (assigneeId != null)                   hql.append(" and t.assignedTo.userID = :assigneeId");
        if (creatorId  != null)                   hql.append(" and t.createdBy.userID  = :creatorId");
        if (q != null && !q.isBlank())            hql.append(" and (lower(t.title) like :q or lower(t.description) like :q or lower(t.category) like :q)");

        // ❗ Expect a Long here:
        Query<Long> query = sf.getCurrentSession().createQuery(hql.toString(), Long.class);

        if (status != null && !status.isBlank()) {
            try { query.setParameter("status", RDTicket.Status.valueOf(status)); }
            catch (IllegalArgumentException ex) { query.setParameter("status", status); }
        }
        if (assigneeId != null) query.setParameter("assigneeId", assigneeId);
        if (creatorId  != null) query.setParameter("creatorId",  creatorId);
        if (q != null && !q.isBlank()) query.setParameter("q", "%" + q.toLowerCase(Locale.ROOT) + "%");

        Long result = query.uniqueResult();
        return result != null ? result : 0L;
    }

    @Override
    public List<RDTicket> findForMentor(int page, int size,
                                        String status,
                                        Integer assigneeId,
                                        Integer creatorId,
                                        String q) {
        StringBuilder hql = new StringBuilder(
            "select t from RDTicket t " +
            "left join fetch t.createdBy cb " +
            "left join fetch t.assignedTo at " +
            "where 1=1"
        );

        if (status != null && !status.isBlank()) hql.append(" and t.status = :status");

        if (assigneeId != null || creatorId != null) {
            hql.append(" and (");
            boolean first = true;
            if (assigneeId != null) { hql.append(" t.assignedTo.userID = :assigneeId"); first = false; }
            if (creatorId  != null) { if (!first) hql.append(" or"); hql.append(" t.createdBy.userID = :creatorId"); }
            hql.append(")");
        }

        if (q != null && !q.isBlank()) hql.append(" and (lower(t.title) like :q or lower(t.description) like :q or lower(t.category) like :q)");

        hql.append(" order by t.updatedAt desc");

        Query<RDTicket> query = sf.getCurrentSession().createQuery(hql.toString(), RDTicket.class);

        if (status != null && !status.isBlank()) {
            try { query.setParameter("status", RDTicket.Status.valueOf(status)); }
            catch (IllegalArgumentException ex) { query.setParameter("status", status); }
        }
        if (assigneeId != null) query.setParameter("assigneeId", assigneeId);
        if (creatorId  != null) query.setParameter("creatorId",  creatorId);
        if (q != null && !q.isBlank()) query.setParameter("q", "%" + q.toLowerCase(Locale.ROOT) + "%");

        query.setFirstResult(Math.max(0, page) * Math.max(1, size));
        query.setMaxResults(Math.max(1, size));
        return query.list();
    }

    @Override
    public long countForMentor(String status,
                               Integer assigneeId,
                               Integer creatorId,
                               String q) {
        StringBuilder hql = new StringBuilder("select count(t) from RDTicket t where 1=1");

        if (status != null && !status.isBlank()) hql.append(" and t.status = :status");

        if (assigneeId != null || creatorId != null) {
            hql.append(" and (");
            boolean first = true;
            if (assigneeId != null) { hql.append(" t.assignedTo.userID = :assigneeId"); first = false; }
            if (creatorId  != null) { if (!first) hql.append(" or"); hql.append(" t.createdBy.userID = :creatorId"); }
            hql.append(")");
        }

        if (q != null && !q.isBlank()) hql.append(" and (lower(t.title) like :q or lower(t.description) like :q or lower(t.category) like :q)");

        // ❗ Expect a Long here:
        Query<Long> query = sf.getCurrentSession().createQuery(hql.toString(), Long.class);

        if (status != null && !status.isBlank()) {
            try { query.setParameter("status", RDTicket.Status.valueOf(status)); }
            catch (IllegalArgumentException ex) { query.setParameter("status", status); }
        }
        if (assigneeId != null) query.setParameter("assigneeId", assigneeId);
        if (creatorId  != null) query.setParameter("creatorId",  creatorId);
        if (q != null && !q.isBlank()) query.setParameter("q", "%" + q.toLowerCase(Locale.ROOT) + "%");

        Long result = query.uniqueResult();
        return result != null ? result : 0L;
    }

    @Override
    public Optional<RDTicket> get(Long id) {
        return Optional.ofNullable(sf.getCurrentSession().get(RDTicket.class, id));
    }

    @Override
    public RDTicket getByIdForView(Long id) {
        String hql = """
            select distinct t
            from RDTicket t
            left join fetch t.assignedTo a
            left join fetch t.createdBy c
            left join fetch t.comments cm
            left join fetch cm.user cmu
            where t.ticketId = :id
            """;

        return sf.getCurrentSession()
                .createQuery(hql, RDTicket.class)
                .setParameter("id", id)
                .uniqueResult();
    }

}

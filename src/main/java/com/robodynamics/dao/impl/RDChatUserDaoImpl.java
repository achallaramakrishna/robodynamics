package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDChatUserDao;
import com.robodynamics.model.RDUser;

@Repository
public class RDChatUserDaoImpl implements RDChatUserDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<RDUser> findChatEligibleUsers(Integer currentUserId) {

        Session session = sessionFactory.getCurrentSession();

        String hql = """
            from RDUser u
            where u.userID <> :currentUserId
              and u.active = 1
            order by u.firstName asc, u.lastName asc
        """;

        Query<RDUser> query = session.createQuery(hql, RDUser.class);
        query.setParameter("currentUserId", currentUserId);

        return query.getResultList();
    }

    @Override
    public String findOtherUserName(Long conversationId, Integer currentUserId) {

        String hql = """
            select concat(
                coalesce(u.firstName, ''),
                ' ',
                coalesce(u.lastName, '')
            )
            from RDChatParticipant p
            join RDUser u on u.userID = p.userId
            where p.conversation.conversationId = :cid
              and p.userId <> :currentUserId
              and p.active = true
        """;

        return sessionFactory.getCurrentSession()
            .createQuery(hql, String.class)
            .setParameter("cid", conversationId)
            .setParameter("currentUserId", currentUserId)
            .setMaxResults(1)
            .uniqueResult();
    }


   
}

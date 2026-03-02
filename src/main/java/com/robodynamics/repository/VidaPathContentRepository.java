package com.robodynamics.repository;

import com.robodynamics.model.VidaPathCareerQuestion;
import com.robodynamics.model.VidaPathFutureCareer;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class VidaPathContentRepository {

    private final SessionFactory sessionFactory;

    public VidaPathContentRepository(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Transactional(readOnly = true)
    public List<VidaPathCareerQuestion> findAllQuestions() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery(
                        "from VidaPathCareerQuestion where archived = false order by questionId",
                        VidaPathCareerQuestion.class)
                .list();
    }

    @Transactional(readOnly = true)
    public List<VidaPathFutureCareer> findAllFutureCareers() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("from VidaPathFutureCareer", VidaPathFutureCareer.class).list();
    }
}

package com.robodynamics.dao.impl;



import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.wrapper.ProjectGroup;

@Repository
@Transactional
public class RDQuizDaoImpl implements RDQuizDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDQuiz quiz) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(quiz);
    }

    @Override
    public RDQuiz findById(int quizId) {
        Session session = factory.getCurrentSession();
        return session.get(RDQuiz.class, quizId);
    }

    @Override
    public List<RDQuiz> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDQuiz> cq = cb.createQuery(RDQuiz.class);
        Root<RDQuiz> root = cq.from(RDQuiz.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDQuiz quiz) {
        Session session = factory.getCurrentSession();
        session.delete(quiz);
    }
    
    @Override
    public List<RDQuiz> findQuizzesByFilters(Integer courseId, String status, String difficultyLevel) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDQuiz q WHERE 1=1";  // Always true condition to allow appending further conditions dynamically

        if (courseId != null) {
            hql += " AND q.course.id = :courseId";
        }
        if (status != null && !status.isEmpty()) {
            hql += " AND q.status = :status";
        }
        if (difficultyLevel != null && !difficultyLevel.isEmpty()) {
            hql += " AND q.difficultyLevel = :difficultyLevel";
        }

        Query<RDQuiz> query = session.createQuery(hql, RDQuiz.class);

        // Set parameters if provided
        if (courseId != null) {
            query.setParameter("courseId", courseId);
        }
        if (status != null && !status.isEmpty()) {
            query.setParameter("status", status);
        }
        if (difficultyLevel != null && !difficultyLevel.isEmpty()) {
            query.setParameter("difficultyLevel", difficultyLevel);
        }

        // Execute the query and return the list of filtered quizzes
        return query.getResultList();
    }

	@Override
	public List<RDQuiz> getPaginatedQuizzes(int pageNumber, int pageSize) {
		 Session session = factory.getCurrentSession();
		    CriteriaBuilder cb = session.getCriteriaBuilder();
		    CriteriaQuery<RDQuiz> cq = cb.createQuery(RDQuiz.class);
		    Root<RDQuiz> root = cq.from(RDQuiz.class);
		    cq.select(root);

		    Query<RDQuiz> query = session.createQuery(cq);
		    query.setFirstResult(pageNumber * pageSize);  // Calculate the starting index
		    query.setMaxResults(pageSize);  // Set the max number of results

		    return query.getResultList();
	}

	@Override
	public long getTotalQuizzesCount() {
		 Session session = factory.getCurrentSession();
		    CriteriaBuilder cb = session.getCriteriaBuilder();
		    CriteriaQuery<Long> cq = cb.createQuery(Long.class);
		    Root<RDQuiz> root = cq.from(RDQuiz.class);
		    cq.select(cb.count(root));
		    return session.createQuery(cq).getSingleResult();
	}

	@Override
    public List<ProjectGroup<RDQuiz>> getQuizzesGroupedByCategory() {
        Session session = factory.getCurrentSession();
        List<RDQuiz> quizzes = session.createQuery("from RDQuiz", RDQuiz.class).list();

        return quizzes.stream()
            .collect(Collectors.groupingBy(RDQuiz::getCategory))
            .entrySet()
            .stream()
            .map(entry -> new ProjectGroup<>(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
    }

	@Override
    public List<ProjectGroup<RDQuiz>> getQuizzesGroupedByGradeRange() {
        Session session = factory.getCurrentSession();
        List<RDQuiz> quizzes = session.createQuery("from RDQuiz", RDQuiz.class).list();

        return quizzes.stream()
            .collect(Collectors.groupingBy(quiz -> quiz.getGradeRange().getDisplayName()))
            .entrySet()
            .stream()
            .map(entry -> new ProjectGroup<>(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
    }

	@Override
	public List<RDQuiz> getFeaturedQuizzes() {
		Session session = factory.getCurrentSession();
		String hql = "FROM RDQuiz WHERE isFeatured = true";
        Query<RDQuiz> query = session.createQuery(hql, RDQuiz.class);
        return query.getResultList();
	}
	
    @Override
    public List<RDQuiz> searchQuizzes(String query) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDQuiz WHERE quizName LIKE :query OR shortDescription LIKE :query";
        Query<RDQuiz> searchQuery = session.createQuery(hql, RDQuiz.class);
        searchQuery.setParameter("query", "%" + query + "%");
        return searchQuery.getResultList();
    }
}

package com.robodynamics.dao.impl;



import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.dto.RDStudentQuizSummary;
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

	@Override
	public List<RDQuiz> findQuizzesByCreator(int userId) {
		  Session session = factory.getCurrentSession();
	        String hql = "FROM RDQuiz q WHERE q.createdByUser.userID = :userId";
	        Query<RDQuiz> query = session.createQuery(hql, RDQuiz.class);
	        query.setParameter("userId", userId);
	        return query.getResultList();
	}

	@Override
	public List<RDQuiz> findQuizzesForStudent(int studentId) {
	    Session session = factory.getCurrentSession();

	    // HQL to fetch quizzes created by the student or their parents
	    String hql = """
	        SELECT q
	        FROM RDQuiz q
	        WHERE q.createdByUser.userID = :studentId
	           OR q.createdByUser.userID IN (
	               SELECT parent.userID
	               FROM RDUser parent
	               WHERE parent.userID IN (
	                   SELECT s.mom.userID
	                   FROM RDUser s
	                   WHERE s.userID = :studentId
	               )
	               OR parent.userID IN (
	                   SELECT s.dad.userID
	                   FROM RDUser s
	                   WHERE s.userID = :studentId
	               )
	           )
	    """;

	    Query<RDQuiz> query = session.createQuery(hql, RDQuiz.class);
	    query.setParameter("studentId", studentId);

	    return query.getResultList();
	}

	@Override
	public List<RDQuiz> findByFilters(Integer courseId, Integer sessionId, Integer sessionDetailId) {
		Session session = factory.getCurrentSession();

        StringBuilder hql = new StringBuilder("select q from RDQuiz q where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (courseId != null) {
            hql.append(" and q.course.courseId = :courseId");
            params.put("courseId", courseId);
        }
        if (sessionId != null) {
            hql.append(" and q.courseSession.courseSessionId = :sessionId");
            params.put("sessionId", sessionId);
        }
        if (sessionDetailId != null) {
            hql.append(" and q.courseSessionDetail.courseSessionDetailId = :sessionDetailId");
            params.put("sessionDetailId", sessionDetailId);
        }

        hql.append(" order by q.quizId desc");

        Query<RDQuiz> query = session.createQuery(hql.toString(), RDQuiz.class);
        params.forEach(query::setParameter);

        return query.list(); // or .getResultList() if on JPA; Hibernate Query uses list()
    }

	@Override
	public List<RDStudentQuizSummary> getQuizSummaryByUserAndCourse(
	        Integer userID, int courseId) {

	    Session session = factory.getCurrentSession();

	    String hql =
	        "select new com.robodynamics.dto.RDStudentQuizSummary( " +
	        "   q.quizId, " +
	        "   q.quizName, " +
	        "   r.score, " +
	        "   r.passed, " +
	        "   r.completionTime, " +
	        "   r.completedAt " +
	        ") " +
	        "from RDUserQuizResults r " +
	        "join r.quiz q " +
	        "join q.course c " +
	        "where r.user.userID = :userId " +
	        "and c.courseId = :courseId " +
	        "order by r.completedAt desc";

	    return session.createQuery(hql, RDStudentQuizSummary.class)
	            .setParameter("userId", userID)
	            .setParameter("courseId", courseId)
	            .getResultList();
	}

	@Override
	public List<RDQuiz> findByCourseSession(int courseSessionId) {
		
		Session session = factory.getCurrentSession();

	    CriteriaBuilder cb = session.getCriteriaBuilder();
	    CriteriaQuery<RDQuiz> cq = cb.createQuery(RDQuiz.class);
	    Root<RDQuiz> root = cq.from(RDQuiz.class);

	    Predicate sessionPredicate =
	            cb.equal(
	                root.get("courseSession").get("courseSessionId"),
	                courseSessionId
	            );

	    cq.where(sessionPredicate);
	    cq.orderBy(cb.asc(root.get("quizId"))); // optional

	    return session.createQuery(cq).getResultList();
	}

	
}



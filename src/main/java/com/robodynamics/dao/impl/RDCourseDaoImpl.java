package com.robodynamics.dao.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dto.RDCourseBasicDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.wrapper.ProjectGroup;


@Repository
@Transactional
public class RDCourseDaoImpl implements RDCourseDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDCourse(RDCourse rdCourse) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourse);
	}
	
	public RDCourse getRDCourse(int courseId) {
        Session session = factory.getCurrentSession();
        RDCourse course = session.get(RDCourse.class, courseId);
        return course;
	}
	
    @Override
    public List <RDCourse> getRDCourses() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDCourse > cq = cb.createQuery(RDCourse.class);
        Root < RDCourse > root = cq.from(RDCourse.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDCourse(int id) {
        Session session = factory.getCurrentSession();
        RDCourse course = session.byId(RDCourse.class).load(id);
        session.delete(course);
    }

	@Override
	public List <RDCourseSession> findSessionsByCourseId(int courseId) {
		 // Using Hibernate Criteria API or HQL to fetch sessions by courseId
        String hql = "FROM RDCourseSession WHERE course.courseId = :courseId";
        Query query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("courseId", courseId);
        return query.getResultList();
	}
	
	@Override
	public List<RDCourseBasicDTO> getBasicCourseDetails() {
	    return factory.getCurrentSession().createQuery(
	        "SELECT new com.robodynamics.dto.RDCourseBasicDTO(c.courseId, c.courseName, c.courseDescription, " +
	        "c.courseDuration, c.courseLevel, c.courseImageUrl, c.coursePrice, c.courseInstructor, c.courseAgeGroup, c.category, c.gradeRange.displayName) " +
	        "FROM RDCourse c", RDCourseBasicDTO.class).getResultList();
	}

	@Override
	public List<RDCourseBasicDTO> getPopularCourses() {
	    return factory.getCurrentSession().createQuery(
		        "SELECT new com.robodynamics.dto.RDCourseBasicDTO(c.courseId, c.courseName, c.courseDescription, " +
		        "c.courseDuration, c.courseLevel, c.courseImageUrl, c.coursePrice, c.courseInstructor, c.courseAgeGroup, c.category, c.gradeRange.displayName) " +
		        "FROM RDCourse c where c.courseStatus='active'", RDCourseBasicDTO.class).getResultList();

	}

	@Override
	public List<ProjectGroup<RDCourse>> getCoursesGroupedByCategory() {
	    Session session = factory.getCurrentSession();
	    List<RDCourse> courses = session.createQuery("from RDCourse", RDCourse.class).list();

	    return courses.stream()
	            .filter(course -> course.getCategory() != null) // Filter out courses with null categories
	            .collect(Collectors.groupingBy(RDCourse::getCategory))
	            .entrySet().stream()
	            .map(entry -> new ProjectGroup<>(entry.getKey(), entry.getValue()))
	            .collect(Collectors.toList());
	}


	@Override
	public List<ProjectGroup<RDCourse>> getCoursesGroupedByGradeRange() {
	    Session session = factory.getCurrentSession();
	    List<RDCourse> courses = session.createQuery("from RDCourse", RDCourse.class).list();

	    return courses.stream()
	            .filter(course -> course.getGradeRange() != null && course.getGradeRange().getDisplayName() != null) // Filter out null values
	            .collect(Collectors.groupingBy(course -> 
	                    course.getGradeRange().getDisplayName() != null 
	                    ? course.getGradeRange().getDisplayName() 
	                    : "Uncategorized")) // Use a default label if displayName is null
	            .entrySet().stream()
	            .map(entry -> new ProjectGroup<>(entry.getKey(), entry.getValue()))
	            .collect(Collectors.toList());
	}


	@Override
	public List<RDCourse> getFeaturedCourses() {
		Session session = factory.getCurrentSession();

		String hql = "FROM RDCourse WHERE isFeatured = true and is_active = true";
        Query<RDCourse> query = session.createQuery(hql, RDCourse.class);
        return query.getResultList();
	}

	@Override
	public List<RDCourse> searchCourses(String query) {
		 Session session = factory.getCurrentSession();
	        String hql = "FROM RDCourse WHERE courseName LIKE :query OR courseDescription LIKE :query";
	        Query<RDCourse> searchQuery = session.createQuery(hql, RDCourse.class);
	        searchQuery.setParameter("query", "%" + query + "%");
	        return searchQuery.getResultList();
	}

	@Override
    public List<RDCourse> findByTierLevel(String tierLevel) {
		return factory.getCurrentSession()
                .createQuery("FROM RDCourse WHERE tierLevel = :tierLevel")
                .setParameter("tierLevel", tierLevel)
                .list();
	}

	@Override
	public List<RDCourse> getAllCoursesWithOfferingsAndEnrollments() {
		 String hql = "SELECT DISTINCT c FROM RDCourse c " +
                 "LEFT JOIN FETCH c.courseOfferings o " +
                 "LEFT JOIN FETCH o.studentEnrollments e " +
                 "LEFT JOIN FETCH e.student";
	    return factory.getCurrentSession()
	        .createQuery(hql, RDCourse.class)
	        .getResultList();
		}

	@Override
	public List<RDCourse> getTrendingCourses() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<RDCourse> getCoursesNeedingMentors() {
		// TODO Auto-generated method stub
		return null;
	}

	public List<RDCourse> findCoursesByCategoryId(int categoryId) {
	    return factory.getCurrentSession().createQuery(
	        "from RDCourse c where c.courseCategory.courseCategoryId = :catId",
	        RDCourse.class
	    ).setParameter("catId", categoryId)
	     .getResultList();
	}

}

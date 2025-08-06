package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDSearchDao;
import com.robodynamics.dto.RDSearchResultDTO;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDCourse;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class RDSearchDaoImpl implements RDSearchDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<RDSearchResultDTO> search(Map<String, String> filters) {
        String entityType = filters.get("entityType");
        Session session = sessionFactory.getCurrentSession();
        List<RDSearchResultDTO> results = new ArrayList<>();

        switch (entityType != null ? entityType.toLowerCase() : "") {
            case "student":
                results.addAll(searchStudents(session, filters));
                break;
            case "mentor":
                results.addAll(searchMentors(session, filters));
                break;
            case "course":
                results.addAll(searchCourses(session, filters));
                break;
            default:
                results.addAll(searchStudents(session, filters));
                results.addAll(searchMentors(session, filters));
                results.addAll(searchCourses(session, filters));
        }

        return results;
    }

    private List<RDSearchResultDTO> searchStudents(Session session, Map<String, String> filters) {
        String hql = "FROM RDUser u WHERE u.role = 'STUDENT'";
        if (filters.containsKey("studentName") && !filters.get("studentName").isEmpty()) {
            hql += " AND lower(u.name) LIKE :name";
        }
        if (filters.containsKey("grade") && !filters.get("grade").isEmpty()) {
            hql += " AND u.grade = :grade";
        }

        Query<RDUser> query = session.createQuery(hql, RDUser.class);
        if (filters.containsKey("studentName") && !filters.get("studentName").isEmpty()) {
            query.setParameter("name", "%" + filters.get("studentName").toLowerCase() + "%");
        }
        if (filters.containsKey("grade") && !filters.get("grade").isEmpty()) {
            query.setParameter("grade", filters.get("grade"));
        }

        List<RDUser> users = query.list();
        List<RDSearchResultDTO> results = new ArrayList<>();
        for (RDUser user : users) {
            results.add(new RDSearchResultDTO(
                    user.getFirstName(),
                    "Student",
                    user.getGrade(),
                    "-", // course name later
                    user.getActive() == 1 ? "Active" : "Inactive"
            ));
        }
        return results;
    }

    private List<RDSearchResultDTO> searchMentors(Session session, Map<String, String> filters) {
        String hql = "FROM RDUser u WHERE u.role = 'MENTOR'";
        if (filters.containsKey("mentorName") && !filters.get("mentorName").isEmpty()) {
            hql += " AND lower(u.name) LIKE :name";
        }

        Query<RDUser> query = session.createQuery(hql, RDUser.class);
        if (filters.containsKey("mentorName") && !filters.get("mentorName").isEmpty()) {
            query.setParameter("name", "%" + filters.get("mentorName").toLowerCase() + "%");
        }

        List<RDUser> users = query.list();
        List<RDSearchResultDTO> results = new ArrayList<>();
        for (RDUser user : users) {
            results.add(new RDSearchResultDTO(
                    user.getFirstName(),
                    "Mentor",
                    "-", 
                    "-", 
                    user.getActive()==1 ? "Active" : "Inactive"
            ));
        }
        return results;
    }

    private List<RDSearchResultDTO> searchCourses(Session session, Map<String, String> filters) {
        String hql = "FROM RDCourse c WHERE 1=1";
        if (filters.containsKey("courseName") && !filters.get("courseName").isEmpty()) {
            hql += " AND lower(c.name) LIKE :courseName";
        }
        if (filters.containsKey("category") && !filters.get("category").isEmpty()) {
            hql += " AND c.category = :category";
        }

        Query<RDCourse> query = session.createQuery(hql, RDCourse.class);
        if (filters.containsKey("courseName") && !filters.get("courseName").isEmpty()) {
            query.setParameter("courseName", "%" + filters.get("courseName").toLowerCase() + "%");
        }
        if (filters.containsKey("category") && !filters.get("category").isEmpty()) {
            query.setParameter("category", filters.get("category"));
        }

        List<RDCourse> courses = query.list();
        List<RDSearchResultDTO> results = new ArrayList<>();
        for (RDCourse course : courses) {
            results.add(new RDSearchResultDTO(
                    course.getCourseName(),
                    "Course",
                    "-", 
                    course.getCourseName(),
                    course.isActive() ? "Active" : "Inactive"
            ));
        }
        return results;
    }
}

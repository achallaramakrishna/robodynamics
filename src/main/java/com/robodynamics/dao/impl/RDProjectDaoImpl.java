package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Order;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDProjectDao;
import com.robodynamics.model.RDProject;

@Repository
@Transactional
public class RDProjectDaoImpl implements RDProjectDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveRDProject(RDProject rdProject) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(rdProject);
    }

    @Override
    public RDProject getRDProject(int projectId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(RDProject.class, projectId);
    }

    @Override
    public List<RDProject> getRDProjects() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDProject> cq = cb.createQuery(RDProject.class);
        Root<RDProject> root = cq.from(RDProject.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void deleteRDProject(int projectId) {
        Session session = sessionFactory.getCurrentSession();
        RDProject rdProject = session.byId(RDProject.class).load(projectId);
        session.delete(rdProject);
    }
    
    @Override
    @Transactional
    public List<RDProject> getProjectsByGradeRange() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDProject> cq = cb.createQuery(RDProject.class);
        Root<RDProject> root = cq.from(RDProject.class);
        
        // Group by grade range
        cq.select(root).distinct(true);
        cq.orderBy(cb.asc(root.get("gradeRange")));  // Assuming "gradeRange" field is present
        return session.createQuery(cq).getResultList();
    }

    @Override
    @Transactional
    public List<RDProject> getProjectsByCategory() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDProject> cq = cb.createQuery(RDProject.class);
        Root<RDProject> root = cq.from(RDProject.class);
        
        // Group by category
        cq.select(root).distinct(true);
        cq.orderBy(cb.asc(root.get("category")));  // Assuming "category" field is present
        return session.createQuery(cq).getResultList();
    }

	@Override
    public List<RDProject> getFeaturedProjects() {
        String hql = "FROM RDProject WHERE isFeatured = true";
        Query<RDProject> query = sessionFactory.getCurrentSession().createQuery(hql, RDProject.class);
        return query.getResultList();
    }
	
	@Override
    public List<RDProject> searchProjects(String query) {
        Session session = sessionFactory.getCurrentSession();
        String hql = "FROM RDProject WHERE projectName LIKE :query OR detailedDescription LIKE :query OR shortDescription LIKE :query ";
        Query<RDProject> searchQuery = session.createQuery(hql, RDProject.class);
        searchQuery.setParameter("query", "%" + query + "%");
        return searchQuery.getResultList();
    }
}

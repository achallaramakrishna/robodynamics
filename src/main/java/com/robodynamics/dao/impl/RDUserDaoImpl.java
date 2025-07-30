package com.robodynamics.dao.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserDao;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDUser;

@Repository
@Transactional
public class RDUserDaoImpl implements RDUserDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public RDUser registerRDUser(RDUser rdUser) {
		
		System.out.println(rdUser);
		Session session = factory.getCurrentSession();
		rdUser.setCreatedDate(LocalDateTime.now());
		session.saveOrUpdate(rdUser);
		
		// rdUser will now have the ID populated (if auto-generated)
	    System.out.println("Generated ID: " + rdUser.getUserID());
	    
	    // Return the persisted object (with the ID populated)
	    return rdUser;
	}

	@Override
	public RDUser loginRDUser(RDUser rdUser) {
		// TODO Auto-generated method stub
		Session session = factory.getCurrentSession();
		try {
			Query<RDUser> query = session.createQuery("from RDUser where userName =:userName and password =:password",
					RDUser.class);
			query.setParameter("userName", rdUser.getUserName());
			query.setParameter("password", rdUser.getPassword());
			rdUser = query.getSingleResult();
			return rdUser;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public RDUser getRDUser(int userId) {
		Session session = factory.getCurrentSession();
		RDUser rdUser = session.get(RDUser.class, userId);
        return rdUser;

	}

	@Override
	public List<RDUser> getRDUsers() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDUser > cq = cb.createQuery(RDUser.class);
        Root < RDUser > root = cq.from(RDUser.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();

	}
	
	@Override
	public List<RDUser> getRDInstructors() {
		Session session = factory.getCurrentSession();
		List<RDUser> rdChildsList = new ArrayList<RDUser>();
		try {
			Query<RDUser> query = session.createQuery("from RDUser user where user.profile_id in (1,2,3)",
					RDUser.class);
			rdChildsList = query.getResultList();
			return rdChildsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}

	}

	@Override
	public void deleteRDUser(int id) {
        Session session = factory.getCurrentSession();
        RDUser rdUser = session.byId(RDUser.class).load(id);
        session.delete(rdUser);
		
	}

	@Override
	public List<RDUser> getRDChilds(int parentUserId) {

		System.out.println("Parent user id : " + parentUserId);
		Session session = factory.getCurrentSession();
		List<RDUser> rdChildsList = new ArrayList<RDUser>();
		try {
			Query<RDUser> query = session.createQuery("from RDUser where dad.userID =:parentUserId or mom.userID =:parentUserId",
					RDUser.class);
			query.setParameter("parentUserId", parentUserId);
			rdChildsList = query.getResultList();
			return rdChildsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public List<RDUser> getRDUsersByProfile(int profileId) {
		System.out.println("profileId id : " + profileId);
		Session session = factory.getCurrentSession();
		List<RDUser> rdUsersByProfile = new ArrayList<RDUser>();
		try {
			Query<RDUser> query = session.createQuery("from RDUser where profileId =:profileId",
					RDUser.class);
			query.setParameter("profileId", profileId);
			rdUsersByProfile = query.getResultList();
			return rdUsersByProfile;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public List<RDUser> searchUsers(int profileId, int active) {
		System.out.println("profileId id : " + profileId);
		Session session = factory.getCurrentSession();
		List<RDUser> rdUsers = new ArrayList<RDUser>();
		try {
			Query<RDUser> query = session.createQuery("from RDUser where profile_id =:profileId and active =:active",
					RDUser.class);
			query.setParameter("profileId", profileId);
			query.setParameter("active", active);
			rdUsers = query.getResultList();
			return rdUsers;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public RDUser getRDUser(String userName, String password) {
		// TODO Auto-generated method stub
		RDUser rdUser = null;
		Session session = factory.getCurrentSession();
		try {
			Query<RDUser> query = session.createQuery("from RDUser where userName =:userName and password =:password",
					RDUser.class);
			query.setParameter("userName", userName);
			query.setParameter("password", password);
			rdUser = query.getSingleResult();
			return rdUser;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}

	}

	@Override
	public RDUser findByUserName(String userName) {
		Session session = factory.getCurrentSession();
        Query<RDUser> query = session.createQuery("from RDUser where userName = :userName", RDUser.class);
        query.setParameter("userName", userName);
        return query.uniqueResult();
	}
	
	@Override
	public RDUser getChildByParentId(int parentId) {
	    Session session = factory.getCurrentSession();
	    
	    // Assuming there's a field in the RDUser entity representing the parent-child relationship
	    String hql = "FROM RDUser u WHERE u.dad.userID = :parentId";
	    
	    Query<RDUser> query = session.createQuery(hql, RDUser.class);
	    query.setParameter("parentId", parentId);
	    
	    // Fetch the list of results
	    List<RDUser> children = query.list();
	    
	    // Check if the list is not empty and return the first child, or null if empty
	    return !children.isEmpty() ? children.get(0) : null;
	}

	@Override
	public List<RDUser> findEnrolledStudentsByOffering(int courseOfferingId) {
		String hql = "SELECT e.student FROM RDStudentEnrollment e WHERE e.courseOffering.courseOfferingId = :offeringId";
	    Query<RDUser> query = factory.getCurrentSession().createQuery(hql, RDUser.class);
	    query.setParameter("offeringId", courseOfferingId);
	    return query.getResultList();
	}

	

}

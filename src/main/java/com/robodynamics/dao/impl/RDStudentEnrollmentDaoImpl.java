package com.robodynamics.dao.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.hibernate.SessionFactory;
import org.hibernate.transform.Transformers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dao.RDStudentEnrollmentDao;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import com.robodynamics.dto.RDStudentInfoDTO;

import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;

@Repository
@Transactional
public class RDStudentEnrollmentDaoImpl implements RDStudentEnrollmentDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDStudentEnrollment(RDStudentEnrollment rdStudentEnrollment) {
		System.out.println("hello -- " + rdStudentEnrollment);
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdStudentEnrollment);

	}

	@Override
	public RDStudentEnrollment getRDStudentEnrollment(int rdStudentEnrollmentId) {
		Session session = factory.getCurrentSession();
		RDStudentEnrollment rdStudentEnrollment = session.get(RDStudentEnrollment.class, rdStudentEnrollmentId);
		return rdStudentEnrollment;
	}

	@Override
	public List<RDStudentEnrollment> getRDStudentEnrollments() {
		Session session = factory.getCurrentSession();
		CriteriaBuilder cb = session.getCriteriaBuilder();
		CriteriaQuery<RDStudentEnrollment> cq = cb.createQuery(RDStudentEnrollment.class);
		Root<RDStudentEnrollment> root = cq.from(RDStudentEnrollment.class);

		// Add condition where status = 1
		//Predicate statusCondition = cb.equal(root.get("status"), 1);

		// Apply the condition to the query
		//cq.select(root).where(statusCondition);

		// Sort by status DESC (1 first, 0 later)
	    cq.select(root).orderBy(cb.desc(root.get("status")));

		// Execute query
		Query<RDStudentEnrollment> query = session.createQuery(cq);
		return query.getResultList();
	}

	@Override
	public void deleteRDStudentEnrollment(int id) {
		Session session = factory.getCurrentSession();
		RDStudentEnrollment rdStudentEnrollment = session.byId(RDStudentEnrollment.class).load(id);
		session.delete(rdStudentEnrollment);

	}

	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentsListByParent(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDStudentEnrollment> query = session.createQuery(
					"from RDStudentEnrollment where parent.userID =:userId and status = 1", RDStudentEnrollment.class);
			query.setParameter("userId", userId);
			List<RDStudentEnrollment> rdStudentEnrollmentsList = query.getResultList();
			return rdStudentEnrollmentsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public List<RDStudentEnrollment> getStudentEnrollmentsListByStudent(int userId) {
		Session session = factory.getCurrentSession();

		try {
			Query<RDStudentEnrollment> query = session.createQuery(
					"from RDStudentEnrollment where student.userID =:userId and status = 1", RDStudentEnrollment.class);
			query.setParameter("userId", userId);
			List<RDStudentEnrollment> rdStudentEnrollmentsList = query.getResultList();
			return rdStudentEnrollmentsList;
		} catch (NoResultException e) {
			// TODO: handle exception
			return null;
		}
	}

	@Override
	public List<RDUser> getStudentsEnrolledInOffering(int courseOfferingId) {
		String hql = "SELECT e.student FROM RDStudentEnrollment e WHERE e.courseOffering.courseOfferingId = :courseOfferingId";
		Query<RDUser> query = factory.getCurrentSession().createQuery(hql, RDUser.class);
		query.setParameter("courseOfferingId", courseOfferingId);
		return query.getResultList();
	}

	@Override
	public List<RDStudentEnrollment> getEnrolledStudentsByOfferingId(int courseOfferingId) {
		//String hql = "FROM RDStudentEnrollment e WHERE e.courseOffering.courseOfferingId = :courseOfferingId";
		
		String hql = "select e from RDStudentEnrollment e join fetch e.student s where e.courseOffering.courseOfferingId = :courseOfferingId";
		return factory.getCurrentSession().createQuery(hql, RDStudentEnrollment.class)
				.setParameter("courseOfferingId", courseOfferingId).getResultList();
	}

	@Override
	@Transactional
	public Integer findEnrollmentIdByStudentAndOffering(int offeringId, int userId) {
		System.out.println("🔍 DAO Input: offeringId=" + offeringId + ", userId=" + userId);

		String hql = "SELECT e.enrollmentId FROM RDStudentEnrollment e "
				+ "WHERE e.courseOffering.courseOfferingId = :offeringId " + "AND e.student.userID = :userId"; // ✅ use
																												// userId
																												// (confirm
																												// RDUser
																												// entity
																												// field)

		Query<Integer> query = factory.getCurrentSession().createQuery(hql, Integer.class);
		query.setParameter("offeringId", offeringId);
		query.setParameter("userId", userId);

		Integer enrollmentId = query.uniqueResult();
		System.out.println("✅ DAO Result EnrollmentId: " + enrollmentId);
		return enrollmentId;
	}

	public List<RDStudentEnrollment> getEnrollmentsByCourseId(Integer courseId) {
		String hql = "select e " + "from RDStudentEnrollment e " + "join fetch e.student s "
				+ "join fetch e.courseOffering o " + "join fetch o.course c " + "where c.courseId = :courseId";

		return factory.getCurrentSession().createQuery(hql).setParameter("courseId", courseId).list();
	}

	@Override
	@Transactional(readOnly = true)
	public List<RDEnrollmentReportDTO> getEnrollmentsByParentId(Integer parentId) {
		Session session = factory.getCurrentSession();

		final String hql = "select " + "  e.enrollmentId, " + // 0
				"  concat(coalesce(s.firstName, ''), "
				+ "         case when s.lastName is null or s.lastName = '' then '' else concat(' ', s.lastName) end), "
				+ // 1 studentName
				"  s.grade, " + // 2
				"  case when mom.userID = :parentId " + "       then concat(coalesce(mom.firstName, ''), "
				+ "                  case when mom.lastName is null or mom.lastName = '' then '' else concat(' ', mom.lastName) end) "
				+ "       else concat(coalesce(dad.firstName, ''), "
				+ "                  case when dad.lastName is null or dad.lastName = '' then '' else concat(' ', dad.lastName) end) "
				+ "  end, " + // 3 parentName
				"  case when mom.userID = :parentId then mom.cellPhone else dad.cellPhone end, " + // 4 parentContact
				"  e.enrollmentDate " + // 5 (java.util.Date)
				"from RDStudentEnrollment e " + "  join e.student s " + "  left join s.mom mom "
				+ "  left join s.dad dad " + "where (mom.userID = :parentId or dad.userID = :parentId) "
				+ "order by e.enrollmentDate desc";

		Query<Object[]> q = session.createQuery(hql, Object[].class);
		q.setParameter("parentId", parentId);

		List<Object[]> rows = q.getResultList();
		List<RDEnrollmentReportDTO> out = new ArrayList<>(rows.size());

		for (Object[] r : rows) {
			Integer enrollmentId = (r[0] == null) ? null : ((Number) r[0]).intValue();
			String studentName = (String) r[1];
			String grade = (String) r[2];
			String parentName = (String) r[3];
			String parentContact = (String) r[4];
			java.util.Date d = (java.util.Date) r[5];

			java.time.LocalDate enrollmentDate = (d == null) ? null
					: d.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();

			RDEnrollmentReportDTO dto = new RDEnrollmentReportDTO(enrollmentId == null ? 0 : enrollmentId, studentName,
					grade, parentName, parentContact, enrollmentDate);
			out.add(dto);
		}
		return out;
	}

	@Override
	public List<RDStudentInfoDTO> getEnrolledStudentInfosByOfferingIdAndParent(Integer offeringId, Integer parentId) {
		Session session = factory.getCurrentSession();

		String hql = """
				    select new com.robodynamics.dto.RDStudentInfoDTO(
				        e.enrollmentId,
				        coalesce(s.firstName, ''),
				        coalesce(s.lastName, '')
				    )
				    from RDStudentEnrollment e
				        join e.student s
				        join e.courseOffering o
				        left join s.mom mom
				        left join s.dad dad
				    where o.courseOfferingId = :offeringId
				      and (
				            (mom is not null and mom.userID = :pid)
				         or (dad is not null and dad.userID = :pid)
				      )
				    order by s.firstName, s.lastName
				""";

		@SuppressWarnings("unchecked")
		List<RDStudentInfoDTO> results = session.createQuery(hql).setParameter("offeringId", offeringId)
				.setParameter("pid", parentId).getResultList();

		return results != null ? results : Collections.emptyList();
	}

	public List<RDStudentInfoDTO> getChildrenByParentId(Integer parentId) {
		String hql = """
				    select new com.robodynamics.dto.RDStudentInfoDTO(
				        s.userID,
				        s.firstName,
				        s.lastName
				    )
				    from RDStudentEnrollment e
				    join e.student s
				    where (s.mom.userID = :pid or s.dad.userID = :pid)
				""";

		return factory.getCurrentSession().createQuery(hql, RDStudentInfoDTO.class).setParameter("pid", parentId)
				.getResultList();
	}

	@Override
	@Transactional(readOnly = true)
	public boolean enrollmentBelongsToParent(Integer enrollmentId, Integer parentId) {
		System.out.println(">>> DAO.enrollmentBelongsToParent enr=" + enrollmentId + " pid=" + parentId);

		final String hql = "select count(e.enrollmentId) " + "from RDStudentEnrollment e " + "  join e.student s "
				+ "  left join s.mom mom " + "  left join s.dad dad " + "where e.enrollmentId = :enrId "
				+ "  and (mom.userID = :pid or dad.userID = :pid)";

		Session session = factory.getCurrentSession();
		Long cnt = session.createQuery(hql, Long.class).setParameter("enrId", enrollmentId)
				.setParameter("pid", parentId).uniqueResult();

		boolean owns = cnt != null && cnt.longValue() > 0L;
		System.out.println("<<< DAO.enrollmentBelongsToParent -> " + owns + " (count=" + cnt + ")");
		return owns;
	}

	@Override
	public int countEnrollments(int courseOfferingId) {
		String hql = "select count(e) from RDStudentEnrollment e " + "where e.courseOffering.courseOfferingId = :offId";
		Session session = factory.getCurrentSession();
		Query<Long> q = session.createQuery(hql, Long.class);
		q.setParameter("offId", courseOfferingId);
		Long result = q.uniqueResult();
		return (result != null) ? result.intValue() : 0;
	}

	@Override
	public List<RDStudentEnrollment> getActiveEnrollments() {
	    Session session = factory.getCurrentSession();

	    // HQL to select enrollments by numeric status codes
	    String hql = "FROM RDStudentEnrollment e WHERE e.status IN (:statuses)";

	    // 1 = ACTIVE, 2 = ONGOING  (use your actual codes)
	    List<Integer> activeStatuses = Arrays.asList(1, 2);

	    return session.createQuery(hql, RDStudentEnrollment.class)
	                  .setParameterList("statuses", activeStatuses)
	                  .getResultList();
	}

    @Override @Transactional(readOnly = true)
    public boolean existsByStudentAndOffering(int studentId, int offeringId) {
    	Session session = factory.getCurrentSession();

    	Long cnt = session.createQuery(
            "select count(e) from RDStudentEnrollment e " +
            " where e.student.userID=:sid and e.courseOffering.courseOfferingId=:oid " +
            " and e.status<>0", Long.class)
            .setParameter("sid", studentId).setParameter("oid", offeringId)
            .getSingleResult();
        return cnt != null && cnt > 0;
    }


}
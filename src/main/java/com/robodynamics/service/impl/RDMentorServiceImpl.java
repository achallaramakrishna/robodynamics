// src/main/java/com/robodynamics/service/impl/RDMentorServiceImpl.java
package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorDao;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.dto.RDMentorSearchCriteria;
import com.robodynamics.model.*;
import com.robodynamics.service.RDMentorService;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RDMentorServiceImpl implements RDMentorService {

	private final RDMentorDao mentorDao;
	private final SessionFactory sessionFactory;

	private Session s() {
		return sessionFactory.getCurrentSession();
	}

	private static String likeWrap(String s) {
		return (s == null || s.isBlank()) ? null : "%" + s.trim() + "%";
	}

	public RDMentorServiceImpl(RDMentorDao mentorDao, SessionFactory sessionFactory) {
		this.mentorDao = mentorDao;
		this.sessionFactory = sessionFactory;
	}

	// ============================
	// Simple Reads
	// ============================

	@Override
	@Transactional(readOnly = true)
	public List<RDMentorDTO> getAllMentors() {
		return mentorDao.findAllMentorsBasic();
	}

	@Override
	@Transactional(readOnly = true)
	public List<RDMentorDTO> getMentorsWithSummary() {
		return mentorDao.findMentorsSummary();
	}

	@Override
	@Transactional(readOnly = true)
	public List<RDMentorDTO> getFeaturedMentors() {
		return mentorDao.findFeaturedMentors();
	}

	// ============================
	// Mentor onboarding
	// ============================

	@Override
	@Transactional
	public Integer upsertMentorFromLead(RDLead lead, List<RDSkill> rdSkills) {

		Session s = sessionFactory.getCurrentSession();

		RDUser user = findUserByPhoneOrEmail(s, lead.getPhone(), lead.getEmail());

		if (user == null) {
			user = new RDUser();
			user.setFirstName(lead.getName());
			user.setCellPhone(lead.getPhone());
			user.setAge(25);
			user.setEmail(lead.getEmail());
			user.setActive(1);
			user.setProfile_id(RDUser.profileType.ROBO_MENTOR.getValue());
			user.setUserName("temp");
			user.setPassword("temp");
			s.save(user);
		} else {
			user.setActive(1);
			user.setProfile_id(RDUser.profileType.ROBO_MENTOR.getValue());
			s.update(user);
		}

		Integer mentorId = s.createQuery("select m.mentorId from RDMentor m where m.user.userID = :uid", Integer.class)
				.setParameter("uid", user.getUserID()).uniqueResult();

		if (mentorId == null) {
			RDMentor m = new RDMentor();
			m.setUser(user);
			m.setFullName(lead.getName());
			m.setEmail(nvl(lead.getEmail(), "pending+" + user.getUserID() + "@example.com"));
			m.setMobile(nvl(lead.getPhone(), "NA"));
			m.setIsActive(1);
			m.setIsVerified(false);
			s.save(m);
			mentorId = m.getMentorId();
		}

		upsertMentorSkills(mentorId, rdSkills);
		return mentorId;
	}

	@Override
	@Transactional
	public void upsertMentorSkills(Integer mentorId, List<RDSkill> rdSkills) {

		if (mentorId == null || rdSkills == null || rdSkills.isEmpty())
			return;

		Session s = sessionFactory.getCurrentSession();

		Set<String> existing = s
				.createQuery("select lower(ms.skillLabel) from RDMentorSkill ms where ms.mentorId = :mid", String.class)
				.setParameter("mid", mentorId).getResultStream().collect(Collectors.toSet());

		for (RDSkill sk : rdSkills) {
			String label = sk.getSkillName();
			if (label == null || label.isBlank())
				continue;

			String key = label.trim().toLowerCase();
			if (existing.contains(key))
				continue;

			RDMentorSkill ms = new RDMentorSkill();
			ms.setMentorId(mentorId);
			ms.setSkillLabel(label.trim());
			ms.setSkillCode(toCode(label));
			ms.setSkillLevel("beginner");
			s.save(ms);

			existing.add(key);
		}
	}

	// ============================
	// Helpers
	// ============================

	private RDUser findUserByPhoneOrEmail(Session s, String phone, String email) {
		if (phone != null && !phone.isEmpty()) {
			RDUser u = s.createQuery("from RDUser u where u.cellPhone = :p", RDUser.class).setParameter("p", phone)
					.uniqueResult();
			if (u != null)
				return u;
		}
		if (email != null && !email.isEmpty()) {
			return s.createQuery("from RDUser u where u.email = :e", RDUser.class).setParameter("e", email)
					.uniqueResult();
		}
		return null;
	}

	private String toCode(String label) {
		String t = label.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_");
		return (t.length() > 40) ? t.substring(0, 40) : t;
	}

	private static String nvl(String v, String def) {
		return (v == null || v.isEmpty()) ? def : v;
	}

	// ============================
	// Advanced Mentor Search
	// ============================

	private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
	        "fullName", "city", "experienceYears", "avgRating",
	        "studentCount", "demoCount", "recommendationCount",
	        "isVerified", "createdAt"
	);

	@Override
	@Transactional(readOnly = true)
	public List<RDMentor> searchMentors(RDMentorSearchCriteria c,
	                                    int page,
	                                    int size,
	                                    String sortBy,
	                                    String sortDir) {

	    if (!ALLOWED_SORT_FIELDS.contains(sortBy))
	        sortBy = "experienceYears";

	    StringBuilder where = new StringBuilder(" where 1=1 ");
	    Map<String, Object> params = new HashMap<>();

	    // CITY
	    if (c.getCity() != null) {
	        where.append(" and m.city = :city ");
	        params.put("city", c.getCity());
	    }

	    // FREE TEXT
	    if (c.getEnquiryText() != null) {
	        where.append(" and ( m.fullName like :q OR m.bio like :q OR m.specializations like :q ) ");
	        params.put("q", likeWrap(c.getEnquiryText()));
	    }

	    // MULTI-SKILL (exists subquery with IN)
	    if (c.getSkillCodes() != null && !c.getSkillCodes().isEmpty()) {
	        where.append(" and exists (")
	             .append(" select 1 from RDMentorSkill ms ")
	             .append(" where ms.mentorId = m.mentorId ")
	             .append(" and ms.skillCode in (:skillCodes) ) ");
	        params.put("skillCodes", c.getSkillCodes());
	    }

	    // MODE
	    if (c.getMode() != null) {
	        where.append(" and m.modes like :mode ");
	        params.put("mode", likeWrap(c.getMode()));
	    }

	    // VERIFIED
	    if (Boolean.TRUE.equals(c.getVerifiedOnly())) {
	        where.append(" and m.isVerified = true ");
	    }

	    // GENDER
	    if (c.getGender() != null) {
	        where.append(" and m.bio like :genderTag ");
	        params.put("genderTag", "%" + c.getGender() + "%");
	    }

	    // BOARD
	    if (c.getBoard() != null) {
	        where.append(" and m.boardsSupported like :board ");
	        params.put("board", likeWrap(c.getBoard()));
	    }

	    // MULTI-GRADE: build OR conditions
	    if (c.getGrades() != null && !c.getGrades().isEmpty()) {
	        where.append(" and (");
	        for (int i = 0; i < c.getGrades().size(); i++) {
	            if (i > 0) where.append(" or ");
	            String paramName = "grade" + i;
	            where.append(" m.gradeRange like :").append(paramName).append(" ");
	            params.put(paramName, "%" + c.getGrades().get(i) + "%");
	        }
	        where.append(") ");
	    }

	    // ---------- PAGINATION: get IDs first ----------
	    String idHql =
	            "select m.mentorId from RDMentor m " +
	            where.toString() +
	            " order by m." + sortBy + " " + sortDir;

	    Query<Integer> idQuery = s().createQuery(idHql, Integer.class);
	    params.forEach(idQuery::setParameter);

	    idQuery.setFirstResult((page - 1) * size);
	    idQuery.setMaxResults(size);

	    List<Integer> mentorIds = idQuery.list();
	    if (mentorIds.isEmpty()) {
	        return Collections.emptyList();
	    }

	    // ---------- FETCH ENTITIES WITH JOIN FETCH ----------
	    String fetchHql =
	            "select distinct m from RDMentor m " +
	            " left join fetch m.skills s " +
	            " where m.mentorId in (:ids) " +
	            " order by m." + sortBy + " " + sortDir;

	    Query<RDMentor> query = s().createQuery(fetchHql, RDMentor.class);
	    query.setParameterList("ids", mentorIds);

	    return query.list();
	}

	@Override
	@Transactional(readOnly = true)
	public long countMentors(RDMentorSearchCriteria c) {

	    StringBuilder hql = new StringBuilder(
	            "select count(distinct m.mentorId) from RDMentor m where 1=1 "
	    );
	    Map<String, Object> params = new HashMap<>();

	    // SAME FILTERS AS ABOVE (but no pagination / ordering)

	    if (c.getCity() != null) {
	        hql.append(" and m.city = :city ");
	        params.put("city", c.getCity());
	    }

	    if (c.getEnquiryText() != null) {
	        hql.append(" and ( m.fullName like :q OR m.bio like :q OR m.specializations like :q ) ");
	        params.put("q", likeWrap(c.getEnquiryText()));
	    }

	    if (c.getSkillCodes() != null && !c.getSkillCodes().isEmpty()) {
	        hql.append(" and exists (")
	           .append(" select 1 from RDMentorSkill ms ")
	           .append(" where ms.mentorId = m.mentorId ")
	           .append(" and ms.skillCode in (:skillCodes) ) ");
	        params.put("skillCodes", c.getSkillCodes());
	    }

	    if (c.getMode() != null) {
	        hql.append(" and m.modes like :mode ");
	        params.put("mode", likeWrap(c.getMode()));
	    }

	    if (Boolean.TRUE.equals(c.getVerifiedOnly())) {
	        hql.append(" and m.isVerified = true ");
	    }

	    if (c.getGender() != null) {
	        hql.append(" and m.bio like :genderTag ");
	        params.put("genderTag", "%" + c.getGender() + "%");
	    }

	    if (c.getBoard() != null) {
	        hql.append(" and m.boardsSupported like :board ");
	        params.put("board", likeWrap(c.getBoard()));
	    }

	    if (c.getGrades() != null && !c.getGrades().isEmpty()) {
	        hql.append(" and (");
	        for (int i = 0; i < c.getGrades().size(); i++) {
	            if (i > 0) hql.append(" or ");
	            String paramName = "grade" + i;
	            hql.append(" m.gradeRange like :").append(paramName).append(" ");
	            params.put(paramName, "%" + c.getGrades().get(i) + "%");
	        }
	        hql.append(") ");
	    }

	    Query<Long> q = s().createQuery(hql.toString(), Long.class);
	    params.forEach(q::setParameter);

	    return q.uniqueResult();
	}



	@Override
	@Transactional(readOnly = true)
	public RDMentor getMentorById(Integer mentorId) {
		return mentorDao.getMentorById(mentorId);
	}

	// ----------------------------
	// PROFILE COMPLETION CHECK
	// ----------------------------
	@Override
	@Transactional(readOnly = true)
	public boolean isMentorProfileComplete(int userId) {

		RDMentor mentor = mentorDao.findByUserId(userId);

		if (mentor == null)
			return false;

		// You can decide what “complete” means.
		return mentor.getFullName() != null && mentor.getEmail() != null && mentor.getMobile() != null
				&& mentor.getIsActive() == 1;
	}

	@Override
	public boolean hasMentorProfile(int userID) {
		return mentorDao.hasMentorProfile(userID);
	}

	@Override
	public List<RDMentor> findMentorsForLead(RDLead lead) {
		// TODO Auto-generated method stub
		return mentorDao.findMentorsForLead(lead);
	}

}

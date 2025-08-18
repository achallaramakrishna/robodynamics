package com.robodynamics.dao.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.NoResultException;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDTestDao;
import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.dto.RDTestEnrollSummaryDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDTest;
import com.robodynamics.model.RDTestDetailRole;
import com.robodynamics.model.RDTestSession;
import com.robodynamics.model.RDVisibility;

@Repository
@Transactional
public class RDTestDaoImpl implements RDTestDao {

    private final SessionFactory sessionFactory;
    public RDTestDaoImpl(SessionFactory sf) { this.sessionFactory = sf; }
    private Session s() { return sessionFactory.getCurrentSession(); }

    /* =========================================================
       CRUD
       ========================================================= */
    @Override
    public RDTest save(RDTest test) { s().persist(test); return test; }

    @Override
    public void update(RDTest test) { s().merge(test); }

    /* =========================================================
       SINGLE FETCHES (role-aware & admin)
       ========================================================= */
    @Override
    public RDTest findByIdWithCourse(Integer testId) {
        String hql =
            "select t from RDTest t " +
            "left join fetch t.course c " +
            "where t.testId = :tid";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .uniqueResult();
    }

    @Override
    public RDTest findByIdWithSessionsForAdmin(Integer testId) {
        String hql =
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            "left join fetch t.mappings m " +
            "left join fetch m.courseSession cs " +
            "where t.testId = :tid";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .uniqueResult();
    }

    @Override
    public RDTest findByIdIfMentor(Integer testId, int mentorUserId) {
        String hql =
            "select t " +
            "from RDTest t " +
            "join t.course c " +
            "where t.testId = :tid " +
            "  and exists (" +
            "        select 1 " +
            "        from RDCourseOffering co " +
            "        where co.course = c " +
            "          and co.instructor.userID = :mid" +
            "  )";

        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("mid", mentorUserId)
                  .uniqueResult();
    }

    @Override
    public RDTest findByIdWithSessionsIfMentor(Integer testId, int mentorUserId) {
        String hql =
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            "left join fetch t.mappings m " +
            "left join fetch m.courseSession cs " +
            "where t.testId = :tid " +
            "  and c.courseId in (" +
            "     select mc.course.courseId from RDMentorCourse mc where mc.mentor.userID = :mid" +
            "  )";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("mid", mentorUserId)
                  .uniqueResult();
    }

    @Override
    public RDTest findByIdIfStudent(Integer testId, int studentUserId) {
        // Student can see tests of courses where the student is enrolled
        String hql =
            "select t from RDTest t " +
            "join t.course c " +
            "where t.testId = :tid " +
            "  and c.courseId in (" +
            "    select co.course.courseId " +
            "    from RDStudentEnrollment e join e.courseOffering co " +
            "    where e.student.userID = :sid" +
            "  )";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("sid", studentUserId)
                  .uniqueResult();
    }

    @Override
    public RDTest findByIdWithSessionsIfStudent(Integer testId, int studentUserId) {
        String hql =
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            "left join fetch t.mappings m " +
            "left join fetch m.courseSession cs " +
            "where t.testId = :tid " +
            "  and c.courseId in (" +
            "    select co.course.courseId " +
            "    from RDStudentEnrollment e join e.courseOffering co " +
            "    where e.student.userID = :sid" +
            "  )";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("sid", studentUserId)
                  .uniqueResult();
    }

    @Override
    public RDTest findOwnedByParent(Integer testId, Integer parentUserId) {
        String hql =
            "select t from RDTest t " +
            "left join fetch t.course c " +
            "where t.testId = :tid and t.createdBy = :pid";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("pid", parentUserId)
                  .uniqueResult();
    }

    @Override
    public RDTest findOwnedByParentWithSessions(Integer testId, int parentUserId) {
        String hql =
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            "left join fetch t.mappings m " +
            "left join fetch m.courseSession cs " +
            "where t.testId = :tid and t.createdBy = :pid";
        return s().createQuery(hql, RDTest.class)
                  .setParameter("tid", testId)
                  .setParameter("pid", parentUserId)
                  .uniqueResult();
    }

    /* =========================================================
       LISTS (role-aware)
       ========================================================= */
    @Override
    public List<RDTest> findAllForAdmin(String q, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "select distinct t from RDTest t left join fetch t.course c where 1=1 "
        );
        if (courseId != null) hql.append("and c.courseId = :cid ");
        if (q != null && !q.trim().isEmpty()) hql.append("and (lower(t.testTitle) like :q or lower(c.courseName) like :q) ");
        hql.append("order by t.testDate desc, t.testId desc");

        var query = s().createQuery(hql.toString(), RDTest.class);
        if (courseId != null) query.setParameter("cid", courseId);
        if (q != null && !q.trim().isEmpty()) query.setParameter("q", "%" + q.toLowerCase() + "%");
        return query.getResultList();
    }

    

    @Override
    public List<RDTest> findForStudent(int studentUserId, String q, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            "where c.courseId in (" +
            "  select co.course.courseId " +
            "  from RDStudentEnrollment e join e.courseOffering co " +
            "  where e.student.userID = :sid" +
            ") "
        );
        if (courseId != null) hql.append("and c.courseId = :cid ");
        if (q != null && !q.trim().isEmpty()) hql.append("and (lower(t.testTitle) like :q or lower(c.courseName) like :q) ");
        hql.append("order by t.testDate desc, t.testId desc");

        var query = s().createQuery(hql.toString(), RDTest.class)
                       .setParameter("sid", studentUserId);
        if (courseId != null) query.setParameter("cid", courseId);
        if (q != null && !q.trim().isEmpty()) query.setParameter("q", "%" + q.toLowerCase() + "%");
        return query.getResultList();
    }

    @Override
    public List<RDTest> findByParent(Integer parentUserId, Integer courseId, String q) {
        StringBuilder hql = new StringBuilder(
            "select distinct t from RDTest t left join fetch t.course c where t.createdBy = :pid "
        );
        if (courseId != null) hql.append("and c.courseId = :cid ");
        if (q != null && !q.trim().isEmpty()) hql.append("and (lower(t.testTitle) like :q or lower(c.courseName) like :q) ");
        hql.append("order by t.testDate desc, t.testId desc");

        var query = s().createQuery(hql.toString(), RDTest.class)
                       .setParameter("pid", parentUserId);
        if (courseId != null) query.setParameter("cid", courseId);
        if (q != null && !q.trim().isEmpty()) query.setParameter("q", "%" + q.toLowerCase() + "%");
        return query.getResultList();
    }

    /* =========================================================
       RANGED LISTS (calendar)
       ========================================================= */
    @Override
    public List<RDTest> findBetweenForAdmin(LocalDate start, LocalDate end, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "from RDTest t where t.testDate >= :start and t.testDate < :end "
        );
        if (courseId != null) hql.append("and t.course.courseId = :cid ");
        hql.append("order by t.testDate asc, t.testId asc");
        var q = s().createQuery(hql.toString(), RDTest.class)
                   .setParameter("start", start)
                   .setParameter("end", end);
        if (courseId != null) q.setParameter("cid", courseId);
        return q.getResultList();
    }

    @Override
    public List<RDTest> findBetweenForMentor(int mentorUserId, LocalDate start, LocalDate end, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "from RDTest t " +
            "where t.testDate >= :start and t.testDate < :end " +
            "  and t.course.courseId in (" +
            "       select mc.course.courseId from RDMentorCourse mc where mc.mentor.userID = :mid" +
            "  ) "
        );
        if (courseId != null) hql.append("and t.course.courseId = :cid ");
        hql.append("order by t.testDate asc, t.testId asc");

        var q = s().createQuery(hql.toString(), RDTest.class)
                   .setParameter("start", start)
                   .setParameter("end", end)
                   .setParameter("mid", mentorUserId);
        if (courseId != null) q.setParameter("cid", courseId);
        return q.getResultList();
    }

    @Override
    public List<RDTest> findBetweenForStudent(int studentUserId, LocalDate start, LocalDate end, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "from RDTest t " +
            "where t.testDate >= :start and t.testDate < :end " +
            "  and t.course.courseId in (" +
            "       select co.course.courseId " +
            "       from RDStudentEnrollment e join e.courseOffering co " +
            "       where e.student.userID = :sid" +
            "  ) "
        );
        if (courseId != null) hql.append("and t.course.courseId = :cid ");
        hql.append("order by t.testDate asc, t.testId asc");

        var q = s().createQuery(hql.toString(), RDTest.class)
                   .setParameter("start", start)
                   .setParameter("end", end)
                   .setParameter("sid", studentUserId);
        if (courseId != null) q.setParameter("cid", courseId);
        return q.getResultList();
    }

    @Override
    public List<RDTest> findByParentBetween(Integer parentUserId, LocalDate start, LocalDate end, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "from RDTest t where t.createdBy = :pid and t.testDate >= :start and t.testDate < :end "
        );
        if (courseId != null) hql.append("and t.course.courseId = :cid ");
        hql.append("order by t.testDate asc, t.testId asc");

        var q = s().createQuery(hql.toString(), RDTest.class)
                   .setParameter("pid", parentUserId)
                   .setParameter("start", start)
                   .setParameter("end", end);
        if (courseId != null) q.setParameter("cid", courseId);
        return q.getResultList();
    }

    /* =========================================================
       DELETE (role-aware)
       ========================================================= */
    @Override
    public void deleteAsAdmin(Integer testId) {
        // remove links, then test
        s().createQuery("delete from RDTestSession x where x.test.testId = :tid")
          .setParameter("tid", testId).executeUpdate();
        RDTest t = s().get(RDTest.class, testId);
        if (t != null) s().remove(t);
    }

    @Override
    public void deleteIfMentor(Integer testId, int mentorUserId) {
        RDTest t = findByIdIfMentor(testId, mentorUserId);
        if (t == null) return;
        s().createQuery("delete from RDTestSession x where x.test.testId = :tid")
          .setParameter("tid", testId).executeUpdate();
        s().remove(t);
    }

    @Override
    public void deleteOwnedByParent(Integer testId, Integer parentUserId) {
        RDTest t = findOwnedByParent(testId, parentUserId);
        if (t == null) return;
        s().createQuery("delete from RDTestSession x where x.test.testId = :tid")
          .setParameter("tid", testId).executeUpdate();
        s().remove(t);
    }

    /* =========================================================
       LINKING (rd_test_session)
       ========================================================= */
    @Override
    public boolean linkSession(Integer testId, Integer courseSessionId,
                               RDTestDetailRole role, Integer uploadedBy,
                               String notes, RDVisibility visibility) {
        Long count = s().createQuery(
                "select count(x) from RDTestSession x " +
                "where x.test.testId = :tid and x.courseSession.courseSessionId = :csid",
                Long.class)
            .setParameter("tid", testId)
            .setParameter("csid", courseSessionId)
            .uniqueResult();
        if (count != null && count > 0) return false;

        RDTest test = s().get(RDTest.class, testId);
        RDCourseSession cs = s().get(RDCourseSession.class, courseSessionId);

        RDTestSession link = new RDTestSession();
        link.setTest(test);
        link.setCourseSession(cs);
        link.setRole(role);
        link.setUploadedBy(uploadedBy);
        link.setNotes(notes);
        link.setVisibility(visibility);

        s().persist(link);
        return true;
    }

    @Override
    public void unlinkSession(Integer testId, Integer courseSessionId) {
        s().createQuery(
                "delete from RDTestSession x where x.test.testId = :tid and x.courseSession.courseSessionId = :csid")
            .setParameter("tid", testId)
            .setParameter("csid", courseSessionId)
            .executeUpdate();
    }

    @Override
    public List<Integer> findLinkedSessionIds(Integer testId) {
        String hql =
            "select ts.courseSession.courseSessionId " +
            "from RDTestSession ts " +
            "where ts.test.testId = :tid";
        return s().createQuery(hql, Integer.class)
                  .setParameter("tid", testId)
                  .getResultList();
    }

    /* =========================================================
       ALLOWED COURSES BY ROLE
       ========================================================= */
    @Override
    public List<RDCourse> allowedCoursesForAdmin() {
        // admins see all
        return s().createQuery("from RDCourse c order by c.courseName asc", RDCourse.class)
                  .getResultList();
    }

    @Override
    public List<RDCourse> allowedCoursesForMentor(int mentorUserId) {
        // Option A: mentor ↔ course via RDMentorCourse
        String hql =
            "select distinct mc.course " +
            "from RDMentorCourse mc " +
            "where mc.mentor.userID = :mid " +
            "order by mc.course.courseName asc";
        return s().createQuery(hql, RDCourse.class)
                  .setParameter("mid", mentorUserId)
                  .getResultList();
    }

    @Override
    public List<RDCourse> allowedCoursesForParent(int parentUserId) {
        String hql =
            "select distinct co.course " +
            "from RDStudentEnrollment e " +
            "join e.parent p " +
            "join e.courseOffering co " +
            "where p.userID = :pid";
        return s().createQuery(hql, RDCourse.class)
                  .setParameter("pid", parentUserId)
                  .getResultList();
    }

    @Override
    public List<RDCourse> allowedCoursesForStudent(int studentUserId) {
        String hql =
            "select distinct co.course " +
            "from RDStudentEnrollment e " +
            "join e.courseOffering co " +
            "where e.student.userID = :sid";
        return s().createQuery(hql, RDCourse.class)
                  .setParameter("sid", studentUserId)
                  .getResultList();
    }

    /* =========================================================
       SESSION ITEMS for mapping UI
       ========================================================= */
    @Override
    public List<RDSessionItem> findCourseSessionsGeneric(Integer courseId, Integer offeringId, String sessionType) {
        if (courseId == null) return List.of();

        String hql =
            "from RDCourseSession cs " +
            "where cs.course.courseId = :cid " +
            "  and (:stype is null or cs.sessionType = :stype) " +
            "order by coalesce(cs.tierOrder, 9999), cs.courseSessionId";

        var q = s().createQuery(hql, RDCourseSession.class)
                   .setParameter("cid", courseId)
                   .setParameter("stype", (sessionType == null || sessionType.isBlank()) ? null : sessionType);

        List<RDCourseSession> rows = q.getResultList();
        List<RDSessionItem> out = new ArrayList<>(rows.size());
        for (RDCourseSession cs : rows) {
            out.add(new RDSessionItem(
                cs.getCourseSessionId(),
                cs.getSessionTitle(),
                cs.getTierOrder(),
                cs.getSessionType()
            ));
        }
        return out;
    }

    @Override
    public List<RDSessionItem> findCourseSessionsForParent(int parentUserId, Integer courseId, Integer offeringId, String sessionType) {
        // You can add a subquery to ensure the parent is actually related to this course; keeping it simple here.
        return findCourseSessionsGeneric(courseId, offeringId, sessionType);
    }
    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Long> countEnrollmentsForTests(List<Integer> testIds) {
        if (testIds == null || testIds.isEmpty()) return Collections.emptyMap();

        // Count all enrollments in offerings that belong to the SAME COURSE as the test
        String hql =
            "select t.testId, count(distinct se.enrollmentId) " +
            "from RDTest t " +
            "left join t.course c " +
            "left join RDCourseOffering off with off.course = c " +          // join via common parent: course
            "left join RDStudentEnrollment se with se.courseOffering = off " +// enrollments live on offerings
            "where t.testId in (:tids) " +
            "group by t.testId";

        List<Object[]> rows = s().createQuery(hql, Object[].class)
            .setParameterList("tids", testIds)
            .getResultList();

        Map<Integer, Long> out = new HashMap<>();
        for (Object[] r : rows) {
            Integer tid = (Integer) r[0];
            Long cnt = (Long) r[1];
            out.put(tid, cnt != null ? cnt : 0L);
        }
        // ensure zeros for tests with no offerings/enrollments
        for (Integer tid : testIds) out.putIfAbsent(tid, 0L);
        return out;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, List<RDTestEnrollSummaryDTO>> enrollmentsByTest(
            List<Integer> testIds, Integer offeringIdFilter, String gradeFilter, String studentQuery) {

        if (testIds == null || testIds.isEmpty()) return Collections.emptyMap();
        boolean hasQ = (studentQuery != null && !studentQuery.isBlank());

        String hql =
            "select new com.robodynamics.dto.RDTestEnrollSummaryDTO(" +
            "  t.testId, off.courseOfferingId, off.courseOfferingName, " +
            "  '', " + // grade placeholder; replace with c.grade or off.gradeLabel if you have it
            "  stu.userID, trim(concat(coalesce(stu.firstName,''),' ',coalesce(stu.lastName,''))), " +
            "  par.userID, trim(concat(coalesce(par.firstName,''),' ',coalesce(par.lastName,''))) " +
            ") " +
            "from com.robodynamics.model.RDTest t " +
            "left join t.course c, " +
            "     com.robodynamics.model.RDCourseOffering off, " +
            "     com.robodynamics.model.RDStudentEnrollment se " +
            "     join se.student stu " +
            "     left join se.parent par " +
            "where t.testId in (:tids) " +
            "  and off.course = c " +
            "  and se.courseOffering = off " +
            "  and (:offId is null or off.courseOfferingId = :offId) " +
            // optional grade filter only if you wire a real grade (c.grade or off.gradeLabel)
            // "  and (:grade is null or off.gradeLabel = :grade) " +
            "  and (:q is null or lower(stu.firstName) like :q or lower(stu.lastName) like :q " +
            "                 or lower(par.firstName) like :q or lower(par.lastName) like :q) " +
            "order by t.testId, off.courseOfferingName, stu.firstName";

        var q = s().createQuery(hql, RDTestEnrollSummaryDTO.class)
                   .setParameterList("tids", testIds)
                   .setParameter("offId", offeringIdFilter)
                   .setParameter("q", hasQ ? "%" + studentQuery.toLowerCase() + "%" : null);

        List<RDTestEnrollSummaryDTO> rows = q.getResultList();
        Map<Integer, List<RDTestEnrollSummaryDTO>> out = new LinkedHashMap<>();
        for (RDTestEnrollSummaryDTO d : rows) {
            out.computeIfAbsent(d.getTestId(), k -> new ArrayList<>()).add(d);
        }
        for (Integer tid : testIds) out.putIfAbsent(tid, out.getOrDefault(tid, Collections.emptyList()));
        return out;
    }



	 /** Admin-style list (since we don't receive user/role here) */
    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findForAdminOrMentorOrParent(String q, Integer courseId) {
        StringBuilder hql = new StringBuilder(
            "select distinct t " +
            "from RDTest t " +
            "left join fetch t.course c " +
            // If you want eager sessions for later use, uncomment:
            // "left join fetch t.testSessions ts " +
            "where 1=1 "
        );

        boolean hasQ = (q != null && !q.trim().isEmpty());
        if (hasQ) {
            hql.append("and ( lower(t.testTitle) like :q ")
               .append("or lower(c.courseName) like :q ) ");
        }
        if (courseId != null) {
            hql.append("and c.courseId = :cid ");
        }

        hql.append("order by t.testDate desc nulls last, t.testId desc");

        Query<RDTest> query = s().createQuery(hql.toString(), RDTest.class);

        if (hasQ) query.setParameter("q", "%" + q.trim().toLowerCase() + "%");
        if (courseId != null) query.setParameter("cid", courseId);

        // DISTINCT + FETCH can still duplicate; Hibernate de-duplicates entity results.
        return query.getResultList();
    }

    /** Mentor-visible tests: via a mentor→course mapping (Option A) OR via offerings->instructor (Option B) */
    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findForMentor(int mentorUserId, String q, Integer courseId) {
        // --- Option A: mentor ↔ course through mapping table RDMentorCourse(mc)
        StringBuilder hql = new StringBuilder(
            "select distinct t " +
            "from RDTest t " +
            "join t.course c " +
            "where c.courseId in (" +
            "  select mc.course.courseId from RDMentorCourse mc where mc.mentor.userID = :mid" +
            ") "
        );

        boolean hasQ = (q != null && !q.trim().isEmpty());
        if (hasQ) {
            hql.append("and ( lower(t.testTitle) like :q or lower(c.courseName) like :q ) ");
        }
        if (courseId != null) {
            hql.append("and c.courseId = :cid ");
        }
        hql.append("order by t.testDate desc nulls last, t.testId desc");

        Query<RDTest> query = s().createQuery(hql.toString(), RDTest.class)
                                 .setParameter("mid", mentorUserId);

        if (hasQ) query.setParameter("q", "%" + q.trim().toLowerCase() + "%");
        if (courseId != null) query.setParameter("cid", courseId);

        return query.getResultList();

        /* --- Option B (if you map tests to course sessions / offerings with instructor):
        String hqlB =
            "select distinct t " +
            "from RDTest t " +
            "join RDTestSession ts on ts.test = t " +
            "join ts.courseSession cs " +
            "join cs.courseOffering off " +
            "join off.instructor m " +
            "join t.course c " +
            "where m.userID = :mid " +
            (hasQ ? "and ( lower(t.testTitle) like :q or lower(c.courseName) like :q ) " : "") +
            (courseId != null ? "and c.courseId = :cid " : "") +
            "order by t.testDate desc nulls last, t.testId desc";
        */
    }

    /** Parent-visible tests: any test that maps to offerings where their children are enrolled */
    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findByParent(int parentUserId, Integer courseId, String q) {
        StringBuilder hql = new StringBuilder(
            "select distinct t " +
            "from RDTest t " +
            "join RDTestSession ts on ts.test = t " +
            "join ts.courseSession cs " +
            "join cs.courseOffering off " +
            "join RDStudentEnrollment se on se.courseOffering = off " +
            "join t.course c " +
            "where se.parent.userID = :pid "
        );

        boolean hasQ = (q != null && !q.trim().isEmpty());
        if (hasQ) {
            hql.append("and ( lower(t.testTitle) like :q or lower(c.courseName) like :q ) ");
        }
        if (courseId != null) {
            hql.append("and c.courseId = :cid ");
        }
        hql.append("order by t.testDate desc nulls last, t.testId desc");

        Query<RDTest> query = s().createQuery(hql.toString(), RDTest.class)
                                 .setParameter("pid", parentUserId);

        if (hasQ) query.setParameter("q", "%" + q.trim().toLowerCase() + "%");
        if (courseId != null) query.setParameter("cid", courseId);

        return query.getResultList();
    }
}

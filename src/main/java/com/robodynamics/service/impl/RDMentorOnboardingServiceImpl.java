package com.robodynamics.service.impl;

import com.robodynamics.dto.RDOnboardingStatus;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDMentorSkill;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDMentorOnboardingService;
import com.robodynamics.util.Pair;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class RDMentorOnboardingServiceImpl implements RDMentorOnboardingService {

    @Resource
    private SessionFactory sessionFactory;

    // --------------------------
    // Helpers
    // --------------------------

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    /** Load user or throw IllegalArgumentException */
    private RDUser loadUser(int userId) {
        RDUser u = s().get(RDUser.class, userId);
        if (u == null) throw new IllegalArgumentException("User not found: " + userId);
        return u;
    }

    /** Find mentor row by userId */
    private RDMentor findMentorByUserId(int userId) {
        String hql = "from RDMentor m where m.user.userID = :uid";
        return s().createQuery(hql, RDMentor.class)
                  .setParameter("uid", userId)
                  .uniqueResult();
    }

    /** Create mentor row if missing, return the entity (managed) */
    private RDMentor getOrCreateMentor(int userId, String displayNameFallback) {
        RDMentor m = findMentorByUserId(userId);
        if (m != null) return m;

        RDUser u = loadUser(userId);
        if (u == null) throw new IllegalArgumentException("User not found for ID " + userId);

        // ✅ Check if mentor already exists with same mobile (prevent duplicate constraint)
        String mobile = u.getCellPhone();
        if (mobile != null && !mobile.isBlank()) {
            Query<RDMentor> query = s().createQuery(
                "FROM RDMentor WHERE mobile = :mobile", RDMentor.class);
            query.setParameter("mobile", mobile);
            List<RDMentor> existingMentors = query.getResultList();
            if (!existingMentors.isEmpty()) {
                return existingMentors.get(0); // Return existing mentor instead of inserting
            }
        }

        // 🆕 Create new mentor record
        m = new RDMentor();
        m.setUser(u);

        // Use provided display name if present, else fallback
        String dn = (displayNameFallback != null && !displayNameFallback.isBlank())
                ? displayNameFallback
                : (u.getFirstName() != null
                    ? (u.getFirstName() + (u.getLastName() == null ? "" : (" " + u.getLastName())))
                    : "Mentor " + userId);

        m.setFullName(dn);
        m.setEmail(u.getEmail());
        m.setMobile(mobile);
        m.setIsActive(1);
        m.setIsVerified(true);

        s().save(m);
        return m;
    }

    private static String safeCsv(String s) {
        return (s == null) ? "" : s.trim();
    }

    private static Integer nz(Integer v) { return v == null ? null : v; }

    // --------------------------
    // Interface methods
    // --------------------------

    @Override
    @Transactional(readOnly = true)
    public RDOnboardingStatus getStatus(int userId) {
        RDOnboardingStatus status = new RDOnboardingStatus();

        RDUser user = loadUser(userId);
        RDMentor mentor = findMentorByUserId(userId);

        boolean hasConsent = Boolean.TRUE.equals(user.getProfilePublishAllowed()); // using RDUser flag as consent
        boolean hasProfile = (mentor != null) && (mentor.getFullName() != null && !mentor.getFullName().isBlank());
        boolean hasSkills  = false;

        if (mentor != null) {
            Long cnt = s().createQuery(
                    "select count(ms) from RDMentorSkill ms where ms.mentorId = :mid", Long.class)
                    .setParameter("mid", mentor.getMentorId())
                    .uniqueResult();
            hasSkills = (cnt != null && cnt > 0);
        }

        status.setHasConsent(hasConsent);
        status.setHasProfile(hasProfile);
        status.setHasSkills(hasSkills);
        return status;
    }

    @Override
    @Transactional(readOnly = true)
    public RDMentor getMentorByUserId(int userId) {
        return findMentorByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorSkill> getSkills(int userId) {
        RDMentor mentor = findMentorByUserId(userId);
        if (mentor == null) return List.of();
        String hql = "from RDMentorSkill ms where ms.mentorId = :mid order by ms.skillLabel asc";
        return s().createQuery(hql, RDMentorSkill.class)
                  .setParameter("mid", mentor.getMentorId())
                  .getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public Pair<String, Boolean> getCurrentResumeMeta(int userId) {
        // If your RDMentor has fields like resumeFileName / resumePublic, return them here.
        RDMentor m = findMentorByUserId(userId);
        if (m == null) return null;

        // Try to reflect commonly used fields; if your model differs, tweak below.
        try {
            var fn = (String) RDMentor.class.getMethod("getResumeFileName").invoke(m);
            var pub = (Boolean) RDMentor.class.getMethod("getResumePublic").invoke(m);
            return (fn == null) ? null : Pair.of(fn, Boolean.TRUE.equals(pub));
        } catch (Exception ignore) {
            // Model may not have resume fields — just return null gracefully.
            return null;
        }
    }

    @Override
    public void recordConsent(int userId, String consentText, String ip, String userAgent) {
        // Minimal: flip the RDUser.profilePublishAllowed flag (your controller relies on it)
        RDUser u = loadUser(userId);
        u.setProfilePublishAllowed(true);
        s().update(u);

        // If you have a dedicated consent table, insert there too (pseudo-code):
        // RDMentorConsent c = new RDMentorConsent(...);
        // s().save(c);
    }

    @Override
    public void saveProfile(int userId,
                            String displayName, String headline, String bio,
                            BigDecimal yearsExperience, Integer hourlyRateInr,
                            String city, String area, String teachingModes,
                            MultipartFile resume, boolean resumePublic) {

        RDMentor m = getOrCreateMentor(userId, displayName);

        if (displayName != null && !displayName.isBlank()) m.setFullName(displayName.trim());
       // if (headline != null)  m.set.setHeadline(headline.trim());
        if (bio != null)       m.setBio(bio.trim());
        if (yearsExperience != null) m.setExperienceYears(yearsExperience.intValue());
      //  if (hourlyRateInr != null)   m.setHourlyRateInr(hourlyRateInr);
        if (city != null)      m.setCity(city.trim());
       // if (area != null)      m.setArea(area.trim());
        if (teachingModes != null) m.setModes(safeCsv(teachingModes)); // CSV like "ONLINE,OFFLINE"

        // Optional: persist resume to disk and store metadata if your model has fields.
        if (resume != null && !resume.isEmpty()) {
            try {
                Path root = Path.of(System.getProperty("user.home"), "robodynamics_uploads", "mentors", String.valueOf(userId));
                Files.createDirectories(root);
                String cleanName = Objects.requireNonNull(resume.getOriginalFilename()).replaceAll("[^A-Za-z0-9._-]", "_");
                Path dest = root.resolve(cleanName);
                Files.copy(resume.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

                try {
                    // These getters/setters may exist in your model; if not, ignore.
                    RDMentor.class.getMethod("setResumeFileName", String.class).invoke(m, cleanName);
                    RDMentor.class.getMethod("setResumePublic", Boolean.TYPE).invoke(m, resumePublic);
                } catch (Exception ignore) {
                    // Model does not have resume fields; file is still saved for later wiring.
                }
            } catch (Exception ioe) {
                throw new RuntimeException("Failed to save resume", ioe);
            }
        }

        s().update(m);
    }

    @Override
    public void replaceSkills(int userId,
                              List<String> subjectCodes,
                              List<Integer> gradeMins,
                              List<Integer> gradeMaxs,
                              List<String> boards) {

        if (subjectCodes == null || subjectCodes.isEmpty()) {
            // Clearing skills is still allowed — we’ll delete existing.
        }

        RDMentor mentor = getOrCreateMentor(userId, null);

        // Delete existing skills (clean replace)
        s().createQuery("delete from RDMentorSkill ms where ms.mentorId = :mid")
          .setParameter("mid", mentor.getMentorId())
          .executeUpdate();

        if (subjectCodes == null || subjectCodes.isEmpty()) return;

        // Defensive sizing
        int n = subjectCodes.size();
        List<RDMentorSkill> toInsert = new ArrayList<>(n);

        for (int i = 0; i < n; i++) {
            String code = subjectCodes.get(i);
            Integer gmin = (gradeMins != null && i < gradeMins.size()) ? gradeMins.get(i) : null;
            Integer gmax = (gradeMaxs != null && i < gradeMaxs.size()) ? gradeMaxs.get(i) : null;
            String boardRaw = (boards != null && i < boards.size()) ? boards.get(i) : null;

            if (code == null || code.isBlank()) continue;

            RDMentorSkill ms = new RDMentorSkill();
            ms.setMentorId(mentor.getMentorId());

            // Normalize code/label
            String normCode = code.trim().toUpperCase();     // e.g., "MATH"
            String label    = resolveSkillLabel(normCode); // "Maths" / "Science" / ...

            ms.setSkillCode(normCode);
            ms.setSkillLabel(label);
            ms.setGradeMax(gmax);
            ms.setGradeMin(gmin);
            ms.setSyllabusBoard(boardRaw);
            

            

            // level (default beginner) — set if your entity has it
            try { RDMentorSkill.class.getMethod("setSkillLevel", String.class).invoke(ms, "beginner"); } catch (Exception ignore) {}

            toInsert.add(ms);
        }

        for (RDMentorSkill ms : toInsert) {
            s().save(ms);
        }
    }

    @Override
    public void ensureMentorProfile(int userId, String displayName) {
        getOrCreateMentor(userId, displayName);
    }

    // --------------------------
    // Tiny utilities
    // --------------------------

    private String resolveSkillLabel(String skillCode) {
        String hql = """
            select distinct ms.skillLabel
            from RDMentorSkill ms
            where upper(ms.skillCode) = :code
        """;

        String label = s().createQuery(hql, String.class)
                .setParameter("code", skillCode.toUpperCase())
                .setMaxResults(1)
                .uniqueResult();

        // fallback only if DB empty (rare)
        return label != null ? label : skillCode;
    }

	@Override
	public List<String> getDistinctSkillLabels() {
		
		String hql = """
		        select distinct ms.skillLabel
		        from RDMentorSkill ms
		        where ms.skillLabel is not null
		        order by ms.skillLabel
		    """;

		    return s()
		            .createQuery(hql, String.class)
		            .getResultList();
		}

}

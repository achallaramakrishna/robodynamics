package com.robodynamics.service.impl;

import com.robodynamics.dao.*;
import com.robodynamics.dto.RDOnboardingStatus;
import com.robodynamics.model.*;
import com.robodynamics.model.RDMentorSkill.SyllabusBoard;
import com.robodynamics.model.RDUserDocument.DocType;
import com.robodynamics.service.RDMentorOnboardingService;
import com.robodynamics.util.Pair;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class RDMentorOnboardingServiceImpl implements RDMentorOnboardingService {

	@Resource
	private RDUserDao userDao;
	@Resource
	private RDMentorDao mentorDao;
	@Resource
	private RDMentorSkillDao skillDao;
	@Resource
	private RDUserDocumentDao docDao;
	@Resource
	private RDUserConsentDao consentDao;

	@Value("${rd.upload.root:/var/robodynamics/uploads}")
	private String uploadRoot;

	// ---------------- status & getters ----------------

	@Override
	public RDOnboardingStatus getStatus(int userId) {
		RDUser user = userDao.getRDUser(userId);
		RDMentor mentor = mentorDao.findByUserId(userId);
		List<RDMentorSkill> skills = mentor != null ? skillDao.findByMentorId(mentor.getMentorId()) : List.of();

		RDOnboardingStatus s = new RDOnboardingStatus();
		s.setHasConsent(user != null && Boolean.TRUE.equals(user.getProfilePublishAllowed()));
		s.setHasProfile(mentor != null && mentor.getDisplayName() != null && !mentor.getDisplayName().isBlank());
		s.setHasSkills(!skills.isEmpty());
		return s;
	}

	@Override
	public RDMentor getMentorByUserId(int userId) {
		return mentorDao.findByUserId(userId);
	}

	@Override
	public List<RDMentorSkill> getSkills(int userId) {
		RDMentor m = mentorDao.findByUserId(userId);
		if (m == null)
			return List.of();
		return skillDao.findByMentorId(m.getMentorId());
	}

	@Override
	public Pair<String, Boolean> getCurrentResumeMeta(int userId) {
		RDUserDocument d = docDao.findLatestResume(userId);
		if (d == null)
			return null;
		return Pair.of(d.getFileName(), Boolean.TRUE.equals(d.getIsPublic()));
	}

	// ---------------- actions ----------------

	@Override
	public void recordConsent(int userId, String consentText, String ip, String userAgent) {
		RDUser u = userDao.getRDUser(userId);
		if (u == null)
			throw new IllegalArgumentException("User not found");

		RDUserConsent c = new RDUserConsent();
		c.setUser(u);
		c.setConsentType(RDUserConsent.Type.PROFILE_PUBLISH);
		c.setConsentText(consentText);
		c.setAgreed(true);
		c.setAgreedAt(LocalDateTime.now());
		c.setAgreedIp(ip);
		c.setUserAgent(userAgent);
		consentDao.save(c);

		// fast flag for runtime checks
		u.setProfilePublishAllowed(true);
		userDao.update(u);
	}

	@Override
	public void saveProfile(int userId, String displayName, String headline, String bio, BigDecimal yearsExperience,
			Integer hourlyRateInr, String city, String area, String teachingModes, MultipartFile resume,
			boolean resumePublic) {

		if (displayName == null || displayName.isBlank())
			throw new IllegalArgumentException("Display name is required");

		RDUser u = userDao.getRDUser(userId);
		if (u == null)
			throw new IllegalArgumentException("User not found");

		// upsert mentor
		RDMentor m = mentorDao.findByUserId(userId);
		if (m == null) {
			m = new RDMentor();
			m.setUser(u);
			mentorDao.save(m);
		}

		m.setDisplayName(displayName.trim());
		m.setHeadline(nullSafeTrim(headline));
		m.setBio(nullSafeTrim(bio));
		m.setYearsExperience(yearsExperience);
		m.setHourlyRateInr(hourlyRateInr);
		m.setCity(nullSafeTrim(city));
		m.setArea(nullSafeTrim(area));
		m.setTeachingModes(nullSafeTrim(teachingModes));

		mentorDao.update(m);

		// optional resume upload
		if (resume != null && !resume.isEmpty()) {
			RDUserDocument doc = storeResume(userId, resume, resumePublic);
			// nothing else to do; controller reads latest meta via DAO
		}
	}

	@Override
	public void replaceSkills(int userId, List<String> subjectCodes, List<Integer> gradeMins, List<Integer> gradeMaxs,
			List<String> boards) {

		if (subjectCodes == null || gradeMins == null || gradeMaxs == null || boards == null)
			throw new IllegalArgumentException("Skills payload missing");

		if (!(subjectCodes.size() == gradeMins.size() && gradeMins.size() == gradeMaxs.size()
				&& gradeMaxs.size() == boards.size()))
			throw new IllegalArgumentException("Skills arrays must be same length");

		RDMentor m = mentorDao.findByUserId(userId);
		if (m == null)
			throw new IllegalStateException("Save profile first");

		// wipe + insert (simple MVP)
		skillDao.deleteAllForMentor(m.getMentorId());

		List<RDMentorSkill> rows = new ArrayList<>();
		for (int i = 0; i < subjectCodes.size(); i++) {
			String sub = nullSafeTrim(subjectCodes.get(i));
			if (sub == null || sub.isBlank())
				continue;

			Integer gmin = gradeMins.get(i);
			Integer gmax = gradeMaxs.get(i);
			if (gmin == null || gmax == null)
				continue;
			if (gmin < 1 || gmax > 12 || gmin > gmax)
				continue;

			String b = nullSafeTrim(boards.get(i));
			SyllabusBoard boardEnum = parseBoard(b);

			RDMentorSkill s = new RDMentorSkill();
			s.setMentor(m);
			s.setSubjectCode(sub);
			s.setGradeMin(gmin);
			s.setGradeMax(gmax);
			s.setSyllabusBoard(boardEnum);
			rows.add(s);
		}

		if (!rows.isEmpty())
			skillDao.saveAll(rows);
	}

	// ---------------- helpers ----------------

	private String nullSafeTrim(String s) {
		return s == null ? null : s.trim();
	}

	private SyllabusBoard parseBoard(String b) {
		if (b == null)
			return SyllabusBoard.CBSE;
		try {
			return SyllabusBoard.valueOf(b);
		} catch (IllegalArgumentException e) {
			return SyllabusBoard.OTHER;
		}
	}

	private RDUserDocument storeResume(int userId, MultipartFile file, boolean makePublic) {
		// basic validation
		String ct = file.getContentType();
		String name = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume";
		long size = file.getSize();

		if (size <= 0)
			throw new IllegalArgumentException("Empty file");
		if (size > 10 * 1024 * 1024)
			throw new IllegalArgumentException("Max 10 MB allowed");

		boolean okType = ct != null && (ct.equals("application/pdf") || ct.equals("application/msword")
				|| ct.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
		if (!okType)
			throw new IllegalArgumentException("Only PDF/DOC/DOCX supported");

		// ensure dir
		File userDir = new File(uploadRoot, "users/" + userId);
		if (!userDir.exists() && !userDir.mkdirs())
			throw new RuntimeException("Upload dir not writable");

		String safe = System.currentTimeMillis() + "_" + name.replaceAll("[^a-zA-Z0-9._-]", "_");
		File dest = new File(userDir, safe);
		try {
			file.transferTo(dest);
		} catch (IOException e) {
			throw new RuntimeException("Failed to save file", e);
		}

		// store row
		RDUser u = userDao.getRDUser(userId);
		RDUserDocument d = new RDUserDocument();
		d.setUser(u);
		d.setDocType(DocType.RESUME);
		d.setFileName(name);
		d.setStoragePath(dest.getAbsolutePath()); // or S3 URL if you switch later
		d.setMimeType(ct);
		d.setFileSize((int) size);
		d.setIsPublic(makePublic); // Only resume can be public in this flow
		docDao.save(d);
		return d;
	}

	 public void ensureMentorProfile(int userID, String displayName) {
	        // 1) Already exists? update minimal fields & return
	        RDMentor existing = mentorDao.findByUserId(userID);
	        if (existing != null) {
	            // Fill display name if missing
	            if ((existing.getDisplayName() == null || existing.getDisplayName().isBlank())
	                    && displayName != null && !displayName.isBlank()) {
	                existing.setDisplayName(displayName.trim());
	            }
	            // Make sure it’s active (don’t override verified)
	            try {
	            	
	                if (!existing.isActive()) {
	                    existing.setActive(true);
	                }
	            } catch (NoSuchMethodError ignored) {
	                // if your getter is getActive()/setActive(boolean)
	                // existing.setActive(true);
	            }
	            mentorDao.save(existing);
	            return;
	        }

	        // 2) Create a minimal mentor profile
	        RDMentor m = new RDMentor();

	        // Associate by reference (no cascade persist expected for ManyToOne/OneToOne)
	        RDUser uRef = new RDUser();
	        uRef.setUserID(userID);
	        m.setUser(uRef);

	        String dn = (displayName == null ? "" : displayName.trim());
	        if (dn.isEmpty()) {
	            dn = ("Mentor " + userID);
	        }
	        m.setDisplayName(dn);

	        // Defaults
	        try {
	        	m.setActive(true);
	        } catch (NoSuchMethodError ignored) { /* see note above */ }
	        try {
	            m.setVerified(false);
	        } catch (NoSuchMethodError ignored) { /* if field is int, set 0 */ }

	        // 3) Save, handling concurrent first-creation races by unique(user_id)
	        try {
	            mentorDao.save(m);
	        } catch (org.hibernate.exception.ConstraintViolationException e) {
	            // somebody else created it in parallel; just ignore and return
	        } catch (javax.persistence.PersistenceException pe) {
	            // unwrap CVE if any
	           throw pe;
	        }
	 }
}

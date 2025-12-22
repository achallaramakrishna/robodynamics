package com.robodynamics.service;

import com.robodynamics.dto.RDOnboardingStatus;
import com.robodynamics.model.*;
import com.robodynamics.util.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface RDMentorOnboardingService {

	// status + prefills
	RDOnboardingStatus getStatus(int userId);

	RDMentor getMentorByUserId(int userId);

	List<RDMentorSkill> getSkills(int userId);

	Pair<String, Boolean> getCurrentResumeMeta(int userId); // fileName, isPublic

	// actions
	void recordConsent(int userId, String consentText, String ip, String userAgent);

	void saveProfile(int userId, String displayName, String headline, String bio, BigDecimal yearsExperience,
			Integer hourlyRateInr, String city, String area, String teachingModes, MultipartFile resume,
			boolean resumePublic);

	void replaceSkills(int userId, List<String> subjectCodes, List<Integer> gradeMins, List<Integer> gradeMaxs,
			List<String> boards);

	void ensureMentorProfile(int userID, String displayName);

	List<String> getDistinctSkillLabels();
}

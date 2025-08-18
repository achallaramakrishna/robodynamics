package com.robodynamics.service;

import org.springframework.web.multipart.MultipartFile;

public interface RDFileStorage {

    /** Store a school-sent schedule PDF for a test and return a relative path like: tests/{testId}/schedule-<ts>_file.pdf */
    String storeTestSchedulePdf(Integer testId, MultipartFile file);

    /** Store an attempt attachment and return a relative path like: tests/{testId}/attempts/{enrollmentId}/<ts>_file.ext */
    String storeTestAttemptAttachment(Integer testId, Integer enrollmentId, MultipartFile file);

    /** Store any course-session detail file (e.g., resources) and return a relative path like: details/{detailId}/<ts>_file.ext */
    static String storeDetailFile(Integer detailId, MultipartFile file) {
		// TODO Auto-generated method stub
		return null;
	}

    /** Delete a previously stored relative path under the uploads root (no-op if missing). */
    void deleteIfExists(String relativePath);
}

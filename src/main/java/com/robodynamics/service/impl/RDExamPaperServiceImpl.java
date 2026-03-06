package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDExamAnswerKeyDao;
import com.robodynamics.dao.RDExamPaperDAO;
import com.robodynamics.dao.RDExamSectionDAO;
import com.robodynamics.dao.RDExamSectionQuestionDAO;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.dto.RDExamPaperUploadDTO;
import com.robodynamics.dto.RDQuizOptionDTO;
import com.robodynamics.dto.RDQuizQuestionDTO;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDExamAnswerKey;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDExamPaperService;
import com.robodynamics.service.RDQuizOptionService;

@Service
@Transactional
public class RDExamPaperServiceImpl implements RDExamPaperService {

    @Autowired private RDExamPaperDAO examPaperDAO;
    @Autowired private RDExamSectionDAO examSectionDAO;
    @Autowired private RDExamSectionQuestionDAO sectionQuestionDAO;
    @Autowired private RDExamAnswerKeyDao examAnswerKeyDAO;
    @Autowired private RDQuizQuestionDao quizQuestionDao;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private RDQuizOptionService quizOptionService;

    /* =========================================================
       UPSERT WITH VERSION SAFETY
       ========================================================= */
    @Override
    public void upsertExamPaperFromJson(RDExamPaperUploadDTO uploadDTO,
                                        Integer courseSessionId,
                                        Integer courseSessionDetailId,
                                        RDUser user) throws JsonProcessingException {

        RDCourseSessionDetail sessionDetail =
                courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

        if (sessionDetail == null) {
            throw new IllegalArgumentException("Invalid Course Session Detail ID: " + courseSessionDetailId);
        }

        RDExamPaper existingPaper = examPaperDAO.findBySessionDetail(courseSessionDetailId);
        boolean newVersionRequired = isNewVersion(courseSessionDetailId);

        RDExamPaper paper;

        if (existingPaper == null || newVersionRequired) {
            // ✅ Create NEW paper (new version)
            paper = new RDExamPaper();
            paper.setCourseSessionDetail(sessionDetail);
            paper.setCreatedAt(LocalDateTime.now());
            paper.setIsActive(1);
            paper.setStatus(RDExamPaper.ExamStatus.DRAFT);
            paper.setVersion(existingPaper == null ? 1 : (existingPaper.getVersion() == null ? 2 : existingPaper.getVersion() + 1));

            // IMPORTANT: ensure sections collection exists
            if (paper.getSections() == null) {
                paper.setSections(new LinkedHashSet<>());
            }

        } else {
            // ✅ Update existing paper ONLY if no submissions exist
            paper = existingPaper;

            // IMPORTANT: do not replace collections; clear them
            if (paper.getSections() != null) {
                paper.getSections().clear();
            } else {
                paper.setSections(new LinkedHashSet<>());
            }

            // Safe only because no submissions -> allow key delete
            examAnswerKeyDAO.deleteByExamPaperId(paper.getExamPaperId());
        }

        /* -------- Paper fields -------- */
        paper.setTitle(uploadDTO.getTitle());
        paper.setSubject(uploadDTO.getSubject());
        paper.setBoard(uploadDTO.getBoard());
        paper.setExamYear(uploadDTO.getExamYear());
        paper.setExamType(uploadDTO.getExamType());
        paper.setPatternCode(uploadDTO.getPatternCode());
        paper.setDurationMinutes(uploadDTO.getDurationMinutes());
        paper.setTotalMarks(uploadDTO.getTotalMarks());
        paper.setInstructions(uploadDTO.getInstructions());
        paper.setNegativeMarking(Boolean.TRUE.equals(uploadDTO.getNegativeMarking()));
        paper.setNegativeMarkValue(uploadDTO.getNegativeMarkValue() != null ? uploadDTO.getNegativeMarkValue() : 0.0);
        paper.setShuffleQuestions(Boolean.TRUE.equals(uploadDTO.getShuffleQuestions()));
        paper.setShuffleSections(Boolean.TRUE.equals(uploadDTO.getShuffleSections()));

        // ✅ Make paper managed
        paper = examPaperDAO.merge(paper);

        /* =========================================================
           Build new sections/questions without breaking orphanRemoval
           ========================================================= */

        for (RDExamPaperUploadDTO.SectionDTO sDto : uploadDTO.getSections()) {

            RDExamSection section = new RDExamSection();
            section.setExamPaper(paper);
            section.setSectionName(sDto.getSectionName());
            section.setTitle(sDto.getTitle());
            section.setDescription(sDto.getDescription());
            section.setInstructions(sDto.getInstructions());
            section.setAttemptType(RDExamSection.AttemptType.valueOf(sDto.getAttemptType()));
            section.setAttemptCount(sDto.getAttemptCount());
            section.setTotalMarks(sDto.getTotalMarks());
            section.setSectionOrder(sDto.getSectionOrder());
            section.setCompulsory(sDto.getCompulsory() != null ? sDto.getCompulsory() : true);
            section.setShuffleQuestions(Boolean.TRUE.equals(sDto.getShuffleQuestions()));

            // ✅ Ensure questions collection exists (DO NOT replace later)
            if (section.getQuestions() == null) {
                section.setQuestions(new LinkedHashSet<>());
            } else {
                section.getQuestions().clear();
            }

            // Persist section
            examSectionDAO.saveOrUpdate(section);

            for (RDExamPaperUploadDTO.SectionQuestionDTO qDto : sDto.getQuestions()) {

                RDQuizQuestionDTO qq = qDto.getQuestion();

                // Create Quiz Question
                RDQuizQuestion quizQ = new RDQuizQuestion();
                quizQ.setQuestionText(qq.getQuestionText());
                quizQ.setQuestionType(qq.getQuestionType());
                quizQ.setDifficultyLevel(mapDifficultyLevel(qq.getDifficultyLevel()));
                quizQ.setMaxMarks(qDto.getMarks());
                quizQ.setCourseSessionDetail(sessionDetail);
                quizQ.setQuestionImage(trimToNull(qq.getQuestionImage()));
                quizQ.setCorrectAnswer(trimToNull(qq.getCorrectAnswer()));
                quizQ.setAdditionalInfo(trimToNull(qq.getAdditionalInfo()));
                quizQ.setExplanation(trimToNull(qq.getExplanation()));
                quizQ.setPoints(qq.getPoints() > 0 ? qq.getPoints() : qDto.getMarks());
                quizQ.setExamType(trimToNull(qq.getExamType()));
                quizQ.setSyllabusTag(trimToNull(qq.getSyllabusTag()));
                quizQ.setExamYear(qq.getExamYear());
                quizQ.setExamPaper(trimToNull(qq.getExamPaper()));
                quizQ.setIsPYQ(qq.getIsPYQ());
                quizQ.setTierLevel(mapTierLevel(qq.getTierLevel()));
                if (qq.getTierOrder() > 0) {
                    quizQ.setTierOrder(qq.getTierOrder());
                }
                quizQuestionDao.saveOrUpdate(quizQ);
                

                // Save options
                if ("multiple_choice".equalsIgnoreCase(quizQ.getQuestionType())
                        && qq.getOptions() != null) {

                    for (RDQuizOptionDTO optionDTO : qq.getOptions()) {
                        RDQuizOption option = new RDQuizOption();
                        option.setOptionText(optionDTO.getOptionText());
                        option.setOptionImage(trimToNull(optionDTO.getOptionImage()));
                        option.setCorrect(optionDTO.isCorrect());
                        option.setQuestion(quizQ);
                        quizOptionService.save(option);
                    }
                }

                // Create Section Question mapping
                RDExamSectionQuestion sq = new RDExamSectionQuestion();
                sq.setSection(section);
                sq.setQuestion(quizQ);
                sq.setMarks(qDto.getMarks());
                sq.setNegativeMarks(qDto.getNegativeMarks() != null ? qDto.getNegativeMarks() : 0.0);
                sq.setDisplayOrder(qDto.getDisplayOrder());
                sq.setMandatory(qDto.getMandatory() != null ? qDto.getMandatory() : true);
                section.setCompulsory(sDto.getCompulsory() != null ? sDto.getCompulsory() : true);

                sq.setSubLabel(qDto.getSubLabel());
                sq.setParentQuestionId(qDto.getParentQuestionId());
                sq.setInternalChoiceGroup(qDto.getInternalChoiceGroup());
                sq.setMaxWordLimit(qDto.getMaxWordLimit());

                sectionQuestionDAO.saveOrUpdate(sq);

                // ✅ CRITICAL: add to existing collection (do NOT setQuestions(newSet))
                section.getQuestions().add(sq);

                // Answer Key (link to THIS NEW sq)
                if (qDto.getAnswerKey() != null) {

                    RDExamAnswerKey key = new RDExamAnswerKey();
                    key.setExamPaper(paper);
                    key.setSectionQuestion(sq); // ✅ correct current SQ
                    key.setQuestion(quizQ);
                    key.setModelAnswer(qDto.getAnswerKey().getModelAnswer());
                    key.setMaxMarks(BigDecimal.valueOf(qDto.getMarks()));

                    if (qDto.getAnswerKey().getKeyPoints() != null) {
                        key.setKeyPoints(objectMapper.writeValueAsString(qDto.getAnswerKey().getKeyPoints()));
                    }
                    if (qDto.getAnswerKey().getExpectedKeywords() != null) {
                        key.setExpectedKeywords(objectMapper.writeValueAsString(qDto.getAnswerKey().getExpectedKeywords()));
                    }

                    examAnswerKeyDAO.saveOrUpdate(key);
                }
            }

            // ✅ Attach section to paper via same collection reference
            paper.getSections().add(section);
        }

        // Attach paper to session detail
        sessionDetail.setExamPaper(paper);
        sessionDetail.setType("exampaper");
        sessionDetail.setTopic(paper.getTitle());
        courseSessionDetailService.saveRDCourseSessionDetail(sessionDetail);
        
        int expected = uploadDTO.getSections().stream()
                .mapToInt(s -> s.getQuestions() == null ? 0 : s.getQuestions().size())
                .sum();

        int persisted = paper.getSections().stream()
                .mapToInt(s -> s.getQuestions() == null ? 0 : s.getQuestions().size())
                .sum();

        System.out.println("✅ ExamPaper Persist Check | expectedQuestions=" + expected + " | persistedQuestions=" + persisted);

        if (expected != persisted) {
            throw new IllegalStateException(
                "Exam paper persist mismatch. expected=" + expected + " persisted=" + persisted
            );
        }

    }

    /* =========================================================
       VERSION DECISION
       ========================================================= */
    private boolean isNewVersion(Integer courseSessionDetailId) {
        RDExamPaper paper = examPaperDAO.findBySessionDetail(courseSessionDetailId);
        return paper != null && examPaperDAO.hasSubmissions(paper.getExamPaperId());
    }

    private RDQuizQuestion.DifficultyLevel mapDifficultyLevel(String level) {
        if (level == null || level.isBlank()) return RDQuizQuestion.DifficultyLevel.Medium;
        switch (level.trim().toLowerCase()) {
            case "easy": return RDQuizQuestion.DifficultyLevel.Easy;
            case "medium": return RDQuizQuestion.DifficultyLevel.Medium;
            case "hard": return RDQuizQuestion.DifficultyLevel.Hard;
            case "expert": return RDQuizQuestion.DifficultyLevel.Expert;
            case "master": return RDQuizQuestion.DifficultyLevel.Master;
            default: throw new IllegalArgumentException("Invalid difficulty: " + level);
        }
    }

    private RDQuizQuestion.TierLevel mapTierLevel(String tierLevel) {
        if (tierLevel == null || tierLevel.isBlank()) {
            return null;
        }
        try {
            return RDQuizQuestion.TierLevel.valueOf(tierLevel.trim().toUpperCase(Locale.ENGLISH));
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /* =========================================================
       Delegations
       ========================================================= */
    @Override
    public void createExamPaperFromJson(RDExamPaperUploadDTO dto,
                                        Integer courseSessionId,
                                        Integer courseSessionDetailId,
                                        RDUser createdBy) throws JsonProcessingException {
        upsertExamPaperFromJson(dto, courseSessionId, courseSessionDetailId, createdBy);
    }

    @Override
    public RDExamPaper getExamPapersBySessionDetail(Integer sessionDetailId) {
        return examPaperDAO.findBySessionDetail(sessionDetailId);
    }

    @Override
    public RDExamPaper getExamPaperWithDetails(Integer examPaperId) {
        return examPaperDAO.getExamPaperWithDetails(examPaperId);
    }

    @Override
    public void deleteExamPaper(Integer examPaperId) {
        examPaperDAO.delete(examPaperId);
    }

    @Override
    public List<RDExamPaper> getAllExamPapers() {
        return examPaperDAO.findAll();
    }

    @Override
    public List<RDExamAnswerKey> getAnswerKeysByExamPaper(Integer examPaperId) {
        return examPaperDAO.getAnswerKeysByExamPaper(examPaperId);
    }

    @Override
    public List<RDExamPaper> getExamPapersBySession(Integer sessionId) {
        return examPaperDAO.getExamPapersBySession(sessionId);
    }

    @Override
    public RDExamSectionQuestion getSectionQuestionById(Integer sectionQuestionId) {
        return examPaperDAO.getSectionQuestionById(sectionQuestionId);
    }
}

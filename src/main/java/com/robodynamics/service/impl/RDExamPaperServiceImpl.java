package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDExamAnswerKeyDao;
import com.robodynamics.dao.RDExamPaperDAO;
import com.robodynamics.dao.RDExamSectionDAO;
import com.robodynamics.dao.RDExamSectionQuestionDAO;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDExamAnswerKey;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExamPaperService;
import com.robodynamics.dto.RDExamPaperUploadDTO;
import com.robodynamics.dto.RDQuizQuestionDTO;

@Service
@Transactional
public class RDExamPaperServiceImpl implements RDExamPaperService {

    @Autowired private RDExamPaperDAO examPaperDAO;
    @Autowired private RDExamSectionDAO examSectionDAO;
    @Autowired private RDExamSectionQuestionDAO sectionQuestionDAO;
    
    @Autowired
    private ObjectMapper objectMapper;

    
    @Autowired private RDExamAnswerKeyDao examAnswerKeyDAO;

    
    @Autowired private RDQuizQuestionDao quizQuestionDao;

    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    
    private RDQuizQuestion.DifficultyLevel mapDifficultyLevel(String level) {

        if (level == null || level.isBlank()) {
            return RDQuizQuestion.DifficultyLevel.Medium; // sensible default
        }

        switch (level.trim().toLowerCase()) {

            case "easy":
                return RDQuizQuestion.DifficultyLevel.Easy;

            case "medium":
                return RDQuizQuestion.DifficultyLevel.Medium;

            case "hard":
                return RDQuizQuestion.DifficultyLevel.Hard;

            case "expert":
                return RDQuizQuestion.DifficultyLevel.Expert;

            case "master":
                return RDQuizQuestion.DifficultyLevel.Master;

            default:
                throw new IllegalArgumentException(
                    "Invalid difficulty level: " + level +
                    " (Allowed: Easy, Medium, Hard, Expert, Master)"
                );
        }
    }


    /* ========================================================= */
    /* CREATE EXAM PAPER FROM JSON                               */
    /* ========================================================= */
   
    @Override
    @Transactional
    public void createExamPaperFromJson(
            RDExamPaperUploadDTO uploadDTO,
            Integer courseSessionId,
            Integer courseSessionDetailId,
            RDUser createdBy) {

        System.out.println("[STEP 1] Upload started");

        /* =====================================================
           1. Validate anchor
           ===================================================== */
        RDCourseSessionDetail sessionDetail =
                courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

        if (sessionDetail == null) {
            throw new IllegalArgumentException("Invalid Course Session Detail ID");
        }

        System.out.println("[STEP 2] Session detail validated");

        /* =====================================================
           2. Create Exam Paper (TRANSIENT)
           ===================================================== */
        RDExamPaper paper = new RDExamPaper();
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
        paper.setNegativeMarkValue(
                uploadDTO.getNegativeMarkValue() != null ? uploadDTO.getNegativeMarkValue() : 0.0);

        paper.setShuffleQuestions(Boolean.TRUE.equals(uploadDTO.getShuffleQuestions()));
        paper.setShuffleSections(Boolean.TRUE.equals(uploadDTO.getShuffleSections()));

        paper.setStatus(RDExamPaper.ExamStatus.DRAFT);
        paper.setIsActive(1);
        paper.setCreatedAt(LocalDateTime.now());
        paper.setCourseSessionDetail(sessionDetail);

        System.out.println("[STEP 3] Exam paper object created");

        /* =====================================================
           3. Prepare containers
           ===================================================== */
        Set<RDExamSection> sectionEntities = new LinkedHashSet<>();
        List<RDExamAnswerKey> pendingAnswerKeys = new ArrayList<>();

        /* =====================================================
           4. Sections & Questions
           ===================================================== */
        for (RDExamPaperUploadDTO.SectionDTO sDto : uploadDTO.getSections()) {

            RDExamSection section = new RDExamSection();
            section.setExamPaper(paper);
            section.setSectionName(sDto.getSectionName());
            section.setTitle(sDto.getTitle());
            section.setDescription(sDto.getDescription());
            section.setInstructions(sDto.getInstructions());
            section.setSectionOrder(sDto.getSectionOrder());
            section.setTotalMarks(sDto.getTotalMarks());

            section.setAttemptType(
                    RDExamSection.AttemptType.valueOf(sDto.getAttemptType()));
            section.setAttemptCount(sDto.getAttemptCount());
            section.setCompulsory(
                    sDto.getCompulsory() != null ? sDto.getCompulsory() : true);
            section.setShuffleQuestions(Boolean.TRUE.equals(sDto.getShuffleQuestions()));

            Set<RDExamSectionQuestion> sectionQuestions = new LinkedHashSet<>();

            for (RDExamPaperUploadDTO.SectionQuestionDTO qDto : sDto.getQuestions()) {

                /* ---------- Quiz Question ---------- */
                RDQuizQuestionDTO qq = qDto.getQuestion();

                RDQuizQuestion quizQuestion = new RDQuizQuestion();
                quizQuestion.setQuestionText(qq.getQuestionText());
                quizQuestion.setQuestionType(qq.getQuestionType());
                quizQuestion.setDifficultyLevel(mapDifficultyLevel(qq.getDifficultyLevel()));
                quizQuestion.setMaxMarks(qDto.getMarks());
                quizQuestion.setExamType(qq.getExamType());
                quizQuestion.setExamYear(qq.getExamYear());
                quizQuestion.setExamPaper(qq.getExamPaper());
                quizQuestion.setIsPYQ(qq.getIsPYQ());
                quizQuestion.setTierOrder(qq.getTierOrder());
                quizQuestion.setCourseSessionDetail(sessionDetail);

                quizQuestionDao.saveOrUpdate(quizQuestion);

                /* ---------- Section Mapping ---------- */
                RDExamSectionQuestion sq = new RDExamSectionQuestion();
                sq.setSection(section);
                sq.setQuestion(quizQuestion);
                sq.setMarks(qDto.getMarks());
                sq.setNegativeMarks(
                        qDto.getNegativeMarks() != null ? qDto.getNegativeMarks() : 0.0);
                sq.setDisplayOrder(qDto.getDisplayOrder());
                sq.setMandatory(Boolean.TRUE.equals(qDto.getMandatory()));
                sq.setSubLabel(qDto.getSubLabel());
                sq.setParentQuestionId(qDto.getParentQuestionId());
                sq.setInternalChoiceGroup(qDto.getInternalChoiceGroup());
                sq.setMaxWordLimit(qDto.getMaxWordLimit());

                sectionQuestions.add(sq);

                /* ---------- ANSWER KEY (COLLECT ONLY) ---------- */
                if (qDto.getAnswerKey() != null) {

                    RDExamAnswerKey key = new RDExamAnswerKey();
                    key.setExamPaper(paper);          // TEMP reference
                    key.setSectionQuestion(sq);       // TEMP reference
                    key.setQuestion(quizQuestion);
                    key.setModelAnswer(qDto.getAnswerKey().getModelAnswer());
                    key.setMaxMarks(BigDecimal.valueOf(qDto.getMarks()));

                    try {
                        key.setKeyPoints(
                                objectMapper.writeValueAsString(
                                        qDto.getAnswerKey().getKeyPoints()));
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to serialize answer key points", e);
                    }

                    pendingAnswerKeys.add(key);
                }
            }

            section.setQuestions(sectionQuestions);
            sectionEntities.add(section);
        }

        paper.setSections(sectionEntities);

        /* =====================================================
           5. SAVE PAPER (CASCADE SECTIONS + QUESTIONS)
           ===================================================== */
        System.out.println("[STEP 6] Persisting ExamPaper...");
        examPaperDAO.save(paper);
        System.out.println("[STEP 6] ExamPaper saved with ID=" + paper.getExamPaperId());

        /* =====================================================
           6. SAVE ANSWER KEYS (NOW SAFE)
           ===================================================== */
        System.out.println("[STEP 7] Persisting Answer Keys: " + pendingAnswerKeys.size());
        for (RDExamAnswerKey key : pendingAnswerKeys) {
            key.setExamPaper(paper); // now MANAGED
            examAnswerKeyDAO.saveOrUpdate(key);
        }
        System.out.println("[STEP 7] Answer keys saved");

        /* =====================================================
           7. Update Session Detail
           ===================================================== */
        sessionDetail.setType("exampaper");
        sessionDetail.setTopic(paper.getTitle());
        sessionDetail.setExamPaper(paper);
        courseSessionDetailService.saveRDCourseSessionDetail(sessionDetail);

        System.out.println("[SUCCESS] Exam paper upload completed");
    }



    @Override
    @Transactional(readOnly = true)
    public List<RDExamPaper> getAllExamPapers() {
        return examPaperDAO.findAll();
    }

    

    /* ========================================================= */
    /* FETCH PAPERS FOR SESSION DETAIL                           */
    /* ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public RDExamPaper getExamPapersBySessionDetail(Integer sessionDetailId) {
        return examPaperDAO.findBySessionDetail(sessionDetailId);
    }


    /* ========================================================= */
    /* VIEW PAPER (WITH SECTIONS & QUESTIONS)                    */
    /* ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public RDExamPaper getExamPaperWithDetails(Integer examPaperId) {
        return examPaperDAO.getExamPaperWithDetails(examPaperId);
    }

    /* ========================================================= */
    /* DELETE PAPER                                              */
    /* ========================================================= */
    @Override
    public void deleteExamPaper(Integer examPaperId) {
        examPaperDAO.delete(examPaperId);
    }


	@Override
	public List<RDExamAnswerKey> getAnswerKeysByExamPaper(Integer examPaperId) {
		return examPaperDAO.getAnswerKeysByExamPaper(examPaperId);
	}


	@Override
	@Transactional
	public void upsertExamPaperFromJson(RDExamPaperUploadDTO uploadDTO,
	                                    Integer courseSessionId,
	                                    Integer courseSessionDetailId,
	                                    RDUser user) {

	    System.out.println("========== UPSERT EXAM PAPER START ==========");
	    System.out.println("courseSessionId=" + courseSessionId + ", courseSessionDetailId=" + courseSessionDetailId);
	    System.out.println("Uploaded title=" + (uploadDTO != null ? uploadDTO.getTitle() : "NULL"));
	    System.out.println("User=" + (user != null ? user.getUserID() : "NULL"));

	    RDCourseSessionDetail sessionDetail =
	            courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

	    if (sessionDetail == null) {
	        System.out.println("❌ SessionDetail NOT FOUND: " + courseSessionDetailId);
	        throw new IllegalArgumentException("Invalid Course Session Detail ID: " + courseSessionDetailId);
	    }
	    System.out.println("✅ SessionDetail found: " + sessionDetail.getCourseSessionDetailId());

	    RDExamPaper paper = examPaperDAO.findBySessionDetail(courseSessionDetailId);
	    boolean isUpdate = (paper != null);
	    System.out.println("isUpdate=" + isUpdate);

	    if (!isUpdate) {
	        paper = new RDExamPaper();
	        paper.setCourseSessionDetail(sessionDetail);
	        paper.setCreatedAt(LocalDateTime.now());
	        paper.setIsActive(1);
	        paper.setStatus(RDExamPaper.ExamStatus.DRAFT);
	        paper.setSections(new LinkedHashSet<>());
	        System.out.println("➕ Creating NEW ExamPaper");
	    } else {
	        System.out.println("✏ Updating EXISTING ExamPaper ID=" + paper.getExamPaperId());
	    }

	    /* ---------------- Paper fields ---------------- */
	    paper.setTitle(uploadDTO.getTitle());
	    paper.setSubject(uploadDTO.getSubject());
	    paper.setBoard(uploadDTO.getBoard());
	    paper.setExamYear(uploadDTO.getExamYear());
	    paper.setExamType(uploadDTO.getExamType());
	    paper.setPatternCode(uploadDTO.getPatternCode());
	    paper.setDurationMinutes(uploadDTO.getDurationMinutes());
	    paper.setTotalMarks(uploadDTO.getTotalMarks());
	    paper.setInstructions(uploadDTO.getInstructions());
	    System.out.println("📄 Paper fields set");

	    /* ---------------- Clear existing graph ---------------- */
	    int before = (paper.getSections() != null ? paper.getSections().size() : -1);
	    System.out.println("Before clear → sections size=" + before);

	    if (paper.getSections() == null) {
	        paper.setSections(new LinkedHashSet<>());
	    } else {
	        paper.getSections().clear();
	    }

	    System.out.println("After clear → sections size=" + paper.getSections().size());

	    /* =========================================================
	       ✅ CRITICAL STEP #1: make PAPER managed NOW
	       ========================================================= */
	    System.out.println("🔄 Merging/Saving ExamPaper first (to make it managed) ...");
	    paper = examPaperDAO.merge(paper);   // works for both new + existing
	    System.out.println("✅ Paper managed. paperId=" + paper.getExamPaperId());

	    List<RDExamAnswerKey> pendingKeys = new ArrayList<>();

	    int sectionIndex = 0;
	    int totalQuestions = 0;

	    for (RDExamPaperUploadDTO.SectionDTO sDto : uploadDTO.getSections()) {

	        sectionIndex++;
	        System.out.println("➡ Processing Section #" + sectionIndex + " [" + sDto.getSectionName() + "]");

	        RDExamSection section = new RDExamSection();
	        section.setExamPaper(paper); // paper already managed ✅
	        section.setSectionName(sDto.getSectionName());
	        section.setTitle(sDto.getTitle());
	        section.setDescription(sDto.getDescription());
	        section.setInstructions(sDto.getInstructions());
	        section.setAttemptType(RDExamSection.AttemptType.valueOf(sDto.getAttemptType()));
	        section.setAttemptCount(sDto.getAttemptCount());
	        section.setTotalMarks(sDto.getTotalMarks());
	        section.setSectionOrder(sDto.getSectionOrder());
	        section.setCompulsory(sDto.getCompulsory() != null ? sDto.getCompulsory() : true);

	        /* =========================================================
	           ✅ CRITICAL STEP #2: save SECTION before SQ
	           ========================================================= */
	        examSectionDAO.saveOrUpdate(section);
	        System.out.println("   ✅ Section saved. sectionId=" + section.getSectionId());

	        Set<RDExamSectionQuestion> questions = new LinkedHashSet<>();
	        int qIndex = 0;

	        for (RDExamPaperUploadDTO.SectionQuestionDTO qDto : sDto.getQuestions()) {

	            qIndex++;
	            totalQuestions++;

	            RDQuizQuestionDTO qq = qDto.getQuestion();
	            System.out.println("   ➤ Q#" + totalQuestions + " : " + qq.getQuestionText());

	            RDQuizQuestion quizQ = new RDQuizQuestion();
	            quizQ.setQuestionText(qq.getQuestionText());
	            quizQ.setQuestionType(qq.getQuestionType());
	            quizQ.setDifficultyLevel(mapDifficultyLevel(qq.getDifficultyLevel()));
	            quizQ.setMaxMarks(qDto.getMarks());
	            quizQ.setCourseSessionDetail(sessionDetail);

	            quizQuestionDao.saveOrUpdate(quizQ);
	            System.out.println("     ✔ QuizQuestion saved. quizQId=" + quizQ.getQuestionId());

	            RDExamSectionQuestion sq = new RDExamSectionQuestion();
	            sq.setSection(section); // section already saved ✅
	            sq.setQuestion(quizQ);
	            sq.setMarks(qDto.getMarks());
	            sq.setNegativeMarks(qDto.getNegativeMarks() != null ? qDto.getNegativeMarks() : 0.0);
	            sq.setDisplayOrder(qDto.getDisplayOrder());
	            sq.setMandatory(Boolean.TRUE.equals(qDto.getMandatory()));
	            sq.setSubLabel(qDto.getSubLabel());
	            sq.setParentQuestionId(qDto.getParentQuestionId());
	            sq.setInternalChoiceGroup(qDto.getInternalChoiceGroup());
	            sq.setMaxWordLimit(qDto.getMaxWordLimit());

	            sectionQuestionDAO.saveOrUpdate(sq);
	            System.out.println("     ✅ SectionQuestion saved. sqId=" + sq.getId());

	            questions.add(sq);

	            if (qDto.getAnswerKey() != null) {
	                System.out.println("     🗝 AnswerKey found");

	                RDExamAnswerKey key = new RDExamAnswerKey();
	                key.setExamPaper(paper);
	                key.setSectionQuestion(sq); // sq now saved ✅
	                key.setQuestion(quizQ);
	                key.setModelAnswer(qDto.getAnswerKey().getModelAnswer());
	                key.setMaxMarks(BigDecimal.valueOf(qDto.getMarks()));

	                try {
	                    key.setKeyPoints(objectMapper.writeValueAsString(qDto.getAnswerKey().getKeyPoints()));
	                    key.setExpectedKeywords(objectMapper.writeValueAsString(qDto.getAnswerKey().getExpectedKeywords()));
	                } catch (Exception e) {
	                    System.out.println("❌ AnswerKey JSON serialize failed: " + e.getMessage());
	                    throw new RuntimeException("AnswerKey JSON serialize failed", e);
	                }

	                pendingKeys.add(key);
	            }
	        }

	        section.setQuestions(questions);
	        paper.getSections().add(section);
	        System.out.println("⬅ Section completed. questions=" + questions.size());
	    }

	    System.out.println("📊 Total sections=" + paper.getSections().size());
	    System.out.println("📊 Total questions=" + totalQuestions);

	    /* =========================================================
	       Replace keys AFTER sections/questions are saved
	       ========================================================= */
	    System.out.println("🧹 Deleting old AnswerKeys for paperId=" + paper.getExamPaperId());
	    examAnswerKeyDAO.deleteByExamPaperId(paper.getExamPaperId());

	    System.out.println("💾 Saving AnswerKeys count=" + pendingKeys.size());
	    for (RDExamAnswerKey key : pendingKeys) {
	        System.out.println("   -> save key for sqId=" + (key.getSectionQuestion() != null ? key.getSectionQuestion().getId() : null));
	        examAnswerKeyDAO.saveOrUpdate(key);
	    }
	    System.out.println("✅ AnswerKeys saved");

	    sessionDetail.setExamPaper(paper);
	    sessionDetail.setType("exampaper");
	    sessionDetail.setTopic(paper.getTitle());
	    courseSessionDetailService.saveRDCourseSessionDetail(sessionDetail);

	    System.out.println("✅ SessionDetail updated. topic=" + sessionDetail.getTopic());
	    System.out.println("========== UPSERT EXAM PAPER END ==========");
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

package com.robodynamics.service.impl;

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

import com.robodynamics.dao.RDExamPaperDAO;
import com.robodynamics.dao.RDExamSectionDAO;
import com.robodynamics.dao.RDExamSectionQuestionDAO;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
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
    
    @Autowired private RDQuizQuestionDao quizQuestionDao;

    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;

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

        /* =====================================================
           1. Validate anchor
           ===================================================== */
        RDCourseSessionDetail sessionDetail =
                courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);

        if (sessionDetail == null) {
            throw new IllegalArgumentException("Invalid Course Session Detail ID");
        }

        /* =====================================================
           2. Create Exam Paper
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

        paper.setNegativeMarking(
                uploadDTO.getNegativeMarking() != null ? uploadDTO.getNegativeMarking() : false);
        paper.setNegativeMarkValue(
                uploadDTO.getNegativeMarkValue() != null ? uploadDTO.getNegativeMarkValue() : 0.0);

        paper.setShuffleQuestions(
                uploadDTO.getShuffleQuestions() != null ? uploadDTO.getShuffleQuestions() : false);
        paper.setShuffleSections(
                uploadDTO.getShuffleSections() != null ? uploadDTO.getShuffleSections() : false);

        paper.setStatus(RDExamPaper.ExamStatus.DRAFT);
        paper.setIsActive(1);
        
        paper.setCreatedAt(java.time.LocalDateTime.now());

        // 🔗 Link exam paper to session detail
        paper.setCourseSessionDetail(sessionDetail);

        /* =====================================================
           3. Sections
           ===================================================== */
        Set<RDExamSection> sectionEntities = new LinkedHashSet<>();

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
                    RDExamSection.AttemptType.valueOf(sDto.getAttemptType())
            );
            section.setAttemptCount(sDto.getAttemptCount());
            section.setCompulsory(
                    sDto.getCompulsory() != null ? sDto.getCompulsory() : true);
            section.setShuffleQuestions(
                    sDto.getShuffleQuestions() != null ? sDto.getShuffleQuestions() : false);

            /* =====================================================
               4. Section Questions
               ===================================================== */
            Set<RDExamSectionQuestion> sectionQuestions = new LinkedHashSet<>();

            for (RDExamPaperUploadDTO.SectionQuestionDTO qDto : sDto.getQuestions()) {

                // =============================
                // 4.1 Create NEW Quiz Question
                // =============================
                RDQuizQuestionDTO qq = qDto.getQuestion();

                RDQuizQuestion quizQuestion = new RDQuizQuestion();
                quizQuestion.setQuestionText(qq.getQuestionText());
                quizQuestion.setQuestionType(qq.getQuestionType());
                if (qq.getDifficultyLevel() != null) {
                    quizQuestion.setDifficultyLevel(
                        RDQuizQuestion.DifficultyLevel.valueOf(
                            qq.getDifficultyLevel().trim()
                        )
                    );
                }
                quizQuestion.setCorrectAnswer(qq.getCorrectAnswer());

                quizQuestion.setMaxMarks(
                        qDto.getMarks() != null ? qDto.getMarks() : qq.getMaxMarks()
                );

                quizQuestion.setExamType(qq.getExamType());
                quizQuestion.setExamYear(qq.getExamYear());
                quizQuestion.setExamPaper(qq.getExamPaper());
                quizQuestion.setIsPYQ(qq.getIsPYQ());
                quizQuestion.setAdditionalInfo(qq.getAdditionalInfo());
                if (qq.getTierLevel() != null) {
                    quizQuestion.setTierLevel(
                        RDQuizQuestion.TierLevel.valueOf(
                            qq.getTierLevel().toUpperCase()
                        )
                    );
                }
                quizQuestion.setTierOrder(qq.getTierOrder());

                // 🔗 Anchor question to same session detail
                quizQuestion.setCourseSessionDetail(sessionDetail);

                quizQuestionDao.saveOrUpdate(quizQuestion);

                // =============================
                // 4.2 Map Question to Section
                // =============================
                RDExamSectionQuestion sq = new RDExamSectionQuestion();
                sq.setSection(section);
                sq.setQuestion(quizQuestion);

                sq.setMarks(qDto.getMarks());
                sq.setNegativeMarks(
                        qDto.getNegativeMarks() != null ? qDto.getNegativeMarks() : 0.0
                );
                sq.setDisplayOrder(qDto.getDisplayOrder());

                sq.setMandatory(
                        qDto.getMandatory() != null ? qDto.getMandatory() : false
                );

                sq.setSubLabel(qDto.getSubLabel());
                sq.setParentQuestionId(qDto.getParentQuestionId());
                sq.setInternalChoiceGroup(qDto.getInternalChoiceGroup());
                sq.setMaxWordLimit(qDto.getMaxWordLimit());

                sectionQuestions.add(sq);
            }


            section.setQuestions(sectionQuestions);
            sectionEntities.add(section);
        }

        paper.setSections(sectionEntities);

        /* =====================================================
           5. Persist (CASCADE handles everything)
           ===================================================== */
        examPaperDAO.save(paper);
    }


    /* ========================================================= */
    /* FETCH PAPERS FOR SESSION DETAIL                           */
    /* ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getExamPapersBySessionDetail(Integer sessionDetailId) {
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
}

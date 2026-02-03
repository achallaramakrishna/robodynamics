package com.robodynamics.service.impl;

import com.robodynamics.dto.ExamResultQuestionView;
import com.robodynamics.dto.ExamResultView;
import com.robodynamics.model.*;
import com.robodynamics.service.*;

import com.robodynamics.dao.RDExamAIEvaluationDAO;
import com.robodynamics.dao.RDExamAISummaryDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class RDExamResultServiceImpl implements RDExamResultService {

    @Autowired
    private RDExamSubmissionService submissionService;

    @Autowired
    private RDExamPaperService examPaperService;

    @Autowired
    private RDExamAIEvaluationDAO aiEvaluationDAO;

    @Autowired
    private RDExamAISummaryDAO aiSummaryDAO;

    @Override
    public ExamResultView getResultForSubmission(Integer submissionId) {

        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        RDExamPaper paper =
                examPaperService.getExamPaperWithDetails(
                        submission.getExamPaperId()
                );

        ExamResultView view = new ExamResultView();
        view.setSubmissionId(submissionId);
        view.setTotalMarks(paper.getTotalMarks());

        double totalAwarded = 0;
        boolean needsReview = false;

        List<ExamResultQuestionView> questionViews = new ArrayList<>();

        for (RDExamSection section : paper.getSections()) {
            for (RDExamSectionQuestion sq : section.getQuestions()) {

                RDExamAIEvaluation aiEval =
                        aiEvaluationDAO.findBySubmissionAndSectionQuestion(
                                submissionId,
                                sq.getQuestion().getQuestionId()
                        );

                ExamResultQuestionView qv = new ExamResultQuestionView();
                qv.setQuestionId(sq.getQuestion().getQuestionId());
                qv.setQuestionText(sq.getQuestion().getQuestionText());
                qv.setMaxMarks(sq.getMarks());

                if (aiEval != null) {
                	qv.setMarksAwarded(
                	        aiEval.getMarksAwarded() != null
                	                ? aiEval.getMarksAwarded().doubleValue()
                	                : 0.0
                	);

                    qv.setConfidence(aiEval.getConfidence());
                    qv.setFeedback(aiEval.getFeedback());

                    totalAwarded += aiEval.getMarksAwarded().doubleValue();
                    if (qv.isNeedsReview()) {
                        needsReview = true;
                    }
                }

                questionViews.add(qv);
            }
        }

        view.setTotalMarksAwarded(totalAwarded);
        view.setNeedsTeacherReview(needsReview);

        RDExamAISummary summary =
                aiSummaryDAO.findBySubmissionId(submissionId);

        if (summary != null) {
            view.setOverallFeedback(summary.getOverallFeedback());
        }

        view.setQuestions(questionViews);
        return view;
    }
}

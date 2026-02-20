package com.robodynamics.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.robodynamics.model.*;
import com.robodynamics.service.RuleBasedEvaluationService;

@Service
public class RuleBasedEvaluationServiceImpl
        implements RuleBasedEvaluationService {

	@Override
	public BigDecimal evaluate(
	        RDExamSectionQuestion sectionQuestion,
	        String studentAnswer
	) {

	    if (studentAnswer == null || studentAnswer.isBlank())
	        return null;

	    RDExamAnswerKey ak = sectionQuestion.getAnswerKey();
	    if (ak == null) return null;

	    String model = ak.getModelAnswer();
	    if (model == null || model.isBlank()) return null;

	    // 1️⃣ Try numeric comparison first
	    BigDecimal numericResult =
	            evaluateNumeric(sectionQuestion, studentAnswer);

	    if (numericResult != null)
	        return numericResult;

	    // 2️⃣ Try exact match comparison
	    BigDecimal exactResult =
	            evaluateExactMatch(sectionQuestion, studentAnswer);

	    if (exactResult != null)
	        return exactResult;

	    return null; // let AI decide
	}
	
	private BigDecimal evaluateExactMatch(
	        RDExamSectionQuestion sectionQuestion,
	        String studentAnswer
	) {

	    RDExamAnswerKey ak = sectionQuestion.getAnswerKey();
	    if (ak == null) return null;

	    String correct = normalize(ak.getModelAnswer());
	    String student = normalize(studentAnswer);

	    if (correct.equalsIgnoreCase(student)) {
	        return BigDecimal.valueOf(sectionQuestion.getMarks());
	    }

	    return null;
	}



    private BigDecimal evaluateMCQ(
            RDExamSectionQuestion sectionQuestion,
            String studentAnswer
    ) {

        RDExamAnswerKey ak = sectionQuestion.getAnswerKey();
        if (ak == null) return null;

        String correct = normalize(ak.getModelAnswer());
        String student = normalize(studentAnswer);

        if (correct.equalsIgnoreCase(student)) {
            return BigDecimal.valueOf(sectionQuestion.getMarks());
        }

        return BigDecimal.ZERO;
    }


    
    private BigDecimal evaluateNumeric(
            RDExamSectionQuestion sectionQuestion,
            String studentAnswer
    ) {

        RDExamAnswerKey ak = sectionQuestion.getAnswerKey();
        if (ak == null) return null;

        String model = ak.getModelAnswer();
        if (model == null) return null;

        try {

            Double correct = parseFlexibleNumber(model);
            Double student = parseFlexibleNumber(studentAnswer);

            if (correct == null || student == null)
                return null;

            // small tolerance for rounding
            if (Math.abs(correct - student) < 0.001) {

                return BigDecimal
                        .valueOf(sectionQuestion.getMarks());
            }

        } catch (Exception ignored) {}

        return null;
    }

    private Double parseFlexibleNumber(String value) {

        if (value == null) return null;

        value = value.trim();

        // 1️⃣ Handle fractions like 3/6 or 9/20
        if (value.matches("\\d+\\s*/\\s*\\d+")) {

            String[] parts = value.split("/");

            double numerator = Double.parseDouble(parts[0].trim());
            double denominator = Double.parseDouble(parts[1].trim());

            if (denominator == 0) return null;

            return numerator / denominator;
        }

        // 2️⃣ Remove commas, currency, units
        value = value.replaceAll(",", "")
                     .replaceAll("[^0-9.\\-]", "");

        if (value.isBlank()) return null;

        return Double.parseDouble(value);
    }

    private Double parseNumber(String value) {

        if (value == null) return null;

        value = value.replaceAll(",", "")
                     .replaceAll("[^0-9.\\-]", "");

        if (value.isBlank()) return null;

        return Double.parseDouble(value);
    }

    private String normalize(String s) {
        return s == null ? "" :
                s.trim().replaceAll("\\s+", "").toLowerCase();
    }
}

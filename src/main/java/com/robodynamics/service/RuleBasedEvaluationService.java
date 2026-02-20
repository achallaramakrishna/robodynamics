package com.robodynamics.service;

import java.math.BigDecimal;
import com.robodynamics.model.RDExamSectionQuestion;

public interface RuleBasedEvaluationService {

    BigDecimal evaluate(
            RDExamSectionQuestion sectionQuestion,
            String studentAnswer
    );
}

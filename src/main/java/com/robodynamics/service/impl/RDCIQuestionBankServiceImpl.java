package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCIQuestionBankDao;
import com.robodynamics.model.RDCIQuestionBank;
import com.robodynamics.service.RDCIQuestionBankService;

@Service
public class RDCIQuestionBankServiceImpl implements RDCIQuestionBankService {

    private static final String MODULE_APTIPATH = "APTIPATH";
    private static final String V1 = "v1";
    private static final String V2 = "v2";
    private static final String V3 = "v3";

    private static final String SECTION_CORE_APTITUDE = "CORE_APTITUDE";
    private static final String SECTION_APPLIED_CHALLENGE = "APPLIED_CHALLENGE";
    private static final String SECTION_INTEREST_WORK = "INTEREST_WORK";
    private static final String SECTION_VALUES_MOTIVATION = "VALUES_MOTIVATION";
    private static final String SECTION_LEARNING_BEHAVIOR = "LEARNING_BEHAVIOR";
    private static final String SECTION_AI_READINESS = "AI_READINESS";
    private static final String SECTION_CAREER_REALITY = "CAREER_REALITY";

    private static final BigDecimal WEIGHT_CORE = BigDecimal.valueOf(1.60);
    private static final BigDecimal WEIGHT_APPLIED = BigDecimal.valueOf(1.40);
    private static final BigDecimal WEIGHT_INTEREST = BigDecimal.valueOf(1.00);
    private static final BigDecimal WEIGHT_VALUES = BigDecimal.valueOf(1.00);
    private static final BigDecimal WEIGHT_LEARNING = BigDecimal.valueOf(1.10);
    private static final BigDecimal WEIGHT_AI = BigDecimal.valueOf(1.10);
    private static final BigDecimal WEIGHT_REALITY = BigDecimal.valueOf(0.90);

    @Autowired
    private RDCIQuestionBankDao ciQuestionBankDao;

    @Override
    @Transactional
    public List<RDCIQuestionBank> getOrSeedActiveQuestions(String moduleCode, String assessmentVersion) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        try {
            List<RDCIQuestionBank> rows = ciQuestionBankDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
            if (!rows.isEmpty()) {
                return rows;
            }

            seedDefaults(normalizedModule, normalizedVersion);
            return ciQuestionBankDao.findActiveByModuleAndVersion(normalizedModule, normalizedVersion);
        } catch (RuntimeException ex) {
            return buildDefaultInMemory(normalizedModule, normalizedVersion);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RDCIQuestionBank getByModuleVersionAndQuestionCode(String moduleCode, String assessmentVersion, String questionCode) {
        String normalizedModule = normalizeModule(moduleCode);
        String normalizedVersion = normalizeVersion(assessmentVersion);
        if (questionCode == null || questionCode.trim().isEmpty()) {
            return null;
        }
        try {
            return ciQuestionBankDao.findByModuleVersionAndQuestionCode(
                    normalizedModule,
                    normalizedVersion,
                    questionCode.trim().toUpperCase(Locale.ENGLISH));
        } catch (RuntimeException ex) {
            return buildDefaultInMemory(normalizedModule, normalizedVersion).stream()
                    .filter(q -> q.getQuestionCode() != null
                            && q.getQuestionCode().equalsIgnoreCase(questionCode.trim()))
                    .findFirst()
                    .orElse(null);
        }
    }

    private void seedDefaults(String moduleCode, String assessmentVersion) {
        if (!MODULE_APTIPATH.equalsIgnoreCase(moduleCode)) {
            return;
        }
        if (ciQuestionBankDao.countByModuleAndVersion(moduleCode, assessmentVersion) > 0) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        List<RDCIQuestionBank> seeds = buildDefaultInMemory(moduleCode, assessmentVersion);
        for (RDCIQuestionBank question : seeds) {
            question.setCreatedAt(now);
            question.setUpdatedAt(now);
            ciQuestionBankDao.save(question);
        }
    }

    private List<RDCIQuestionBank> buildDefaultInMemory(String moduleCode, String assessmentVersion) {
        if (V1.equalsIgnoreCase(nz(assessmentVersion))) {
            return buildLegacyV1QuestionSet(moduleCode, assessmentVersion);
        }
        if (V2.equalsIgnoreCase(nz(assessmentVersion))) {
            return buildPremiumV2QuestionSet(moduleCode, assessmentVersion);
        }
        return buildPremiumV3QuestionSet(moduleCode, assessmentVersion);
    }

    private List<RDCIQuestionBank> buildLegacyV1QuestionSet(String moduleCode, String assessmentVersion) {
        List<RDCIQuestionBank> list = new ArrayList<>();
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_01", 1, "LOGIC",
                "If all ROVERS are DRONES and some DRONES are CAMERAS, which statement must be true?",
                options(
                        "Some rovers are cameras",
                        "All rovers are cameras",
                        "Some drones are cameras",
                        "No rover is a camera"),
                "C",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_02", 2, "NUMERIC",
                "A student spends 30% time on math and 20% on science in a 10-hour study day. Total time for math plus science?",
                options(
                        "3 hours",
                        "4 hours",
                        "5 hours",
                        "6 hours"),
                "C",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_03", 3, "SPATIAL",
                "A square rotates 90 degrees clockwise in each step. Which orientation appears in the third step?",
                options(
                        "Original orientation",
                        "90 degree orientation",
                        "180 degree orientation",
                        "Mirror flipped orientation"),
                "C",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_04", 4, "INTEREST",
                "You are happiest when working on:",
                options(
                        "Hands-on builds and prototypes",
                        "People communication and counseling",
                        "Business strategy and markets",
                        "Art design and storytelling"),
                "A",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_05", 5, "INTEREST",
                "Pick the activity you would voluntarily spend a weekend on.",
                options(
                        "Coding a mini app",
                        "Preparing for a debate",
                        "Launching an online product",
                        "Creating digital illustrations"),
                "A",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_06", 6, "DECISION",
                "When faced with a difficult problem, your first move is usually:",
                options(
                        "Break it into smaller pieces",
                        "Discuss with mentors and friends",
                        "Check outcomes and risks",
                        "Try a creative approach"),
                "A",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_07", 7, "READINESS",
                "How comfortable are you with foundational math?",
                options(
                        "Very comfortable",
                        "Moderately comfortable",
                        "Need guided support",
                        "Not comfortable"),
                "A",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_08", 8, "READINESS",
                "How often do you revise what you learn within 48 hours?",
                options(
                        "Always",
                        "Often",
                        "Sometimes",
                        "Rarely"),
                "A",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_09", 9, "EXPLORATION",
                "How many career domains have you explored seriously?",
                options(
                        "4 or more",
                        "2 to 3",
                        "1",
                        "None yet"),
                "B",
                BigDecimal.ONE));
        list.add(newQuestion(moduleCode, assessmentVersion, "APT_Q_10", 10, "WELLBEING",
                "Before exams, your stress level is usually:",
                options(
                        "Low and manageable",
                        "Moderate",
                        "High but controllable",
                        "Very high"),
                "A",
                BigDecimal.ONE));
        return list;
    }

    private List<RDCIQuestionBank> buildPremiumV2QuestionSet(String moduleCode, String assessmentVersion) {
        List<RDCIQuestionBank> list = new ArrayList<>();

        // Anchor questions, one per sprint first.
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_01", 1, SECTION_CORE_APTITUDE,
                "Verbal reasoning: Choose the best analogy. Catalyst is to reaction as coach is to:",
                options("Athlete progress", "Sports equipment", "Tournament ticket", "Scoreboard"),
                "A", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_01", 2, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: A school wants to cut electricity usage by 15%. What is the best first step?",
                options(
                        "Collect one week room-wise usage data",
                        "Replace all lights immediately",
                        "Ban AC use for everyone",
                        "Issue a warning notice only"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_01", 3, SECTION_INTEREST_WORK,
                "Which weekend project are you most likely to complete fully?",
                options(
                        "Build a small robot and tune it",
                        "Host a school event with sponsors",
                        "Produce a short social awareness video",
                        "Design a student support survey"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_VAL_01", 4, SECTION_VALUES_MOTIVATION,
                "Which matters most when selecting a career path right now?",
                options(
                        "Long-term growth and mastery",
                        "Quick recognition",
                        "Minimal effort path",
                        "Only peer approval"),
                "A", WEIGHT_VALUES));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_LRN_01", 5, SECTION_LEARNING_BEHAVIOR,
                "You miss your study target for two days. What do you do next?",
                options(
                        "Reset plan and recover with a focused schedule",
                        "Wait for motivation to return",
                        "Drop difficult topics permanently",
                        "Study randomly without a plan"),
                "A", WEIGHT_LEARNING));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_AIR_01", 6, SECTION_AI_READINESS,
                "When using an AI tool for homework, the most reliable practice is:",
                options(
                        "Verify AI output with textbook or trusted source",
                        "Copy the answer as-is if it looks fluent",
                        "Use only one prompt and submit quickly",
                        "Avoid checking units or assumptions"),
                "A", WEIGHT_AI));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_REAL_01", 7, SECTION_CAREER_REALITY,
                "A career you like needs 3 years of disciplined practice. Your response is:",
                options(
                        "Commit to a structured long-term plan",
                        "Try only if immediate results appear",
                        "Switch paths every month",
                        "Avoid effort-heavy careers"),
                "A", WEIGHT_REALITY));

        // Round 2 anchors.
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_02", 8, SECTION_CORE_APTITUDE,
                "Quantitative: If 18 notebooks cost 540, what is the cost of 11 notebooks?",
                options("270", "300", "330", "360"),
                "C", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_02", 9, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: In a mock test, wrong answers carry negative marks. Best strategy is:",
                options(
                        "Attempt only questions with clear elimination confidence",
                        "Attempt every question regardless of certainty",
                        "Skip all hard questions without reading",
                        "Spend equal time on each question blindly"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_02", 10, SECTION_INTEREST_WORK,
                "Which work setup energizes you most?",
                options(
                        "Building systems and debugging issues",
                        "Negotiating and selling daily",
                        "Documenting policies and procedures",
                        "Performing repetitive routine tasks"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_VAL_02", 11, SECTION_VALUES_MOTIVATION,
                "If two options pay equally, you choose the one that:",
                options(
                        "Builds stronger skills for the future",
                        "Looks easiest immediately",
                        "Requires the least learning",
                        "Matches social media trends"),
                "A", WEIGHT_VALUES));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_LRN_02", 12, SECTION_LEARNING_BEHAVIOR,
                "How do you typically revise after class?",
                options(
                        "Within 24 to 48 hours using active recall",
                        "Only before tests",
                        "Only when teacher reminds",
                        "Rarely revise"),
                "A", WEIGHT_LEARNING));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_AIR_02", 13, SECTION_AI_READINESS,
                "AI readiness: Best way to prompt an AI tutor for difficult physics problems is:",
                options(
                        "Ask step-by-step reasoning with unit checks",
                        "Ask for final answer only",
                        "Paste question without context and trust output",
                        "Use casual chat without constraints"),
                "A", WEIGHT_AI));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_REAL_02", 14, SECTION_CAREER_REALITY,
                "When your chosen target seems uncertain, you should:",
                options(
                        "Keep target plus prepare adjacent fallback options",
                        "Ignore uncertainty and avoid backup planning",
                        "Stop preparation immediately",
                        "Rely only on friends choices"),
                "A", WEIGHT_REALITY));

        // Round 3 anchors.
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_03", 15, SECTION_CORE_APTITUDE,
                "Logical reasoning: All coders are problem-solvers. Some mentors are coders. Which statement follows?",
                options(
                        "All mentors are problem-solvers",
                        "Some mentors are problem-solvers",
                        "No mentor is a problem-solver",
                        "Some problem-solvers are not coders"),
                "B", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_03", 16, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: A startup must choose one feature to launch first. Best decision method is:",
                options(
                        "Score user impact, effort, and risk before selecting",
                        "Choose the flashiest feature only",
                        "Pick randomly to save time",
                        "Build all features partially"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_03", 17, SECTION_INTEREST_WORK,
                "You prefer tasks where success is defined by:",
                options(
                        "Solving complex problems with measurable improvement",
                        "Avoiding any performance evaluation",
                        "Doing only tasks assigned by others",
                        "Repeating known steps forever"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_VAL_03", 18, SECTION_VALUES_MOTIVATION,
                "Which statement best matches your motivation style?",
                options(
                        "I value purposeful effort and progress tracking",
                        "I start many goals but rarely follow through",
                        "I avoid goals that need feedback",
                        "I work only under pressure from others"),
                "A", WEIGHT_VALUES));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_LRN_03", 19, SECTION_LEARNING_BEHAVIOR,
                "During long exam preparation, your best habit is:",
                options(
                        "Weekly review plus error-log correction",
                        "New material daily without revision",
                        "Skipping analysis of mistakes",
                        "Studying only favorite topics"),
                "A", WEIGHT_LEARNING));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_AIR_03", 20, SECTION_AI_READINESS,
                "Which behavior shows strong AI-era collaboration skill?",
                options(
                        "Use AI drafts, then refine with peer discussion",
                        "Use AI output and avoid teamwork",
                        "Ignore conflicting viewpoints",
                        "Avoid documenting assumptions"),
                "A", WEIGHT_AI));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_REAL_03", 21, SECTION_CAREER_REALITY,
                "If your score drops in one mock test, what is the best response?",
                options(
                        "Diagnose weak areas and adjust the weekly plan",
                        "Conclude you are not capable",
                        "Ignore the result completely",
                        "Copy someone else schedule without adaptation"),
                "A", WEIGHT_REALITY));

        // Round 4 anchors.
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_04", 22, SECTION_CORE_APTITUDE,
                "Spatial reasoning: A cube has opposite faces painted red and blue. If red is top, blue can be:",
                options("Bottom only", "Any adjacent face", "Left only", "Front only"),
                "A", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_04", 23, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: A biology experiment gives inconsistent results. First correction should be:",
                options(
                        "Check control variables and measurement consistency",
                        "Discard all data and start new topic",
                        "Change hypothesis after every trial",
                        "Report average without checking errors"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_04", 24, SECTION_INTEREST_WORK,
                "Which cross-domain task feels most exciting?",
                options(
                        "Math plus coding plus real-world model building",
                        "Only memorizing definitions repeatedly",
                        "Avoiding experimentation and discussion",
                        "Following one template forever"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_VAL_04", 25, SECTION_VALUES_MOTIVATION,
                "You are offered two projects: easy short-term versus difficult high-learning. You pick:",
                options(
                        "Difficult high-learning with a milestone plan",
                        "Easy short-term regardless of growth",
                        "Neither because both need effort",
                        "Whichever requires least accountability"),
                "A", WEIGHT_VALUES));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_LRN_04", 26, SECTION_LEARNING_BEHAVIOR,
                "Which approach improves exam stamina most?",
                options(
                        "Timed practice blocks with review breaks",
                        "Random late-night cramming",
                        "Only passive reading",
                        "Skipping sleep before tests"),
                "A", WEIGHT_LEARNING));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_AIR_04", 27, SECTION_AI_READINESS,
                "AI ethics in learning means:",
                options(
                        "Use AI responsibly and cite support where needed",
                        "Submit AI text as original work",
                        "Hide all AI usage from mentors",
                        "Use AI to bypass understanding"),
                "A", WEIGHT_AI));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_REAL_04", 28, SECTION_CAREER_REALITY,
                "Communication-heavy roles require frequent presentations. You currently:",
                options(
                        "Practice gradually to improve communication confidence",
                        "Avoid all speaking tasks permanently",
                        "Assume communication never matters",
                        "Wait for confidence without practice"),
                "A", WEIGHT_REALITY));

        // Deeper adaptive tail.
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_05", 29, SECTION_CORE_APTITUDE,
                "Quantitative: Ratio of boys to girls is 5:4 in a class of 45. Number of girls?",
                options("18", "20", "22", "25"),
                "B", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_05", 30, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: A social campaign has low participation. Most effective fix is:",
                options(
                        "Run audience interviews and redesign message",
                        "Post more without feedback analysis",
                        "Change logo every day",
                        "Stop campaign immediately"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_05", 31, SECTION_INTEREST_WORK,
                "You would rather spend two hours on:",
                options(
                        "Breaking a hard concept until it becomes clear",
                        "Scrolling updates about others achievements",
                        "Postponing all decisions",
                        "Repeating solved easy questions only"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_06", 32, SECTION_CORE_APTITUDE,
                "Verbal: Choose the sentence with strongest logical structure.",
                options(
                        "Since all data was sampled randomly, inference error is reduced.",
                        "Data looked good so the result must be correct.",
                        "Most students liked it therefore it is scientifically valid.",
                        "One success proves the method always works."),
                "A", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_06", 33, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: You must choose between NEET and JEE focus with limited time. Best path is:",
                options(
                        "Map strengths, syllabus overlap, and mentor feedback before committing",
                        "Choose whichever friends choose",
                        "Prepare both fully without scheduling",
                        "Delay decision until exam month"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_INT_06", 34, SECTION_INTEREST_WORK,
                "When you see a difficult machine or system, your first thought is:",
                options(
                        "How does this work internally and how can it improve?",
                        "I should avoid understanding this",
                        "Someone else will handle it",
                        "This is not useful to learn"),
                "A", WEIGHT_INTEREST));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_07", 35, SECTION_CORE_APTITUDE,
                "Logical sequence: 3, 7, 15, 31, ?",
                options("45", "51", "63", "95"),
                "C", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_07", 36, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: In a design sprint, user testing shows confusion. Next action is:",
                options(
                        "Revise prototype based on top confusion points",
                        "Ignore users and launch anyway",
                        "Add more features without testing",
                        "Change team roles without evidence"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_08", 37, SECTION_CORE_APTITUDE,
                "Spatial: A paper is folded twice and one corner is cut. After unfolding, cuts appear:",
                options("At one corner only", "At two symmetric points", "At four symmetric points", "Randomly placed"),
                "C", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_APPL_08", 38, SECTION_APPLIED_CHALLENGE,
                "Applied challenge: A mock test trend shows slow improvement. Best intervention is:",
                options(
                        "Section-wise analysis and targeted drill schedule",
                        "Increase study hours without analysis",
                        "Switch every resource weekly",
                        "Attempt fewer tests"),
                "A", WEIGHT_APPLIED));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_09", 39, SECTION_CORE_APTITUDE,
                "Quantitative: If a speed increases from 40 km/h to 50 km/h, percentage increase is:",
                options("20%", "25%", "30%", "40%"),
                "B", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_10", 40, SECTION_CORE_APTITUDE,
                "Verbal inference: Which statement is strongest when evidence is incomplete?",
                options(
                        "Propose a cautious conclusion and seek more data",
                        "Claim certainty from one data point",
                        "Reject all evidence immediately",
                        "Accept the most popular opinion"),
                "A", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_11", 41, SECTION_CORE_APTITUDE,
                "Logical puzzle: If no A is B, and some C are B, then which is definitely true?",
                options(
                        "Some C are not A",
                        "All C are A",
                        "No C is A",
                        "All A are C"),
                "A", WEIGHT_CORE));
        list.add(newQuestion(moduleCode, assessmentVersion, "AP2_CORE_12", 42, SECTION_CORE_APTITUDE,
                "Numeric reasoning: A test has 80 questions and you solved 60%. How many were solved?",
                options("36", "42", "48", "60"),
                "C", WEIGHT_CORE));

        return list;
    }

    private List<RDCIQuestionBank> buildPremiumV3QuestionSet(String moduleCode, String assessmentVersion) {
        List<RDCIQuestionBank> list = new ArrayList<>();

        int sequenceNo = 1;
        int coreIndex = 1;
        int appliedIndex = 1;
        int interestIndex = 1;
        int valuesIndex = 1;
        int learningIndex = 1;
        int aiIndex = 1;
        int realityIndex = 1;

        // Baseline anchors: 2 per section (14 total).
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_CORE", coreIndex++),
                sequenceNo,
                SECTION_CORE_APTITUDE,
                "Core aptitude: If 15 notebooks cost 600 rupees, what is the cost of 9 notebooks?",
                "360", "300", "420", "540",
                WEIGHT_CORE);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_APPL", appliedIndex++),
                sequenceNo,
                SECTION_APPLIED_CHALLENGE,
                "Applied challenge (NEET/JEE): Mock score drops for 3 tests. What should be done first?",
                "Run chapter-level error analysis and rebuild weekly plan",
                "Increase random study hours immediately",
                "Switch all books in one week",
                "Stop mocks until final month",
                WEIGHT_APPLIED);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_INT", interestIndex++),
                sequenceNo,
                SECTION_INTEREST_WORK,
                "Interest mapping: Which project are you most likely to finish end-to-end?",
                "Build and test a prototype with measurable output",
                "Promote the project without building it",
                "Only format reports and slides",
                "Repeat old solved work only",
                WEIGHT_INTEREST);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_VAL", valuesIndex++),
                sequenceNo,
                SECTION_VALUES_MOTIVATION,
                "Values check: Two paths offer same marks now. Which one do you choose?",
                "Path that builds deeper long-term capability",
                "Path with minimum effort and no feedback",
                "Path most chosen by friends regardless fit",
                "Path with quick visibility but no growth",
                WEIGHT_VALUES);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_LRN", learningIndex++),
                sequenceNo,
                SECTION_LEARNING_BEHAVIOR,
                "Learning behavior: You missed schedule for 2 days due to stress. What next?",
                "Use a recovery protocol: breathe, analyze errors, reset schedule",
                "Panic and study random topics for long hours",
                "Stop practice tests for two weeks",
                "Ignore the gap and continue without changes",
                WEIGHT_LEARNING);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_AI", aiIndex++),
                sequenceNo,
                SECTION_AI_READINESS,
                "AI readiness: Best way to use AI tutor for hard physics problems is:",
                "Ask for stepwise reasoning and verify with textbook principles",
                "Copy final answer directly without checking",
                "Use one vague prompt and trust output blindly",
                "Use AI to avoid understanding the concept",
                WEIGHT_AI);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_REAL", realityIndex++),
                sequenceNo,
                SECTION_CAREER_REALITY,
                "Career reality: If anxiety increases before mocks, what is the best response?",
                "Use a calm-start ritual and continue timed practice with reflection",
                "Avoid all tests until confidence appears naturally",
                "Study only easy chapters for comfort",
                "Shift goal every week to reduce pressure",
                WEIGHT_REALITY);

        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_CORE", coreIndex++),
                sequenceNo,
                SECTION_CORE_APTITUDE,
                "Core aptitude: In the sequence 5, 11, 17, 23, what comes next?",
                "29", "27", "31", "35",
                WEIGHT_CORE);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_APPL", appliedIndex++),
                sequenceNo,
                SECTION_APPLIED_CHALLENGE,
                "Applied challenge (CAT/CLAT): Preparation time is limited. Best first decision step?",
                "Map strengths, constraints, and exam overlap before choosing focus",
                "Choose based on peer trend only",
                "Attempt all exam tracks fully without prioritization",
                "Delay decision until registration deadline",
                WEIGHT_APPLIED);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_INT", interestIndex++),
                sequenceNo,
                SECTION_INTEREST_WORK,
                "Interest mapping: Which task naturally keeps you engaged for hours?",
                "Breaking a complex problem until it is solved",
                "Checking what others are doing continuously",
                "Doing repetitive routine without improvement",
                "Waiting for external pressure to start",
                WEIGHT_INTEREST);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_VAL", valuesIndex++),
                sequenceNo,
                SECTION_VALUES_MOTIVATION,
                "Values check: Which statement is closest to your career mindset?",
                "I prefer deliberate progress over instant applause",
                "I avoid feedback if it is uncomfortable",
                "I choose what looks easiest this week",
                "I depend mainly on social approval",
                WEIGHT_VALUES);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_LRN", learningIndex++),
                sequenceNo,
                SECTION_LEARNING_BEHAVIOR,
                "Learning behavior: Which habit improves exam stamina most?",
                "Timed blocks, active recall, and weekly correction loop",
                "Late-night cramming and no revision",
                "Only reading, no problem practice",
                "Ignoring sleep before exam week",
                WEIGHT_LEARNING);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_AI", aiIndex++),
                sequenceNo,
                SECTION_AI_READINESS,
                "AI readiness: Responsible AI learning behavior means:",
                "Use AI drafts, then verify, refine, and cite support",
                "Submit AI output as original work",
                "Hide all AI use from mentor and parent",
                "Use AI to bypass foundational learning",
                WEIGHT_AI);
        sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                code("AP3_REAL", realityIndex++),
                sequenceNo,
                SECTION_CAREER_REALITY,
                "Career reality: If results fluctuate, what is the best long-term approach?",
                "Sustain effort, adjust plan using data, keep fallback options",
                "Quit after one low-performance week",
                "Change target every month without evidence",
                "Rely on motivation alone without system",
                WEIGHT_REALITY);

        // CORE_APTITUDE total target: 84 (already added: 2).
        for (int i = 0; i < 28; i++) {
            int unitPrice = 14 + (i % 9) * 2;
            int baseQty = 12 + (i % 8) * 2;
            int total = unitPrice * baseQty;
            int targetQty = 5 + (i % 7) * 2;
            int correct = unitPrice * targetQty;
            int d1 = correct + unitPrice * 2;
            int d2 = Math.max(1, correct - unitPrice * 2);
            int d3 = correct + unitPrice * 5;
            String question = "Core aptitude (quant): If " + baseQty + " practice sheets cost " + total
                    + " rupees, what is the cost of " + targetQty + " sheets?";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_CORE", coreIndex++),
                    sequenceNo,
                    SECTION_CORE_APTITUDE,
                    question,
                    String.valueOf(correct),
                    String.valueOf(d1),
                    String.valueOf(d2),
                    String.valueOf(d3),
                    WEIGHT_CORE);
        }

        int[] percentSet = {10, 15, 20, 25, 30, 40};
        for (int i = 0; i < 24; i++) {
            int base = 80 + (i % 8) * 20;
            int percent = percentSet[i % percentSet.length];
            int next = base + ((base * percent) / 100);
            int d1 = percent + 5;
            int d2 = Math.max(5, percent - 5);
            int d3 = percent + 10;
            String question = "Core aptitude (numeric): Score increases from " + base + " to " + next
                    + ". Percentage increase is:";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_CORE", coreIndex++),
                    sequenceNo,
                    SECTION_CORE_APTITUDE,
                    question,
                    percent + "%",
                    d1 + "%",
                    d2 + "%",
                    d3 + "%",
                    WEIGHT_CORE);
        }

        for (int i = 0; i < 18; i++) {
            int start = 2 + i;
            int delta = 3 + (i % 5);
            int t1 = start;
            int t2 = start + delta;
            int t3 = start + (2 * delta);
            int t4 = start + (3 * delta);
            int correct = start + (4 * delta);
            int d1 = correct + delta;
            int d2 = correct - delta;
            int d3 = correct + (2 * delta);
            String question = "Core aptitude (pattern): " + t1 + ", " + t2 + ", " + t3 + ", " + t4 + ", ?";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_CORE", coreIndex++),
                    sequenceNo,
                    SECTION_CORE_APTITUDE,
                    question,
                    String.valueOf(correct),
                    String.valueOf(d1),
                    String.valueOf(d2),
                    String.valueOf(d3),
                    WEIGHT_CORE);
        }

        String[][] logicTemplates = {
                {"All coders are problem-solvers. Some mentors are coders. Which follows?", "Some mentors are problem-solvers", "All mentors are coders", "No mentor is a problem-solver", "All problem-solvers are mentors"},
                {"No A is B. Some C are B. Which is definitely true?", "Some C are not A", "All C are A", "No C is A", "All A are C"},
                {"All planners track tasks. Riya tracks tasks. Best conclusion?", "Riya may be a planner but not proven", "Riya is definitely not a planner", "All who track tasks are planners", "No planner tracks tasks"},
                {"If all X are Y and all Y are Z, then:", "All X are Z", "No X is Z", "Some X are not Z", "All Z are X"},
                {"Some students are artists. All artists are disciplined. Which follows?", "Some students are disciplined", "All students are artists", "No student is disciplined", "All disciplined are students"},
                {"If P implies Q and Q implies R, then P implies:", "R", "Not R", "P", "Q only"},
                {"All mock tests improve speed. This is a mock test. Therefore:", "It can improve speed", "It will reduce speed", "It has no effect", "Speed cannot be measured"},
                {"No doctor is careless. Some interns are doctors. Therefore:", "Some interns are not careless", "All interns are careless", "No intern is a doctor", "All doctors are interns"},
                {"All structured plans reduce chaos. Weekly planner is structured. Therefore:", "Weekly planner can reduce chaos", "Weekly planner increases chaos", "Chaos cannot change", "Structure is irrelevant"},
                {"Some engineers are teachers. All teachers communicate clearly. Therefore:", "Some engineers communicate clearly", "All engineers are teachers", "No engineer communicates clearly", "All clear communicators are engineers"},
                {"If a strategy is data-driven, it is testable. This strategy is data-driven. Therefore:", "This strategy is testable", "This strategy is untestable", "Data and testing are unrelated", "Only experts can test it"},
                {"All resilient learners reflect weekly. Aarav reflects weekly. Therefore:", "Aarav may be resilient but it is not guaranteed", "Aarav is never resilient", "Only resilient learners can reflect", "Reflection is useless"}
        };
        for (String[] template : logicTemplates) {
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_CORE", coreIndex++),
                    sequenceNo,
                    SECTION_CORE_APTITUDE,
                    template[0],
                    template[1],
                    template[2],
                    template[3],
                    template[4],
                    WEIGHT_CORE);
        }

        // APPLIED_CHALLENGE total target: 64 (already added: 2).
        String[] tracks = {
                "IIT-JEE", "NEET", "CAT", "CLAT/Law", "Coding and Robotics", "Commerce and Analytics",
                "Design and Creative Tech", "Public Policy", "Applied Sciences", "School Board Excellence"
        };
        String[] situations = {
                "mock accuracy drops while attempts increase",
                "time management fails in the final 30 minutes",
                "high-confidence errors repeat across weeks",
                "concepts are clear but exam pressure causes blank-outs",
                "revision plan exists but execution is inconsistent",
                "student switches resources frequently without depth",
                "parent expectation is high and anxiety is rising",
                "coaching load and school load are conflicting",
                "strength in one subject is not translating to score",
                "student avoids difficult chapters repeatedly"
        };
        String[] bestActions = {
                "diagnose root causes chapter-wise and rebuild the weekly plan",
                "set measurable sprint goals with review checkpoints",
                "create an error log and prioritize high-yield correction loops",
                "run a timed simulation plan with recovery routines",
                "align mentor-parent-student plan with realistic milestones",
                "reduce resource switching and deepen one trusted source",
                "add confidence rebuilding through medium-difficulty drills",
                "map syllabus overlap and lock priority order"
        };
        for (int i = 0; i < 62; i++) {
            String track = tracks[i % tracks.length];
            String situation = situations[(i * 2) % situations.length];
            String bestAction = bestActions[(i * 3) % bestActions.length];
            String question = "Applied challenge (" + track + "): " + situation + ". Best first intervention is:";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_APPL", appliedIndex++),
                    sequenceNo,
                    SECTION_APPLIED_CHALLENGE,
                    question,
                    capitalize(bestAction),
                    "Increase total study hours without diagnosis",
                    "Change all books and apps this week",
                    "Delay corrective action until exam month",
                    WEIGHT_APPLIED);
        }

        // INTEREST_WORK total target: 42 (already added: 2).
        String[] interestThemes = {
                "robotics", "biology models", "mathematical puzzles", "public speaking", "legal reasoning",
                "data analysis", "prototype building", "business simulation", "design thinking", "community problem solving"
        };
        for (int i = 0; i < 40; i++) {
            String theme = interestThemes[i % interestThemes.length];
            String question = "Interest mapping (" + theme + "): Which activity would you continue for 12 weeks by choice?";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_INT", interestIndex++),
                    sequenceNo,
                    SECTION_INTEREST_WORK,
                    question,
                    "Build, iterate, and improve a measurable project outcome",
                    "Only present highlights without deep execution",
                    "Do repetitive low-learning tasks for comfort",
                    "Wait for constant external push to proceed",
                    WEIGHT_INTEREST);
        }

        // VALUES_MOTIVATION total target: 30 (already added: 2).
        String[] valueSituations = {
                "results are slow but progress is real",
                "a difficult project teaches more than an easy one",
                "peer pressure conflicts with your plan",
                "recognition is delayed despite disciplined effort",
                "shortcuts are available but reduce understanding",
                "you must choose between depth and speed"
        };
        for (int i = 0; i < 28; i++) {
            String situation = valueSituations[i % valueSituations.length];
            String question = "Values check: When " + situation + ", what do you choose?";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_VAL", valuesIndex++),
                    sequenceNo,
                    SECTION_VALUES_MOTIVATION,
                    question,
                    "Long-term mastery with disciplined consistency",
                    "Quick comfort even if learning quality drops",
                    "Decision based only on what others prefer",
                    "Avoid difficult choices and postpone commitment",
                    WEIGHT_VALUES);
        }

        // LEARNING_BEHAVIOR total target: 30 (already added: 2).
        String[] learningContexts = {
                "after a low-scoring mock test",
                "during heavy school plus coaching weeks",
                "when revision backlog starts accumulating",
                "when one chapter repeatedly causes mistakes",
                "when focus drops after 45 minutes",
                "in final month before exams"
        };
        for (int i = 0; i < 28; i++) {
            String context = learningContexts[i % learningContexts.length];
            String question = "Learning behavior: Best response " + context + " is:";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_LRN", learningIndex++),
                    sequenceNo,
                    SECTION_LEARNING_BEHAVIOR,
                    question,
                    "Use a structured reset: review errors, reprioritize, and execute timed blocks",
                    "Do random practice without reviewing mistakes",
                    "Skip hard sections and stay in comfort zone",
                    "Study for long hours without sleep discipline",
                    WEIGHT_LEARNING);
        }

        // AI_READINESS total target: 24 (already added: 2).
        String[] aiContexts = {
                "you receive conflicting AI answers for the same problem",
                "AI gives a fluent but suspicious derivation",
                "you need help with a long-form essay outline",
                "you are using AI for coding/debugging support",
                "you are preparing notes for revision with AI",
                "you must avoid plagiarism in submissions"
        };
        for (int i = 0; i < 22; i++) {
            String context = aiContexts[i % aiContexts.length];
            String question = "AI readiness: When " + context + ", best practice is:";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_AI", aiIndex++),
                    sequenceNo,
                    SECTION_AI_READINESS,
                    question,
                    "Cross-check with trusted sources, keep reasoning trace, and refine prompts",
                    "Accept the first response if language looks strong",
                    "Use AI output directly without understanding",
                    "Hide AI support from mentor and parent",
                    WEIGHT_AI);
        }

        // CAREER_REALITY total target: 20 (already added: 2).
        String[] realityContexts = {
                "results are uncertain for 3-4 months",
                "family expectations increase pressure",
                "you need to present ideas publicly",
                "you face repeated setbacks in one subject",
                "two career paths seem attractive but demand different effort",
                "friends progress faster for a short period",
                "burnout signs appear during preparation",
                "you need a fallback option while pursuing a stretch goal",
                "communication-heavy roles create discomfort"
        };
        for (int i = 0; i < 18; i++) {
            String context = realityContexts[i % realityContexts.length];
            String question = "Career reality and mental preparedness: If " + context + ", your best response is:";
            sequenceNo = addQuestionRotated(list, moduleCode, assessmentVersion,
                    code("AP3_REAL", realityIndex++),
                    sequenceNo,
                    SECTION_CAREER_REALITY,
                    question,
                    "Sustain effort with emotional regulation, mentor check-ins, and fallback planning",
                    "Suppress stress signals and continue without reflection",
                    "Abandon path immediately after one setback",
                    "Depend only on motivation spikes and comparison",
                    WEIGHT_REALITY);
        }

        return list;
    }

    private int addQuestionRotated(List<RDCIQuestionBank> list,
                                   String moduleCode,
                                   String assessmentVersion,
                                   String questionCode,
                                   int sequenceNo,
                                   String sectionCode,
                                   String questionText,
                                   String correctOptionLabel,
                                   String distractorA,
                                   String distractorB,
                                   String distractorC,
                                   BigDecimal weightage) {
        int correctIndex = Math.floorMod(sequenceNo, 4);
        String[] labels = new String[4];
        labels[correctIndex] = correctOptionLabel;
        String[] distractors = {distractorA, distractorB, distractorC};
        int d = 0;
        for (int i = 0; i < labels.length; i++) {
            if (labels[i] == null) {
                labels[i] = distractors[d++];
            }
        }
        RDCIQuestionBank question = newQuestion(
                moduleCode,
                assessmentVersion,
                questionCode,
                sequenceNo,
                sectionCode,
                questionText,
                options(labels[0], labels[1], labels[2], labels[3]),
                optionCodeByIndex(correctIndex),
                weightage);
        question.setMediaImageUrl(pedagogicalImageForSection(sectionCode));
        list.add(question);
        return sequenceNo + 1;
    }

    private String pedagogicalImageForSection(String sectionCode) {
        String section = nz(sectionCode).toUpperCase(Locale.ENGLISH);
        switch (section) {
            case SECTION_CORE_APTITUDE:
                return "resources/images/aptipath/core-aptitude.svg";
            case SECTION_APPLIED_CHALLENGE:
                return "resources/images/aptipath/applied-challenge.svg";
            case SECTION_INTEREST_WORK:
                return "resources/images/aptipath/interest-work.svg";
            case SECTION_VALUES_MOTIVATION:
                return "resources/images/aptipath/values-motivation.svg";
            case SECTION_LEARNING_BEHAVIOR:
                return "resources/images/aptipath/learning-behavior.svg";
            case SECTION_AI_READINESS:
                return "resources/images/aptipath/ai-readiness.svg";
            case SECTION_CAREER_REALITY:
                return "resources/images/aptipath/career-reality.svg";
            default:
                return null;
        }
    }

    private String optionCodeByIndex(int index) {
        switch (index) {
            case 0:
                return "A";
            case 1:
                return "B";
            case 2:
                return "C";
            default:
                return "D";
        }
    }

    private String code(String prefix, int index) {
        return prefix + "_" + String.format(Locale.ENGLISH, "%03d", index);
    }

    private String capitalize(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }
        if (text.length() == 1) {
            return text.toUpperCase(Locale.ENGLISH);
        }
        return text.substring(0, 1).toUpperCase(Locale.ENGLISH) + text.substring(1);
    }

    private RDCIQuestionBank newQuestion(String moduleCode,
                                         String assessmentVersion,
                                         String questionCode,
                                         int sequenceNo,
                                         String sectionCode,
                                         String questionText,
                                         String optionsJson,
                                         String correctOption,
                                         BigDecimal weightage) {
        RDCIQuestionBank question = new RDCIQuestionBank();
        question.setModuleCode(moduleCode);
        question.setAssessmentVersion(assessmentVersion);
        question.setQuestionCode(questionCode);
        question.setSequenceNo(sequenceNo);
        question.setSectionCode(sectionCode);
        question.setQuestionType("MCQ");
        question.setQuestionText(questionText);
        question.setOptionsJson(optionsJson);
        question.setCorrectOption(correctOption);
        question.setWeightage(weightage == null ? BigDecimal.ONE : weightage);
        question.setStatus("ACTIVE");
        return question;
    }

    private String options(String optionA, String optionB, String optionC, String optionD) {
        return "[{\"code\":\"A\",\"label\":\"" + escapeJson(optionA) + "\"}," +
                "{\"code\":\"B\",\"label\":\"" + escapeJson(optionB) + "\"}," +
                "{\"code\":\"C\",\"label\":\"" + escapeJson(optionC) + "\"}," +
                "{\"code\":\"D\",\"label\":\"" + escapeJson(optionD) + "\"}]";
    }

    private String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private String nz(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeModule(String moduleCode) {
        if (moduleCode == null || moduleCode.trim().isEmpty()) {
            return MODULE_APTIPATH;
        }
        return moduleCode.trim().toUpperCase(Locale.ENGLISH);
    }

    private String normalizeVersion(String assessmentVersion) {
        if (assessmentVersion == null || assessmentVersion.trim().isEmpty()) {
            return V1;
        }
        return assessmentVersion.trim();
    }
}

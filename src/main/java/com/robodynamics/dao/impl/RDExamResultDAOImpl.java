	package com.robodynamics.dao.impl;
	
	import java.math.BigDecimal;
import java.util.List;
	
	import org.hibernate.Session;
	import org.hibernate.SessionFactory;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Repository;
	import org.springframework.transaction.annotation.Transactional;
	
	import com.robodynamics.dao.RDExamResultDAO;
	import com.robodynamics.dto.ExamQuestionResultRow;
	import com.robodynamics.dto.ExamResultSummaryRow;
	
	@Repository   // 🔥 REQUIRED
	@Transactional(readOnly = true)
	public class RDExamResultDAOImpl implements RDExamResultDAO {
	
	    @Autowired
	    private SessionFactory sessionFactory;
	
	    private Session session() {
	        return sessionFactory.getCurrentSession();
	    }
	
	    @Override
	    @Transactional(readOnly = true)
	    public ExamResultSummaryRow getResultSummary(Integer submissionId) {

	        String sql = """
	            SELECT
	                p.exam_paper_id,
	                s.total_marks_awarded,
	                p.total_marks,
	                sm.overall_feedback
	            FROM rd_exam_submission s
	            JOIN rd_exam_papers p
	                ON p.exam_paper_id = s.exam_paper_id
	            LEFT JOIN rd_exam_ai_summary sm
	                ON sm.submission_id = s.submission_id
	            WHERE s.submission_id = :submissionId
	        """;

	        Object[] row = (Object[]) session()
	                .createNativeQuery(sql)
	                .setParameter("submissionId", submissionId)
	                .uniqueResult();
	        Integer examPaperId = row[0] != null ? ((Number) row[0]).intValue() : null;
	        Number awarded      = (Number) row[1];
	        Number total        = (Number) row[2];
	        String feedback     = (String) row[3];

	        ExamResultSummaryRow summary =
	                new ExamResultSummaryRow(examPaperId,awarded, total, feedback);
	        return summary;
	    }
	
	
	    @SuppressWarnings("unchecked")
	    @Override
	    @Transactional(readOnly = true)
	    public List<ExamQuestionResultRow> getDetailedQuestionResult(Integer submissionId) {

	        String sql = """
	            SELECT
	                qq.question_id,                 -- ✅ NEW
	                qq.question_type,               -- ✅ NEW
	                sec.section_name,
	                qq.question_text,
	                CAST(sq.marks AS DECIMAL(10,2)),
	                CAST(eval.marks_awarded AS DECIMAL(10,2)),
	                eval.feedback,
	                eval.student_answer,
	                ak.model_answer
	            FROM rd_exam_ai_evaluations eval
	            JOIN rd_exam_section_questions sq
	                   ON sq.id = eval.exam_section_question_id
	            JOIN rd_exam_sections sec
	                   ON sec.section_id = sq.section_id
	            JOIN rd_quiz_questions qq
	                   ON qq.question_id = sq.question_id
	            JOIN rd_exam_submission sub
	                   ON sub.submission_id = eval.submission_id
	            LEFT JOIN rd_exam_answer_keys ak
	                   ON ak.exam_section_question_id = sq.id
	                  AND ak.exam_paper_id = sub.exam_paper_id
	            WHERE sub.submission_id = :submissionId
	            ORDER BY sec.section_order, sq.display_order
	        """;

	        List<Object[]> rows = session()
	                .createNativeQuery(sql)
	                .setParameter("submissionId", submissionId)
	                .getResultList();

	        /* ================= DEBUG (OPTIONAL) ================= */
	        System.out.println("========== DAO: RAW QUERY RESULT ==========");
	        for (Object[] r : rows) {
	            System.out.println(
	                "QID=" + r[0] +
	                " | type=" + r[1] +
	                " | Q=" + r[3] +
	                " | student=" + r[7] +
	                " | model=" + r[8]
	            );
	        }
	        System.out.println("==========================================");

	        return rows.stream()
	                .map(r -> new ExamQuestionResultRow(
	                        (Number) r[0],     // questionId
	                        (String) r[1],     // questionType
	                        (String) r[2],     // sectionName
	                        (String) r[3],     // questionText
	                        (Number) r[4],     // maxMarks
	                        (Number) r[5],     // marksAwarded
	                        (String) r[6],     // feedback
	                        (String) r[7],     // studentAnswer
	                        (String) r[8]      // modelAnswer
	                ))
	                .toList();
	    }

	    @Override
	    @Transactional(readOnly = true)
	    public boolean hasStudentAnswerPdf(Integer submissionId) {

	        String sql = """
	            SELECT COUNT(*)
	            FROM rd_exam_submission_files
	            WHERE submission_id = :submissionId
	              AND file_path IS NOT NULL
	              AND file_path <> ''
	        """;

	        Number count = (Number) session()
	                .createNativeQuery(sql)
	                .setParameter("submissionId", submissionId)
	                .uniqueResult();

	        return count != null && count.intValue() > 0;
	    }

		@Override
		@Transactional(readOnly = true)
		public Object[] getExamMetaBySubmission(Integer submissionId) {

		    String sql = """
		        SELECT
		            p.title,
		            p.subject,
		            p.board,
		            p.exam_year,
		            p.exam_type,
		            p.duration_minutes,
		            p.created_at
		        FROM rd_exam_submission s
		        JOIN rd_exam_papers p
		            ON p.exam_paper_id = s.exam_paper_id
		        WHERE s.submission_id = :submissionId
		    """;

		    return (Object[]) session()
		            .createNativeQuery(sql)
		            .setParameter("submissionId", submissionId)
		            .uniqueResult();
		}


		@Override
		@Transactional(readOnly = true)
		public List<Object[]> getMcqOptions(Integer questionId) {

		    String sql = """
		        SELECT
		            o.option_text,
		            o.is_correct
		        FROM rd_quiz_options o
		        WHERE o.question_id = :qid
		        ORDER BY o.option_id
		    """;

		    return session()
		            .createNativeQuery(sql)
		            .setParameter("qid", questionId)
		            .getResultList();
		}
	
	}

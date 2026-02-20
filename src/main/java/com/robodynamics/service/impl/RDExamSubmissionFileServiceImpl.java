package com.robodynamics.service.impl;

import com.robodynamics.service.RDExamSubmissionFileService;
import java.io.File;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class RDExamSubmissionFileServiceImpl
        implements RDExamSubmissionFileService {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public File getStudentAnswerPdf(Integer submissionId) {

        String sql = """
            SELECT file_path
            FROM rd_exam_submission_files
            WHERE submission_id = :submissionId
              
            ORDER BY uploaded_at DESC
            LIMIT 1
        """;

        String path = (String) session()
                .createNativeQuery(sql)
                .setParameter("submissionId", submissionId)
                .uniqueResult();

        return (path != null) ? new File(path) : null;
    }
}

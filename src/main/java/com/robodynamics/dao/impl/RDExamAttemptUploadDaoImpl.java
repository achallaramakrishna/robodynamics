package com.robodynamics.dao.impl;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExamAttemptUploadDao;
import com.robodynamics.model.RDExamAttemptUpload;

@Repository
@Transactional
public class RDExamAttemptUploadDaoImpl implements RDExamAttemptUploadDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void save(RDExamAttemptUpload upload) {
        factory.getCurrentSession().save(upload);
    }

    @Override
    public void saveOrUpdate(RDExamAttemptUpload upload) {
        factory.getCurrentSession().saveOrUpdate(upload);
    }

    @Override
    public RDExamAttemptUpload getById(int uploadId) {
        return factory.getCurrentSession()
                .get(RDExamAttemptUpload.class, uploadId);
    }

    @Override
    public List<RDExamAttemptUpload> findByAttemptId(int attemptId) {
        String hql = "FROM RDExamAttemptUpload u " +
                     "WHERE u.attempt.attemptId = :attemptId " +
                     "ORDER BY u.uploadedAt DESC";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("attemptId", attemptId)
                .list();
    }

    /**
     * Used by OCR / AI pipeline
     */
    @Override
    public RDExamAttemptUpload findLatestByAttemptId(int attemptId) {
        String hql = "FROM RDExamAttemptUpload u " +
                     "WHERE u.attempt.attemptId = :attemptId " +
                     "ORDER BY u.uploadedAt DESC";

        Query<RDExamAttemptUpload> query =
                factory.getCurrentSession().createQuery(hql);

        query.setParameter("attemptId", attemptId);
        query.setMaxResults(1);

        return query.uniqueResult();
    }

    /**
     * Update OCR / AI processing state
     */
    @Override
    public void updateStatus(
            int uploadId,
            RDExamAttemptUpload.UploadStatus status,
            Double qualityScore,
            String qualityRemarks) {

        Session session = factory.getCurrentSession();
        RDExamAttemptUpload upload =
                session.get(RDExamAttemptUpload.class, uploadId);

        if (upload == null) return;

        upload.setUploadStatus(status);
        
        upload.setQualityScore(BigDecimal.valueOf(qualityScore));
        upload.setQualityRemarks(qualityRemarks);

        session.update(upload);
    }

    /**
     * Cleanup when attempt is reset or deleted
     */
    @Override
    public void deleteByAttemptId(int attemptId) {
        String hql = "DELETE FROM RDExamAttemptUpload u " +
                     "WHERE u.attempt.attemptId = :attemptId";

        factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("attemptId", attemptId)
                .executeUpdate();
    }
}

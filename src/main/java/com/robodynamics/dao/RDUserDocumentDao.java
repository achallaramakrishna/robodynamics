package com.robodynamics.dao;

import com.robodynamics.model.RDUserDocument;
import java.util.List;

public interface RDUserDocumentDao {
  void save(RDUserDocument doc);
  RDUserDocument findById(int docId);
  List<RDUserDocument> findByUserId(int userId);
  RDUserDocument findLatestResume(int userId); // convenience for onboarding
  void delete(int docId);
}

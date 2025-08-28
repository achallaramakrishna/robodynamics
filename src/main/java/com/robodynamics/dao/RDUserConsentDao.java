package com.robodynamics.dao;

import com.robodynamics.model.RDUserConsent;
import com.robodynamics.model.RDUserConsent.Type;
import java.util.Optional;

public interface RDUserConsentDao {
  void save(RDUserConsent consent);
  Optional<RDUserConsent> latest(int userId, Type type);
}

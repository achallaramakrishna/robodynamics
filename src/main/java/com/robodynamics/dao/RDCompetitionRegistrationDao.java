package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDCompetitionRegistration;

public interface RDCompetitionRegistrationDao {

    void save(RDCompetitionRegistration reg);

    List<RDCompetitionRegistration> findByCompetition(int competitionId);

    List<RDCompetitionRegistration> findByStudent(int studentUserId);

    RDCompetitionRegistration findById(int registrationId);

    boolean exists(int competitionId, int studentUserId);

	int countAllRegistrations();
}

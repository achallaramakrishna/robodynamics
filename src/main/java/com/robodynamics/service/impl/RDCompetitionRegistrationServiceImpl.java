package com.robodynamics.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCompetitionRegistrationDao;
import com.robodynamics.model.RDCompetitionRegistration;
import com.robodynamics.service.RDCompetitionRegistrationService;

@Service
@Transactional
public class RDCompetitionRegistrationServiceImpl implements RDCompetitionRegistrationService {

    private final RDCompetitionRegistrationDao regDao;

    public RDCompetitionRegistrationServiceImpl(RDCompetitionRegistrationDao regDao) {
        this.regDao = regDao;
    }

    @Override
    public void register(RDCompetitionRegistration registration) {
        regDao.save(registration);
    }

    @Override
    public List<RDCompetitionRegistration> findByCompetition(int competitionId) {
        return regDao.findByCompetition(competitionId);
    }

    @Override
    public List<RDCompetitionRegistration> findByStudent(int studentUserId) {
        return regDao.findByStudent(studentUserId);
    }

    @Override
    public boolean isRegistered(int competitionId, int studentUserId) {
        return regDao.exists(competitionId, studentUserId);
    }

    @Override
    public RDCompetitionRegistration findById(int registrationId) {
        return regDao.findById(registrationId);
    }

	@Override
	public int countAllRegistrations() {
		// TODO Auto-generated method stub
		return regDao.countAllRegistrations();
	}
}

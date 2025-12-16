package com.robodynamics.service.impl;

import java.util.Date;
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

	// STEP 1: After Razorpay order creation
    @Override
    public void updatePaymentOrder(
            int registrationId,
            String razorpayOrderId) {

        RDCompetitionRegistration reg =
        		regDao.findById(registrationId);

        reg.setRazorpayOrderId(razorpayOrderId);
        reg.setPaymentStatus("PENDING");

        regDao.update(reg);
    }

    // STEP 2: After signature verification
    @Override
    public void markPaymentSuccess(
            int registrationId,
            String razorpayPaymentId,
            String razorpaySignature) {

        RDCompetitionRegistration reg =
        		regDao.findById(registrationId);

        reg.setPaymentStatus("SUCCESS");
        reg.setPaymentDate(new Date());
        reg.setRazorpayPaymentId(razorpayPaymentId);
        reg.setRazorpaySignature(razorpaySignature);

        regDao.update(reg);
    }

    // STEP 3: Failure / Cancel
    @Override
    public void markPaymentFailed(int registrationId) {

        RDCompetitionRegistration reg =
        		regDao.findById(registrationId);

        reg.setPaymentStatus("FAILED");
        regDao.update(reg);
    }

    @Override
    public RDCompetitionRegistration findByRazorpayOrderId(String orderId) {
        return regDao.findByRazorpayOrderId(orderId);
    }

}

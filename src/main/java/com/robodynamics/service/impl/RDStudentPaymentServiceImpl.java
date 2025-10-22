package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDStudentPaymentDao;
import com.robodynamics.model.RDStudentPayment;
import com.robodynamics.service.RDStudentPaymentService;

@Service
@Transactional
public class RDStudentPaymentServiceImpl implements RDStudentPaymentService {

    @Autowired
    private RDStudentPaymentDao paymentDao;

    @Override
    public void save(RDStudentPayment payment) {
        paymentDao.save(payment);
    }

    @Override
    public void update(RDStudentPayment payment) {
        paymentDao.update(payment);
    }

    @Override
    public void delete(Integer paymentId) {
        paymentDao.delete(paymentId);
    }

    @Override
    public RDStudentPayment findById(Integer paymentId) {
        return paymentDao.findById(paymentId);
    }

    @Override
    public List<RDStudentPayment> findAll() {
        return paymentDao.findAll();
    }

	@Override
	public boolean existsByEnrollmentAndMonth(Integer enrollmentId, String month) {
		
		return paymentDao.existsByEnrollmentAndMonth(enrollmentId,month);
	}

	@Override
	public boolean existsForMonth(String month) {
		
		return paymentDao.existsForMonth(month);
	}
}

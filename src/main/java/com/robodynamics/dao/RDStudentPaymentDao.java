package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDStudentPayment;

public interface RDStudentPaymentDao {
    void save(RDStudentPayment payment);
    void update(RDStudentPayment payment);
    void delete(Integer paymentId);
    RDStudentPayment findById(Integer paymentId);
    List<RDStudentPayment> findAll();
	boolean existsByEnrollmentAndMonth(Integer enrollmentId, String month);
	boolean existsForMonth(String month);
}

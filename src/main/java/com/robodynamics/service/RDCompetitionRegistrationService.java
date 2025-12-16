package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDCompetitionRegistration;

public interface RDCompetitionRegistrationService {

    void register(RDCompetitionRegistration registration);

    List<RDCompetitionRegistration> findByCompetition(int competitionId);

    List<RDCompetitionRegistration> findByStudent(int studentUserId);

    boolean isRegistered(int competitionId, int studentUserId);

    RDCompetitionRegistration findById(int registrationId);
    
    int countAllRegistrations();
    
    void updatePaymentOrder(
            int registrationId,
            String razorpayOrderId
    );

    void markPaymentSuccess(
            int registrationId,
            String razorpayPaymentId,
            String razorpaySignature
    );

    void markPaymentFailed(int registrationId);
    
    RDCompetitionRegistration findByRazorpayOrderId(String orderId);


    
}

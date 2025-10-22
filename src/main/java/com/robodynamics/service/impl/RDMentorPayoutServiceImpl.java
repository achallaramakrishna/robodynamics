package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMentorPayoutDao;
import com.robodynamics.model.RDMentorPayout;
import com.robodynamics.service.RDMentorPayoutService;

@Service
@Transactional
public class RDMentorPayoutServiceImpl implements RDMentorPayoutService {

    @Autowired
    private RDMentorPayoutDao payoutDao;

    @Override
    public void save(RDMentorPayout payout) {
        payoutDao.save(payout);
    }

    @Override
    public void update(RDMentorPayout payout) {
        payoutDao.update(payout);
    }

    @Override
    public void delete(Integer payoutId) {
        payoutDao.delete(payoutId);
    }

    @Override
    public RDMentorPayout findById(Integer payoutId) {
        return payoutDao.findById(payoutId);
    }

    @Override
    public List<RDMentorPayout> findAll() {
        return payoutDao.findAll();
    }
}

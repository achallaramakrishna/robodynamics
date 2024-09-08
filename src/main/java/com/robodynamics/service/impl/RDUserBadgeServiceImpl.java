package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserBadgeDao;
import com.robodynamics.model.RDUserBadge;
import com.robodynamics.service.RDUserBadgeService;

@Service
public class RDUserBadgeServiceImpl implements RDUserBadgeService {

    @Autowired
    private RDUserBadgeDao rdUserBadgeDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDUserBadge userBadge) {
        rdUserBadgeDao.saveOrUpdate(userBadge);
    }

    @Override
    @Transactional
    public List<RDUserBadge> findByUserId(int userId) {
        return rdUserBadgeDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDUserBadge> findAll() {
        return rdUserBadgeDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDUserBadge userBadge) {
        rdUserBadgeDao.delete(userBadge);
    }
}

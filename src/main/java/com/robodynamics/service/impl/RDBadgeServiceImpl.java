package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDBadgeDao;
import com.robodynamics.model.RDBadge;
import com.robodynamics.service.RDBadgeService;

@Service
public class RDBadgeServiceImpl implements RDBadgeService {

    @Autowired
    private RDBadgeDao rdBadgeDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDBadge badge) {
        rdBadgeDao.saveOrUpdate(badge);
    }

    @Override
    @Transactional
    public RDBadge findById(int badgeId) {
        return rdBadgeDao.findById(badgeId);
    }

    @Override
    @Transactional
    public List<RDBadge> findAll() {
        return rdBadgeDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDBadge badge) {
        rdBadgeDao.delete(badge);
    }
}

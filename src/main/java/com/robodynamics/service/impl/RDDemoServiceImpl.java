package com.robodynamics.service.impl;

import com.robodynamics.dao.RDDemoDao;
import com.robodynamics.model.RDDemo;
import com.robodynamics.service.RDDemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import javax.transaction.Transactional;

@Service
public class RDDemoServiceImpl implements RDDemoService {

    @Autowired
    private RDDemoDao demoDao;

    @Override
    @Transactional
    public List<RDDemo> getUpcomingDemos() {
        return demoDao.getUpcomingDemos(); // Fetch upcoming demos from the database
    }
}

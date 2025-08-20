package com.robodynamics.service.impl;

import com.robodynamics.dao.RDBlogDao;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.service.RDBlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

import javax.transaction.Transactional;

@Service
public class RDBlogPostServiceImpl implements RDBlogPostService {

    @Autowired
    private RDBlogDao blogDao;

    @Override
    @Transactional
    public List<RDBlogPost> getBlogPosts() {
        return blogDao.getBlogPosts(); // Fetch blog posts from the database
    }
}

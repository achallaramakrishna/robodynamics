package com.robodynamics.service.impl;

import com.robodynamics.dao.RDBlogDao;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.service.RDBlogPostService;
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
        return blogDao.getBlogPosts();
    }

    @Override
    @Transactional
    public List<RDBlogPost> getAllBlogPostsForAdmin() {
        return blogDao.getAllBlogPostsForAdmin();
    }

    @Override
    @Transactional
    public RDBlogPost getBlogPostById(int postId) {
        return blogDao.getBlogPostById(postId);
    }

    @Override
    @Transactional
    public void saveOrUpdateBlogPost(RDBlogPost post) {
        blogDao.saveOrUpdateBlogPost(post);
    }

    @Override
    @Transactional
    public void deleteBlogPostById(int postId) {
        blogDao.deleteBlogPostById(postId);
    }
}

package com.robodynamics.service;

import com.robodynamics.model.RDBlogPost;
import java.util.List;

public interface RDBlogPostService {
    List<RDBlogPost> getBlogPosts();
    List<RDBlogPost> getAllBlogPostsForAdmin();
    RDBlogPost getBlogPostById(int postId);
    void saveOrUpdateBlogPost(RDBlogPost post);
    void deleteBlogPostById(int postId);
}

package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDBlogPost;

public interface RDBlogDao {
	List<RDBlogPost> getBlogPosts();

}

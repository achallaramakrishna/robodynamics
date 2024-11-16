package com.robodynamics.dao;

import com.robodynamics.model.RDMatchingCategory;
import java.util.List;

public interface RDMatchingCategoryDao {

    RDMatchingCategory getCategoryById(Long categoryId);

    List<RDMatchingCategory> getCategoriesByGameId(Long gameId);

    void saveCategory(RDMatchingCategory category);
}

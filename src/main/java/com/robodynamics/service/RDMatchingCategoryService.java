package com.robodynamics.service;

import com.robodynamics.model.RDMatchingCategory;
import java.util.List;

public interface RDMatchingCategoryService {

    RDMatchingCategory getCategoryById(Long categoryId);

    List<RDMatchingCategory> getCategoriesByGameId(Long gameId);

    void saveCategory(RDMatchingCategory category);
}

package com.robodynamics.service;

import com.robodynamics.model.RDMatchingCategory;
import java.util.List;

public interface RDMatchingCategoryService {

    RDMatchingCategory getCategoryById(int categoryId);

    List<RDMatchingCategory> getCategoriesByGameId(int gameId);

    void saveCategory(RDMatchingCategory category);
    
    void deleteCategory(int categoryId);
    
    RDMatchingCategory getFirstCategory(); 
}

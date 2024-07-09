package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDUser;

public interface RDAssetCategoryDao {
	public void saveRDAssetCategory(RDAssetCategory rdAssetCategory);

	public RDAssetCategory getRDAssetCategory(int assetCategoryId);
	
	public List < RDAssetCategory > getRDAssetCategories();
	
    public void deleteRDAssetCategory(int id);

}

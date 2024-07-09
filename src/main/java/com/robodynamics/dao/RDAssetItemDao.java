package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetItem;

public interface RDAssetItemDao {
	public void saveRDAssetItem(RDAssetItem rdAsset);

	public RDAssetItem getRDAssetItem(int assetId);
	
	public List < RDAssetItem > getRDAssetItems();
	
    public void deleteRDAssetItem(int id);

}

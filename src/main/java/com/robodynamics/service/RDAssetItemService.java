package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetItem;

public interface RDAssetItemService {
	
	public void saveRDAssetItem(RDAssetItem rdAssetItem);

	public RDAssetItem getRDAssetItem(int assetItemId);
	
	public List < RDAssetItem > getRDAssetItems();
	
    public void deleteRDAssetItem(int id);

}

package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDAsset;

public interface RDAssetService {
	
	public void saveRDAsset(RDAsset rdAsset);

	public RDAsset getRDAsset(int assetId);
	
	public List < RDAsset > getRDAssets();
	
	public List < RDAsset > getRDAssetLegos();
	
	
    public void deleteRDAsset(int id);

}

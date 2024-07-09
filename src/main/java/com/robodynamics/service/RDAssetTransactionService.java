package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;

public interface RDAssetTransactionService {
	
	public void saveRDAssetTransaction(RDAssetTransaction rdAssetTransaction);

	public RDAssetTransaction getRDAssetTransaction(int assetTransactionId);
	
	public List < RDAssetTransaction > getRDAssetTransactions();
	
	public List < RDAssetTransaction > getRDAssetTransactions(int userId);
	
    public void deleteRDAssetTransaction(int id);

}

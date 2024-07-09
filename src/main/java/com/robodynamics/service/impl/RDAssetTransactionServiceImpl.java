package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;

@Service
public class RDAssetTransactionServiceImpl implements RDAssetTransactionService {

	@Autowired
	private RDAssetTransactionDao rdAssetTransactionDao;

	@Override
	@Transactional
	public void saveRDAssetTransaction(RDAssetTransaction rdAssetTransaction) {
		rdAssetTransactionDao.saveRDAssetTransaction(rdAssetTransaction);
	}

	@Override
	public RDAssetTransaction getRDAssetTransaction(int assetTransactionId) {
		return rdAssetTransactionDao.getRDAssetTransaction(assetTransactionId);
	}

	@Override
	public List<RDAssetTransaction> getRDAssetTransactions() {
		return rdAssetTransactionDao.getRDAssetTransactions();
	}
	
	@Override
	public List<RDAssetTransaction> getRDAssetTransactions(int userId) {
		return rdAssetTransactionDao.getRDAssetTransactions(userId);
	}	

	@Override
	public void deleteRDAssetTransaction(int id) {
		rdAssetTransactionDao.deleteRDAssetTransaction(id);
		
	}
	
}

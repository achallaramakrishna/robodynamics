package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.service.RDAssetService;

@Service
public class RDAssetServiceImpl implements RDAssetService {

	@Autowired
	private RDAssetDao rdAssetDao;

	@Override
	@Transactional
	public void saveRDAsset(RDAsset rdAsset) {
		rdAssetDao.saveRDAsset(rdAsset);
		
	}

	@Override
	@Transactional
	public RDAsset getRDAsset(int assetId) {
		return rdAssetDao.getRDAsset(assetId);
	}

	@Override
	@Transactional
	public List<RDAsset> getRDAssets() {
		return rdAssetDao.getRDAssets();
	}

	@Override
	@Transactional
	public void deleteRDAsset(int id) {
		rdAssetDao.deleteRDAsset(id);
		
	}

	@Override
	@Transactional
	public List<RDAsset> getRDAssetLegos() {
		return rdAssetDao.getRDAssetLegos();
	}

}
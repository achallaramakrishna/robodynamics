package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetCategoryDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.service.RDAssetCategoryService;

@Service
public class RDAssetCategoryServiceImpl implements RDAssetCategoryService {

	@Autowired
	private RDAssetCategoryDao rdAssetCategoryDao;

	@Override
	@Transactional
	public void saveRDAssetCategory(RDAssetCategory rdAssetCategory) {
		rdAssetCategoryDao.saveRDAssetCategory(rdAssetCategory);
		
	}

	@Override
	@Transactional
	public RDAssetCategory getRDAssetCategory(int assetCategoryId) {
		return rdAssetCategoryDao.getRDAssetCategory(assetCategoryId);
	}

	@Override
	@Transactional
	public List<RDAssetCategory> getRDAssetCategories() {
		return rdAssetCategoryDao.getRDAssetCategories();
	}

	@Override
	@Transactional
	public void deleteRDAssetCategory(int id) {
		rdAssetCategoryDao.deleteRDAssetCategory(id);
		
	}

}

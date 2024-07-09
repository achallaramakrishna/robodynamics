package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetItemDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.service.RDAssetService;



import com.robodynamics.model.RDAssetItem;
import com.robodynamics.service.RDAssetItemService;

@Service
public class RDAssetItemServiceImpl implements RDAssetItemService {

	@Autowired
	private RDAssetItemDao rdAssetItemDao;

	@Override
	@Transactional
	public void saveRDAssetItem(RDAssetItem rdAssetItem) {
		rdAssetItemDao.saveRDAssetItem(rdAssetItem);
	}

	@Override
	@Transactional
	public RDAssetItem getRDAssetItem(int assetItemId) {
		return rdAssetItemDao.getRDAssetItem(assetItemId);
	}

	@Override
	@Transactional
	public List<RDAssetItem> getRDAssetItems() {
		return rdAssetItemDao.getRDAssetItems();
	}

	@Override
	@Transactional
	public void deleteRDAssetItem(int id) {
		rdAssetItemDao.deleteRDAssetItem(id);;

	}

}

package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDWorkshopDao;
import com.robodynamics.model.RDWorkshop;
import com.robodynamics.service.RDWorkshopService;

@Service
public class RDWorkshopServiceImpl implements RDWorkshopService 	{

	@Autowired
	private RDWorkshopDao rdWorkshopDao;
	
	@Override
	@Transactional
	public void saveRDWorkshop(RDWorkshop rdWorkshop) {
		rdWorkshopDao.saveRDWorkshop(rdWorkshop);
		
	}

	@Override
	@Transactional
	public RDWorkshop getRDWorkshop(int workshopId) {
		return rdWorkshopDao.getRDWorkshop(workshopId);
	}

	@Override
	@Transactional
	public List<RDWorkshop> getRDWorkshops() {
		return rdWorkshopDao.getRDWorkshops();
	}

	@Override
	@Transactional
	public void deleteRDWorkshop(int id) {
		rdWorkshopDao.deleteRDWorkshop(id);
		
	}

}

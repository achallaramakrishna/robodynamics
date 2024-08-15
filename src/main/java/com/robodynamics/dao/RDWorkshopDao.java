package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDWorkshop;


public interface RDWorkshopDao {

	public void saveRDWorkshop(RDWorkshop rdWorkshop);

	public RDWorkshop getRDWorkshop(int workshopId);
	
	public List < RDWorkshop > getRDWorkshops();
	
	public void deleteRDWorkshop(int id);
	
}

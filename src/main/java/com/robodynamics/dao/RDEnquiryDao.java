package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDUser;

public interface RDEnquiryDao {
	public void saveRDEnquiry(RDEnquiry rdEnquiry);

	public RDEnquiry getRDEnquiry(int enquiryId);
	
	public List < RDEnquiry > getRDEnquiries();
	
    public void deleteRDEnquiry(int id);

}

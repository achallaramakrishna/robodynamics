package com.robodynamics.dao;

import java.util.List;
import java.util.Optional;

import com.robodynamics.model.RDTicket;

//com.robodynamics.dao.RDTicketDAO
public interface RDTicketDao {

	RDTicket save(RDTicket t);

	Optional<RDTicket> findById(Long id);
	
	 RDTicket getByIdForView(Long id);
	    Optional<RDTicket> get(Long id);


	void delete(Long id);

	List<RDTicket> findAll(int page, int size, String status, Integer assigneeId, Integer creatorId, String q);

	long count(String status, Integer assigneeId, Integer creatorId, String q);

	List<RDTicket> findForMentor(int page, int size, String status, Integer assigneeId, Integer creatorId, String q);

	long countForMentor(String status, Integer assigneeId, Integer creatorId, String q);

}

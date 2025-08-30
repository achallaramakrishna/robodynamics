package com.robodynamics.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.robodynamics.model.RDTicket;
import com.robodynamics.model.RDUser;

//com.robodynamics.service.RDTicketService
public interface RDTicketService {
	
	Optional<RDTicket> get(Long id);
    Optional<RDTicket> getForView(Long id);

    
	RDTicket createTicket(Integer creatorUserId, String title, String desc, String category, RDTicket.Priority priority,
			LocalDateTime dueDate, Integer assigneeUserId);

	RDTicket updateTicket(Long ticketId, String title, String desc, String category, RDTicket.Priority priority,
			LocalDateTime dueDate, Integer assigneeUserId);

	void changeStatus(Long ticketId, RDTicket.Status newStatus, Integer changedByUserId);

	void addComment(Long ticketId, Integer userId, String text);


	List<RDTicket> list(int page, int size, String status, Integer assigneeId, Integer creatorId, String q);

	int count(String status, Integer assigneeId, Integer creatorId, String q);

	List<RDTicket> listScoped(int page, int size, String status, Integer assigneeId, Integer creatorId, String q,
			boolean mentorOrLogic);

	int countScoped(String status, Integer assigneeId, Integer creatorId, String q, boolean mentorOrLogic);

	boolean canView(RDTicket t, RDUser current);

	boolean canModify(RDTicket t, RDUser current); // optional, for edit/status change later

}

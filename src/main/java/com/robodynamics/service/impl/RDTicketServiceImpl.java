package com.robodynamics.service.impl;

import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDTicketDao;
import com.robodynamics.model.RDTicket;
import com.robodynamics.model.RDTicketComment;
import com.robodynamics.model.RDTicketStatusHistory;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDTicketService;
import com.robodynamics.service.RDUserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.persistence.*;

//com.robodynamics.service.impl.RDTicketServiceImpl
@Service
@Transactional
public class RDTicketServiceImpl implements RDTicketService {
	@Autowired
	private RDTicketDao ticketDAO;
	@Autowired
	private RDUserService userService; // you already have this

	@PersistenceContext
	private EntityManager em;

	@Override
	public RDTicket createTicket(Integer creatorUserId, String title, String desc, String category,
			RDTicket.Priority priority, LocalDateTime dueDate, Integer assigneeUserId) {
		RDUser creator = userService.getRDUser(creatorUserId.intValue());
		RDTicket t = new RDTicket();
		t.setTitle(title);
		t.setDescription(desc);
		t.setCategory(category);
		t.setPriority(priority);
		t.setCreatedBy(creator);
		t.setDueDate(dueDate);
		if (assigneeUserId != null) {
			RDUser assignee = userService.getRDUser(assigneeUserId.intValue());
			t.setAssignedTo(assignee);
		}
		return ticketDAO.save(t);
	}

	@Override
	public RDTicket updateTicket(Long ticketId, String title, String desc, String category, RDTicket.Priority priority,
			LocalDateTime dueDate, Integer assigneeUserId) {
		RDTicket t = ticketDAO.findById(ticketId).orElseThrow();
		t.setTitle(title);
		t.setDescription(desc);
		t.setCategory(category);
		t.setPriority(priority);
		t.setDueDate(dueDate);
		if (assigneeUserId != null) {
			RDUser assignee = userService.getRDUser(assigneeUserId.intValue());
			t.setAssignedTo(assignee);
		} else
			t.setAssignedTo(null);
		return ticketDAO.save(t);
	}

	@Override
	public void changeStatus(Long ticketId, RDTicket.Status newStatus, Integer changedByUserId) {
		RDTicket t = ticketDAO.findById(ticketId).orElseThrow();
		RDTicket.Status old = t.getStatus();
		if (old == newStatus)
			return;
		t.setStatus(newStatus);
		ticketDAO.save(t);

// history
		RDTicketStatusHistory h = new RDTicketStatusHistory();
		h.setTicket(t);
		h.setOldStatus(old);
		h.setNewStatus(newStatus);
		RDUser changer = userService.getRDUser(changedByUserId.intValue());
		h.setChangedBy(changer);
		em.persist(h);
	}

	@Override
	public void addComment(Long ticketId, Integer userId, String text) {
		RDTicket t = ticketDAO.findById(ticketId).orElseThrow();
		RDUser u = userService.getRDUser(userId.intValue());
		RDTicketComment c = new RDTicketComment();
		c.setTicket(t);
		c.setUser(u);
		c.setCommentText(text);
		em.persist(c);
	}

	@Override
	public Optional<RDTicket> get(Long id) {
		return ticketDAO.findById(id);
	}

	@Override
	public List<RDTicket> list(int page, int size, String status, Integer assigneeId, Integer creatorId, String q) {
		return ticketDAO.findAll(page, size, status, assigneeId, creatorId, q);
	}

	@Override
	public int count(String status, Integer assigneeId, Integer creatorId, String q) {
		return  Math.toIntExact(ticketDAO.count(status, assigneeId, creatorId, q));
	}

	@Override
	public List<RDTicket> listScoped(int page, int size,
	                                 String status,
	                                 Integer effAssigneeId,
	                                 Integer effCreatorId,
	                                 String q,
	                                 boolean mentorModeOrLogic) {
	    if (mentorModeOrLogic) {
	        // mentor: assignedTo = me OR createdBy = me
	        return ticketDAO.findForMentor(page, size, status, effAssigneeId, effCreatorId, q);
	    } else {
	        // admin / parent: apply filters only if non-null
	        return ticketDAO.findAll(page, size, status, effAssigneeId, effCreatorId, q);
	    }
	}

	@Override
	public int countScoped(String status,
	                        Integer effAssigneeId,
	                        Integer effCreatorId,
	                        String q,
	                        boolean mentorModeOrLogic) {
	    if (mentorModeOrLogic) {
	        return  Math.toIntExact(ticketDAO.countForMentor(status, effAssigneeId, effCreatorId, q));
	    } else {
	        return  Math.toIntExact(ticketDAO.count(status, effAssigneeId, effCreatorId, q));
	    }
	}

	@Override
	public boolean canView(RDTicket t, RDUser current) {
	    if (current == null) return false;
	    int pid = current.getProfile_id();
	    if (pid == 1 || pid == 2) return true; // admin
	    if (pid == 3) { // mentor
	        Integer me = current.getUserID();
	        boolean createdByMe  = t.getCreatedBy()!=null && me.equals(t.getCreatedBy().getUserID());
	        boolean assignedToMe = t.getAssignedTo()!=null && me.equals(t.getAssignedTo().getUserID());
	        return createdByMe || assignedToMe;
	    }
	    if (pid == 4) { // parent
	        Integer me = current.getUserID();
	        return t.getCreatedBy()!=null && me.equals(t.getCreatedBy().getUserID());
	    }
	    return false;
	}

	@Override
	public boolean canModify(RDTicket t, RDUser current) {
	    // you can tighten this if needed
	    return canView(t, current); // simple default
	}

	@Override
	public Optional<RDTicket> getForView(Long id) {
		// TODO Auto-generated method stub
		return Optional.ofNullable(ticketDAO.getByIdForView(id));
	}

}

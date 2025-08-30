package com.robodynamics.controller;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.model.RDTicket;
import com.robodynamics.model.RDTicketComment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDTicketService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/tickets")
public class RDTicketController {

    @Autowired private RDTicketService ticketService;
    @Autowired private RDUserService   userService;
    
    private List<RDUser> getAssignableUsers() {
        return userService.getRDUsers()
            .stream()
            .filter(u -> {
                int pid = u.getProfile_id();
                return pid == 1 || pid == 2 || pid == 3; // Admin(1/2) or Mentor(3)
            })
            .collect(Collectors.toList());
    }


    /* ========= List with role-scoped filters ========= */
    @GetMapping
    public String list(@RequestParam(defaultValue = "0") int page,
                       @RequestParam(defaultValue = "20") int size,
                       @RequestParam(required = false) String status,
                       // admins only; ignored for others
                       @RequestParam(required = false) Integer assigneeId,
                       @RequestParam(required = false) Integer creatorId,
                       @RequestParam(required = false) String q,
                       HttpSession session,
                       Model model) {

        // NOTE: we use "rdUser" to match the rest of your app.
        // If your session attribute is "loggedInUser", swap the key below.
        RDUser current = (RDUser) session.getAttribute("rdUser"); // <-- change here if needed

        int pid = current != null ? current.getProfile_id() : 0;
        boolean isAdmin  = (pid == 1 || pid == 2);
        boolean isMentor = (pid == 3);
        boolean isParent = (pid == 4);

        Integer effAssigneeId = null;
        Integer effCreatorId  = null;

        if (isAdmin) {
            effAssigneeId = assigneeId;     // free filter
            effCreatorId  = creatorId;
        } else if (isMentor) {
            // mentors: assigned to them OR created by them
            effAssigneeId = current != null ? current.getUserID() : null;
            effCreatorId  = current != null ? current.getUserID() : null;
        } else if (isParent) {
            // parents: only tickets they created
            effCreatorId  = current != null ? current.getUserID() : null;
        } else {
            // fallback: show nothing (invalid/unknown role)
            effCreatorId = -1;
        }

        List<RDTicket> tickets = ticketService.listScoped(page, size, status, effAssigneeId, effCreatorId, q, isMentor);
        Integer total = ticketService.countScoped(status, effAssigneeId, effCreatorId, q, isMentor);

        model.addAttribute("tickets", tickets);
        model.addAttribute("total", total);
        model.addAttribute("page", page);
        model.addAttribute("size", size);
        model.addAttribute("status", status);
        model.addAttribute("q", q);
        model.addAttribute("statuses", Arrays.asList("OPEN","IN_PROGRESS","RESOLVED","CLOSED"));

        return "tickets/list";
    }

    /* ========= View (single mapping) ========= */
    @GetMapping("/{id}")
    public String view(@PathVariable Long id, HttpSession session, Model model) {
        RDUser current = (RDUser) session.getAttribute("rdUser");

        // ✅ fetch-joined loader so associations are initialized
        RDTicket t = ticketService.getForView(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!ticketService.canView(t, current)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view this ticket");
        }

        // ---- View-model helpers (NO entities in JSP) ----
        ZoneId zone = ZoneId.of("Asia/Kolkata");

        String assigneeName = null;
        if (t.getAssignedTo() != null) {
            String fn = t.getAssignedTo().getFirstName();
            String ln = t.getAssignedTo().getLastName();
            String un = t.getAssignedTo().getUserName();
            assigneeName = (fn != null && !fn.isBlank()) ? (fn + " " + (ln == null ? "" : ln)) : un;
        }

        Date updatedAtDate = t.getUpdatedAt() == null ? null
            : Date.from(t.getUpdatedAt().atZone(zone).toInstant());
        Date createdAtDate = t.getCreatedAt() == null ? null
            : Date.from(t.getCreatedAt().atZone(zone).toInstant());
        Date dueDateDate    = t.getDueDate()    == null ? null
            : Date.from(t.getDueDate().atZone(zone).toInstant());

        // Per-comment lightweight VM (author, text, date)
        List<Map<String, Object>> commentsVm = new ArrayList<>();
        for (RDTicketComment c : t.getComments()) {
            Map<String, Object> m = new HashMap<>();
            RDUser u = c.getUser(); // (if your field is 'createdBy', use that)
            String name = null;
            if (u != null) {
                String fn = u.getFirstName();
                String ln = u.getLastName();
                String un = u.getUserName();
                name = (fn != null && !fn.isBlank()) ? (fn + " " + (ln == null ? "" : ln)) : un;
            }
            m.put("author", name);
            m.put("text", c.getCommentText());
            m.put("createdAtDate", c.getCreatedAt() == null ? null
                    : Date.from(c.getCreatedAt().atZone(zone).toInstant()));
            commentsVm.add(m);
        }

        // Attach model
        model.addAttribute("t", t); // still fine for simple scalars (title, status, etc.)
        model.addAttribute("assigneeName", assigneeName);
        model.addAttribute("updatedAtDate", updatedAtDate);
        model.addAttribute("createdAtDate", createdAtDate);
        model.addAttribute("dueDateDate", dueDateDate);
        model.addAttribute("commentsVm", commentsVm);

        model.addAttribute("priorities", RDTicket.Priority.values());
        model.addAttribute("statuses",  RDTicket.Status.values());
      //  model.addAttribute("users", userService.getRDUsers());
        model.addAttribute("assignableUsers", getAssignableUsers());

        return "tickets/view";
    }


    /* ========= Create ========= */
    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("ticket", new RDTicket());
        model.addAttribute("priorities", RDTicket.Priority.values());
        model.addAttribute("statuses",  RDTicket.Status.values());
     //   model.addAttribute("users", userService.getRDUsers()); // assignee dropdown
        model.addAttribute("assignableUsers", getAssignableUsers());

        return "tickets/form";
    }

    @PostMapping
    public String create(@RequestParam String title,
                         @RequestParam String description,
                         @RequestParam(required = false) String category,
                         @RequestParam(defaultValue = "MEDIUM") RDTicket.Priority priority,
                         @RequestParam(required = false)
                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDate,
                         @RequestParam(required = false) Integer assigneeUserId,
                         HttpSession session,
                         RedirectAttributes ra) {

        RDUser current = (RDUser) session.getAttribute("rdUser"); // <-- change if needed
        if (current == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        RDTicket t = ticketService.createTicket(
                (Integer) current.getUserID(),
                title, description, category, priority, dueDate, assigneeUserId
        );
        ra.addFlashAttribute("msg", "Ticket #" + t.getTicketId() + " created.");
        return "redirect:/tickets/" + t.getTicketId();
    }

    /* ========= Update core fields ========= */
    @PostMapping("/{id}/update")
    public String update(@PathVariable Long id,
                         @RequestParam String title,
                         @RequestParam String description,
                         @RequestParam(required = false) String category,
                         @RequestParam RDTicket.Priority priority,
                         @RequestParam(required = false)
                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDate,
                         @RequestParam(required = false) Integer assigneeUserId,
                         RedirectAttributes ra) {

        ticketService.updateTicket(id, title, description, category, priority, dueDate, assigneeUserId);
        ra.addFlashAttribute("msg", "Ticket updated.");
        return "redirect:/tickets/" + id;
    }

    /* ========= Change status ========= */
    @PostMapping("/{id}/status")
    public String changeStatus(@PathVariable Long id,
                               @RequestParam RDTicket.Status status,
                               HttpSession session,
                               RedirectAttributes ra) {

        RDUser current = (RDUser) session.getAttribute("rdUser"); // <-- change if needed
        if (current == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        ticketService.changeStatus(id, status, (Integer) current.getUserID());
        ra.addFlashAttribute("msg", "Status changed to " + status);
        return "redirect:/tickets/" + id;
    }

    /* ========= Comment ========= */
    @PostMapping("/{id}/comments")
    public String addComment(@PathVariable Long id,
                             @RequestParam String commentText,
                             HttpSession session,
                             RedirectAttributes ra) {

        RDUser current = (RDUser) session.getAttribute("rdUser"); // <-- change if needed
        if (current == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

        ticketService.addComment(id, (Integer) current.getUserID(), commentText);
        ra.addFlashAttribute("msg", "Comment added.");
        return "redirect:/tickets/" + id + "#comments";
    }
}

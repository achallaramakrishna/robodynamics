	<%@ page contentType="text/html;charset=UTF-8" %>
	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
	
	<div class="container-fluid p-3">
		
	  <h5 class="mb-3">Chat Inbox</h5>
	
	  <!-- ================= EXISTING CONVERSATIONS ================= -->
	
	  <c:if test="${empty conversations}">
	    <div class="alert alert-info">No conversations yet.</div>
	  </c:if>
	
	  <div class="list-group mb-4">
	    <c:forEach var="c" items="${conversations}">
	      <button type="button"
	              class="list-group-item list-group-item-action"
	              onclick="openConversation(${c.conversationId})">
	
	        <div class="d-flex justify-content-between">
	          <strong>
	            <c:choose>
	              <c:when test="${c.conversationType == 'GROUP'}">
	                <c:out value="${c.title}" />
	              </c:when>
	              <c:otherwise>
	                <c:out value="${c.displayName}" />
	              </c:otherwise>
	            </c:choose>
	          </strong>
	
	          <small class="text-muted">
	            <c:out value="${c.lastMessageAt != null ? c.lastMessageAt : c.createdAt}" />
	          </small>
	        </div>
	
	        <small class="text-muted">
	          <c:out value="${c.conversationType}" />
	        </small>
	      </button>
	    </c:forEach>
	  </div>
	
	  <hr/>
	
	  <!-- ================= START NEW CHAT ================= -->
	
<h6 class="mb-2">Start New Chat</h6>

<c:if test="${not empty chatUsers}">
  <form action="${pageContext.request.contextPath}/chat/start-direct"
        method="post"
        onsubmit="return startChat(this)"
        class="input-group gap-2">

    <select name="toUserId" class="form-select" required>
      <option value="">Select a person</option>
      <c:forEach var="u" items="${chatUsers}">
        <option value="${u.userID}">
          <c:out value="${u.displayName}"/>
        </option>
      </c:forEach>
    </select>

    <button type="submit" class="btn btn-primary">
      Start
    </button>
  </form>
</c:if>

	
	

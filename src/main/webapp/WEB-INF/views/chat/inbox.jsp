<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<style>
  .rd-chat-inbox {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .rd-chat-header {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    background: #ffffff;
    flex-shrink: 0;
  }

  .rd-chat-list {
    flex: 1;
    overflow-y: auto;
    background: #f8f9fa;
    padding: 8px;
  }

  .rd-chat-footer {
    padding: 12px;
    border-top: 1px solid #e5e7eb;
    background: #ffffff;
    flex-shrink: 0;
  }

  .rd-chat-item {
    border-radius: 10px;
    margin-bottom: 6px;
  }

  .rd-chat-item:hover {
    background-color: #eef2ff;
  }
</style>

<div class="rd-chat-inbox">

  <!-- ================= HEADER ================= -->
  <div class="rd-chat-header">
    <h6 class="mb-0 fw-semibold">Chat Inbox</h6>
  </div>

  <!-- ================= SCROLLABLE CHAT LIST ================= -->
  <div class="rd-chat-list">

    <c:if test="${empty conversations}">
      <div class="alert alert-info">No conversations yet.</div>
    </c:if>

    <div class="list-group list-group-flush">
      <c:forEach var="c" items="${conversations}">
        <button type="button"
                class="list-group-item list-group-item-action rd-chat-item"
                onclick="openConversation(${c.conversationId})">

          <div class="d-flex justify-content-between align-items-center">
            <strong class="text-truncate">
              <c:choose>
                <c:when test="${c.conversationType == 'GROUP'}">
                  <c:out value="${c.title}" />
                </c:when>
                <c:otherwise>
                  <c:out value="${c.displayName}" />
                </c:otherwise>
              </c:choose>
            </strong>

            <small class="text-muted ms-2">
              <c:out value="${c.lastMessageAt != null ? c.lastMessageAt : c.createdAt}" />
            </small>
          </div>

          <small class="text-muted">
            <c:out value="${c.conversationType}" />
          </small>

        </button>
      </c:forEach>
    </div>

  </div>

  <!-- ================= START NEW CHAT ================= -->
  <div class="rd-chat-footer">
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
              <c:out value="${u.displayName}" />
            </option>
          </c:forEach>
        </select>

        <button type="submit" class="btn btn-primary">
          Start
        </button>
      </form>
    </c:if>
  </div>

</div>

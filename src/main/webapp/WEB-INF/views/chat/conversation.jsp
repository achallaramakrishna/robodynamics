<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div id="conversationRoot"
     data-conversation-id="${conversationId}"
     class="container-fluid p-3">

  <button class="btn btn-link btn-sm px-0 mb-2"
          type="button"
          onclick="loadInbox()">
    ← Back to Inbox
  </button>

  <h6 class="fw-semibold mb-2">Conversation</h6>

  <!-- ================= CHAT MESSAGES ================= -->
  <div id="chatBox" class="chat-box">

    <c:forEach var="m" items="${messages}">
      <div class="msg ${m.senderUserId == currentUserId ? 'me' : ''}"
           data-id="${m.messageId}">
        <div class="bubble">
          <div><c:out value="${m.messageText}" /></div>
          <div class="meta">
            <c:choose>
              <c:when test="${m.senderUserId == currentUserId}">
                You
              </c:when>
              <c:otherwise>
                User ${m.senderUserId}
              </c:otherwise>
            </c:choose>
            • ${m.createdAt}
          </div>
        </div>
      </div>
    </c:forEach>

  </div>

  <!-- ================= MESSAGE INPUT ================= -->
  <div class="mt-3 d-flex gap-2">
    <input id="messageText"
           class="form-control"
           placeholder="Type message..."
           autocomplete="off" />
    <button type="button" class="btn btn-primary" onclick="sendMessage()">
      Send
    </button>
  </div>

</div>

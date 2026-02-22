<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<style>
  .chat-box {
    height: 420px;
    overflow-y: auto;
    background: #f8f9fa;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    padding: 12px;
  }
  .msg { display: flex; margin-bottom: 10px; }
  .msg.me { justify-content: flex-end; }
  .bubble {
    max-width: 75%;
    padding: 10px 14px;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,.08);
    font-size: .9rem;
    word-wrap: break-word;
  }
  .msg.me .bubble { background: #e7f1ff; }
  .meta {
    font-size: .72rem;
    color: #6c757d;
    margin-top: 4px;
    text-align: right;
  }
</style>

<div id="conversationRoot"
     data-conversation-id="${conversationId}"
     class="container-fluid p-0">

  <!-- ================= HEADER ================= -->
  <div class="px-3 py-2 border-bottom bg-white d-flex align-items-center gap-2">
    <button class="btn btn-link btn-sm px-0"
            type="button"
            onclick="loadInbox()">←</button>

    <!-- ✅ CHAT TITLE -->
    <div>
      <div class="fw-semibold">
        <c:out value="${conversationTitle}" />
      </div>
      <div class="small text-muted">
        <c:choose>
          <c:when test="${conversationType == 'GROUP'}">
            Group chat
          </c:when>
          <c:otherwise>
            Direct message
          </c:otherwise>
        </c:choose>
      </div>
    </div>
  </div>

  <!-- ================= CHAT MESSAGES ================= -->
  <div id="chatBox" class="chat-box">
    <c:forEach var="m" items="${messages}">
      <div class="msg ${m.senderUserId == currentUserId ? 'me' : ''}">
        <div class="bubble">
          <div><c:out value="${m.messageText}" /></div>
          <div class="meta">
            <c:choose>
              <c:when test="${m.senderUserId == currentUserId}">
                You
              </c:when>
              <c:otherwise>
                <c:out value="${conversationTitle}" />
              </c:otherwise>
            </c:choose>
            • ${m.createdAt}
          </div>
        </div>
      </div>
    </c:forEach>
  </div>

  <!-- ================= MESSAGE INPUT ================= -->
  <div class="p-3 bg-white border-top">
    <div class="input-group">
      <input id="messageText"
             class="form-control"
             placeholder="Type a message…"
             autocomplete="off"
             onkeydown="if(event.key==='Enter'){event.preventDefault();sendMessage();}" />

      <!-- 🔑 PREVENT FULL PAGE SUBMIT -->
      <button type="button"
              class="btn btn-primary"
              onclick="sendMessage()">
        Send
      </button>
    </div>
  </div>

</div>

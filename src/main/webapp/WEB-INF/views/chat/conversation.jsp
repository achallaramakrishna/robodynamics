<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Conversation</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      rel="stylesheet">

    <style>
        .chat-box {
            height: 420px;
            overflow-y: auto;
            background: #fafafa;
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 12px;
        }
        .msg {
            margin-bottom: 10px;
        }
        .msg.me {
            text-align: right;
        }
        .bubble {
            display: inline-block;
            max-width: 70%;
            padding: 8px 12px;
            border-radius: 12px;
            background: #fff;
            border: 1px solid #ddd;
        }
        .msg.me .bubble {
            background: #e6f0ff;
        }
        .meta {
            font-size: 11px;
            color: #777;
            margin-top: 3px;
        }
    </style>
</head>

<body class="p-0">

<div id="conversationRoot"
     data-conversation-id="${conversationId}"
     class="container-fluid p-3">

	<button class="btn btn-link btn-sm px-0 mb-2"
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
                    <div>
                        <c:out value="${m.messageText}" />
                    </div>

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
        <button class="btn btn-primary" onclick="sendMessage()">Send</button>
    </div>

</div>



</body>
</html>

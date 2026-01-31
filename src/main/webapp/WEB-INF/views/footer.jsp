<%@ page language="java"
         contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<style>
#rdChatLauncher {
  position: fixed;
  bottom: 24px;
  right: 24px;

  width: 56px;
  height: 56px;

  border-radius: 50%;
  border: none;

  background: linear-gradient(135deg, #0d6efd, #0b5ed7);
  color: #fff;

  font-size: 24px;
  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  z-index: 9999;

  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

#rdChatLauncher:hover {
  transform: scale(1.06);
  box-shadow: 0 8px 22px rgba(0,0,0,0.45);
}

#rdChatLauncher:active {
  transform: scale(0.96);
}

</style>
<!-- ================= FOOTER ================= -->
<footer class="pt-5 pb-4 mt-auto" style="background:#0b1c2d;color:#cfd8dc;">
  <div class="container">
    <div class="row gy-4">

      <div class="col-md-4">
        <h6 class="text-white fw-semibold">Robo Dynamics LMS</h6>
        <p class="small">
          Robo Dynamics is a Learning Management System for academics,
          coding, robotics and NEET preparation with structured mentoring.
        </p>
      </div>

      <div class="col-md-2">
        <h6 class="text-white fw-semibold">Programs</h6>
        <ul class="list-unstyled small">
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/courses">Academics</a></li>
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/courses">Coding & Robotics</a></li>
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/neet">NEET</a></li>
        </ul>
      </div>

      <div class="col-md-3">
        <h6 class="text-white fw-semibold">Platform</h6>
        <ul class="list-unstyled small">
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/platform">How it Works</a></li>
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/parents">Parent Dashboard</a></li>
          <li><a class="text-decoration-none text-light"
                 href="${pageContext.request.contextPath}/mentors">Teach with Us</a></li>
        </ul>
      </div>

      <div class="col-md-3">
        <h6 class="text-white fw-semibold">Contact</h6>
        <ul class="list-unstyled small">
          <li>📍 Bengaluru, India</li>
          <li>📞 <a class="text-decoration-none text-light"
                   href="tel:+918374377311">+91 83743 77311</a></li>
          <li>🌐 <a class="text-decoration-none text-light"
                   href="https://robodynamics.in"
                   target="_blank">robodynamics.in</a></li>
        </ul>
      </div>

    </div>

    <div class="text-center small mt-4 pt-3"
         style="border-top:1px solid rgba(255,255,255,0.1);color:#b0bec5;">
      © <%= java.time.Year.now() %> Robo Dynamics LMS. All Rights Reserved.
    </div>
  </div>
</footer>

<!-- ================= CHAT FLOAT BUTTON ================= -->
<c:if test="${not empty sessionScope.rdUser}">
  <button id="rdChatLauncher"
          title ="Chat">
    💬
  </button>
</c:if>

<!-- ================= CHAT OFFCANVAS ================= -->
<div class="offcanvas offcanvas-end"
     tabindex="-1"
     id="chatCanvas"
     style="width:380px">

  <div class="offcanvas-header">
    <h6 class="offcanvas-title">Robo Dynamics Chat</h6>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>

<div class="offcanvas-body p-0 d-flex flex-column" id="chatCanvasBody">
    <div class="text-center text-muted mt-4">Loading chat…</div>
  </div>
</div>

<!-- ================= BOOTSTRAP JS (ONCE) ================= -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script>

<!-- ================= GLOBAL CHAT JS ================= -->
<script>
  const BASE = '${pageContext.request.contextPath}';
//---- prevent duplicate messages
  const seenMessageIds = new Set();


  let chatCanvas;

  // ---- Conversation state
  let conversationId = 0;
  let currentUserId = ${sessionScope.rdUser != null ? sessionScope.rdUser.userID : 0};

  // ---- WebSocket state
  let stompClient = null;
  let stompSub = null;
  let wsConnecting = false;

  document.addEventListener('DOMContentLoaded', () => {
    chatCanvas = new bootstrap.Offcanvas('#chatCanvas');

    const launcher = document.getElementById('rdChatLauncher');
    if (launcher) {
      launcher.addEventListener('click', () => {
        chatCanvas.show();
        loadInbox();
      });
    }
  });

  // -----------------------------
  // Inbox load (HTML fragment)
  // -----------------------------
  window.loadInbox = function () {
    fetch(BASE + '/chat')
      .then(res => res.text())
      .then(html => {
        document.getElementById('chatCanvasBody').innerHTML = html;
        // optional: stop subscription when leaving conversation
        wsUnsubscribe();
      })
      .catch(err => console.error('Failed to load inbox', err));
  };

  // -----------------------------
  // Open conversation (HTML fragment + WS subscribe)
  // -----------------------------
  window.openConversation = function (cid) {
    fetch(BASE + '/chat/conversation/' + cid)
      .then(res => res.text())
      .then(html => {
        document.getElementById('chatCanvasBody').innerHTML = html;
        seedSeenMessageIdsFromDom();   // ✅ ADD THIS
        initConversation(cid);
      })
      .catch(err => console.error('Failed to open conversation', err));
  };

  // -----------------------------
  // Start direct chat (AJAX submit)
  // IMPORTANT: your controller returns redirect -> HTML fetch will follow it,
  // but fetch() usually returns the redirected HTML content.
  // -----------------------------
  window.startChat = function (form) {
    const formData = new FormData(form);

    fetch(form.action, { method: 'POST', body: formData })
      .then(res => res.text())
      .then(html => {
        const body = document.getElementById('chatCanvasBody');
        body.innerHTML = html;
        
        seedSeenMessageIdsFromDom();   // ✅ ADD THIS


        // read conversationId from conversationRoot
        const root = body.querySelector('#conversationRoot[data-conversation-id]');
        if (root && root.dataset.conversationId) {
          initConversation(Number(root.dataset.conversationId));
        } else {
          // fallback: no conversationRoot means server maybe returned inbox/errors
          wsUnsubscribe();
        }
      })
      .catch(err => console.error('startChat failed', err));

    return false;
  };

  // -----------------------------
  // Init conversation state + WS subscribe
  // -----------------------------
  function initConversation(cid) {
    conversationId = Number(cid || 0);
    if (!conversationId) return;

    wsSubscribe(conversationId);
    setTimeout(scrollBottom, 60);
  }

  // -----------------------------
  // WebSocket connect / subscribe
  // -----------------------------
  function wsConnect(cb) {
    if (stompClient && stompClient.connected) {
      cb && cb();
      return;
    }
    if (wsConnecting) return;

    wsConnecting = true;

    // SockJS endpoint is relative to contextPath => BASE + '/ws-chat'
    const socket = new SockJS(BASE + '/ws-chat');
    stompClient = Stomp.over(socket);
    stompClient.debug = null; // silence logs

    stompClient.connect({}, () => {
      wsConnecting = false;
      cb && cb();
    }, (err) => {
      wsConnecting = false;
      console.error('WS connect error', err);
    });
  }

  function wsSubscribe(cid) {
    wsConnect(() => {
      wsUnsubscribe();
      stompSub = stompClient.subscribe('/topic/conversation.' + cid, (frame) => {
        try {
          const msg = JSON.parse(frame.body);
          appendMessage(msg);
          scrollBottom();
        } catch (e) {
          console.error('WS parse error', e);
        }
      });
    });
  }

  function wsUnsubscribe() {
    if (stompSub) {
      try { stompSub.unsubscribe(); } catch (e) {}
      stompSub = null;
    }
  }

  // -----------------------------
  // Send message via WebSocket
  // -----------------------------
  window.sendMessage = function () {
    const input = document.getElementById("messageText");
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = "";

    // WS send (server will persist + broadcast)
    wsConnect(() => {
      if (!conversationId) return;

      stompClient.send("/app/chat.send", {}, JSON.stringify({
        conversationId: Number(conversationId),
        messageText: text
      }));
    });
  };

  // -----------------------------
  // UI helpers
  // -----------------------------
  function scrollBottom() {
    const box = document.getElementById("chatBox");
    if (!box) return;
    box.scrollTop = box.scrollHeight;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function seedSeenMessageIdsFromDom() {
	  seenMessageIds.clear();
	  document.querySelectorAll('#chatBox .msg[data-id]').forEach(el => {
	    const id = el.getAttribute('data-id');
	    if (id) seenMessageIds.add(String(id));
	  });
	}


  // This was missing in your file but used in poll()
 function appendMessage(m) {
  const box = document.getElementById("chatBox");
  if (!box) return;

  const mid = m.messageId != null ? String(m.messageId) : null;

  // ✅ STOP duplicates here
  if (mid && seenMessageIds.has(mid)) return;

  const sender = Number(m.senderUserId ?? 0);
  const text = m.messageText ?? "";
  const createdAt = m.createdAt ?? "";

  const wrapper = document.createElement("div");
  wrapper.className = "msg " + (sender === Number(currentUserId) ? "me" : "");
  if (mid) wrapper.setAttribute("data-id", mid);

  wrapper.innerHTML =
    '<div class="bubble">' +
      '<div>' + escapeHtml(text) + '</div>' +
      '<div class="meta">' +
        (sender === Number(currentUserId) ? "You" : "Other") +
        (createdAt ? (" • " + escapeHtml(createdAt)) : "") +
      '</div>' +
    '</div>';

  box.appendChild(wrapper);

  if (mid) seenMessageIds.add(mid); // ✅ mark seen
}

</script>

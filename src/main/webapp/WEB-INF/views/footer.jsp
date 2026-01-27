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

  <div class="offcanvas-body p-0" id="chatCanvasBody">
    <div class="text-center text-muted mt-4">Loading chat…</div>
  </div>
</div>

<!-- ================= BOOTSTRAP JS (ONCE) ================= -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- ================= GLOBAL CHAT JS ================= -->
<script>

	let pollTimer = null;

  const BASE = '${pageContext.request.contextPath}';
  let chatCanvas;

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

  function loadInbox() {
    fetch(BASE + '/chat')
      .then(res => res.text())
      .then(html => {
        document.getElementById('chatCanvasBody').innerHTML = html;
      });
  }

  // ✅ MUST BE GLOBAL
  window.openConversation = function (conversationId) {
    fetch(BASE + '/chat/conversation/' + conversationId)
      .then(res => res.text())
      .then(html => {
        document.getElementById('chatCanvasBody').innerHTML = html;
     // ✅ INIT CONVERSATION HERE (CRITICAL)
        initConversation(
          conversationId,
          ${sessionScope.rdUser.userID},
          0
        );
      });
  };

  // ✅ MUST BE GLOBAL
  // expose globally so inline onsubmit can see it
  window.startChat = function (form) {

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData
    })
    .then(res => res.text())
    .then(html => {
      const body = document.getElementById('chatCanvasBody');
      body.innerHTML = html;

      // OPTIONAL: extract conversationId if present
      const root = body.querySelector('[data-conversation-id]');
      if (root) {
        window.currentConversationId = root.dataset.conversationId;
      }
    })
    .catch(err => console.error(err));

    return false; // IMPORTANT: stops full page load
  };

	let conversationId = ${conversationId != null ? conversationId : 0};
	let currentUserId = ${currentUserId != null ? currentUserId : 0};
	let lastMessageId = ${lastMessageId != null ? lastMessageId : 0};

	function initConversation(cid, uid, lastId) {
		  conversationId = cid;
		  currentUserId = uid;
		  lastMessageId = lastId || 0;

		  // stop old poll
		  if (pollTimer) clearInterval(pollTimer);

		  // start new poll
		  pollTimer = setInterval(poll, 2500);

		  setTimeout(scrollBottom, 50);
		}

	 
	function scrollBottom() {
		  const box = document.getElementById("chatBox");
		  if (!box) return;   // 🔑 critical
		  box.scrollTop = box.scrollHeight;
		}


  scrollBottom();

  function escapeHtml(s) {
      return s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
  }

  async function sendMessage() {

      const input = document.getElementById("messageText");
      const text = input.value.trim();
      if (!text) return;

      // 1️⃣ Optimistically add message to UI
      const div = document.createElement("div");
      div.className = "msg me";

      const now = new Date().toLocaleTimeString();

      div.innerHTML =
          '<div class="bubble">' +
              '<div>' + escapeHtml(text) + '</div>' +
              '<div class="meta">You • ' + now + '</div>' +
          '</div>';

      document.getElementById("chatBox").appendChild(div);
      scrollBottom();

      input.value = "";

      // 2️⃣ Send to server
      const params = new URLSearchParams();
      params.append("messageText", text);

      try {
          await fetch(
              '${pageContext.request.contextPath}/chat/conversation/' +
              conversationId + '/send',
              {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: params.toString()
              }
          );
      } catch (e) {
          console.error("Send failed", e);
      }
  }


  async function poll() {
	  if (!conversationId || conversationId === 0) return;

	  try {
	    const res = await fetch(
	      BASE + '/chat/conversation/' +
	      conversationId + '/poll?lastMessageId=' + lastMessageId
	    );

	    if (!res.ok) return;

	    const json = await res.json();

	    if (json.success && json.messages?.length) {
	      json.messages.forEach(m => appendMessage(m));
	      lastMessageId = json.lastMessageId;
	      scrollBottom();
	    }

	  } catch (e) {
	    // silent fail
	  }
	}



</script>

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false"%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login | Robo Dynamics</title>

<link href="${pageContext.request.contextPath}/css/stylesheet.css"
	rel="stylesheet">

<style>
@import
	url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap');

:root {
	--brand-navy: #0b1f3a;
	--brand-teal: #0f766e;
	--ink-900: #0f172a;
	--ink-700: #334155;
	--ink-500: #64748b;
	--line: #dbe6ef;
	--surface: #ffffff;
}

* {
	box-sizing: border-box;
}

body {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	margin: 0;
	font-family: "Manrope", "Segoe UI", sans-serif;
	color: var(--ink-900);
	background:
		radial-gradient(900px 360px at -8% -10%, rgba(11, 31, 58, 0.18),
		transparent 58%),
		radial-gradient(780px 320px at 108% -18%, rgba(15, 118, 110, 0.2),
		transparent 56%), linear-gradient(180deg, #f3f8fc 0%, #ecf2f8 100%);
}

.login-shell {
	width: min(1120px, 95vw);
	margin: 20px auto 30px;
}

.alert-stack {
	display: grid;
	gap: 10px;
	margin-bottom: 12px;
}

.notice {
	border-radius: 12px;
	padding: 12px 14px;
	font-size: 14px;
	font-weight: 600;
	border: 1px solid transparent;
}

.notice.success {
	color: #166534;
	background: #f0fdf4;
	border-color: #86efac;
}

.notice.info {
	color: #1e3a8a;
	background: #eff6ff;
	border-color: #93c5fd;
}

.notice.error {
	color: #991b1b;
	background: #fef2f2;
	border-color: #fca5a5;
}

.login-grid {
	display: grid;
	grid-template-columns: 1.08fr 0.92fr;
	gap: 16px;
}

.brand-panel {
	background: linear-gradient(135deg, var(--brand-navy), var(--brand-teal));
	border-radius: 22px;
	padding: 26px;
	color: #f8fbff;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 16px;
	box-shadow: 0 20px 42px rgba(11, 31, 58, 0.2);
}

.brand-panel:before {
	content: "";
	position: absolute;
	width: 340px;
	height: 340px;
	right: -110px;
	top: -120px;
	border-radius: 50%;
	background: rgba(255, 255, 255, 0.14);
}

.brand-panel h1 {
	margin: 0;
	font-family: "Sora", "Segoe UI", sans-serif;
	font-size: clamp(22px, 2.2vw, 30px);
	line-height: 1.2;
	letter-spacing: -0.02em;
	position: relative;
	z-index: 1;
}

.brand-panel p {
	margin: 0;
	line-height: 1.45;
	font-size: 14px;
	color: rgba(243, 248, 255, 0.96);
	position: relative;
	z-index: 1;
}

.role-chips {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	position: relative;
	z-index: 1;
}

.role-chip {
	border: 1px solid rgba(255, 255, 255, 0.28);
	background: rgba(255, 255, 255, 0.12);
	color: #fff;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	border-radius: 999px;
	padding: 6px 10px;
}

.feature-list {
	margin: 0;
	padding-left: 18px;
	display: grid;
	gap: 8px;
	font-size: 14px;
	line-height: 1.35;
	position: relative;
	z-index: 1;
}

.feature-list li {
	color: rgba(245, 249, 255, 0.96);
}

.brand-image {
	margin-top: auto;
	border-radius: 14px;
	border: 1px solid rgba(255, 255, 255, 0.24);
	background: rgba(255, 255, 255, 0.1);
	padding: 8px;
	position: relative;
	z-index: 1;
}

.brand-image img {
	width: 100%;
	max-height: 170px;
	object-fit: cover;
	border-radius: 10px;
	display: block;
}

.auth-panel {
	background: var(--surface);
	border: 1px solid var(--line);
	border-radius: 22px;
	padding: 24px;
	box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.auth-title {
	margin: 0;
	font-family: "Sora", "Segoe UI", sans-serif;
	font-size: 27px;
	line-height: 1.2;
	color: var(--ink-900);
	letter-spacing: -0.02em;
}

.auth-subtitle {
	margin: 0;
	font-size: 14px;
	color: var(--ink-500);
}

.field-group {
	display: grid;
	gap: 7px;
}

.field-group label {
	margin: 0;
	font-size: 13px;
	font-weight: 700;
	color: var(--ink-700);
}

.field-input {
	width: 100%;
	border: 1px solid #cbd5e1;
	border-radius: 12px;
	padding: 12px 12px;
	font-size: 15px;
	color: var(--ink-900);
	background: #ffffff;
	transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
	outline: none;
	border-color: var(--brand-teal);
	box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
}

.login-btn {
	margin-top: 4px;
	width: 100%;
	border: 0;
	border-radius: 12px;
	padding: 12px 14px;
	background: linear-gradient(120deg, var(--brand-teal), #14b8a6);
	color: #ffffff;
	font-size: 15px;
	font-weight: 800;
	cursor: pointer;
	box-shadow: 0 12px 24px rgba(15, 118, 110, 0.22);
}

.quick-links {
	display: flex;
	justify-content: space-between;
	gap: 10px;
	flex-wrap: wrap;
	font-size: 13px;
	font-weight: 600;
}

.quick-links a {
	color: #0f5dc2;
	text-decoration: none;
}

.quick-links a:hover {
	text-decoration: underline;
}

.context-pill {
	display: inline-flex;
	align-items: center;
	border: 1px solid #bfdbfe;
	background: #eff6ff;
	color: #1d4ed8;
	padding: 6px 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 700;
}

@media ( max-width : 992px) {
	.login-grid {
		grid-template-columns: 1fr;
	}
	.brand-panel {
		padding: 20px;
	}
	.auth-panel {
		padding: 20px;
	}
}

@media ( max-width : 560px) {
	.login-shell {
		width: 94vw;
	}
	.auth-title {
		font-size: 24px;
	}
	.quick-links {
		flex-direction: column;
		align-items: flex-start;
	}
	.brand-image img {
		max-height: 140px;
	}
}
</style>
</head>

<body>

	<jsp:include page="header.jsp" />

	<div class="login-shell">

		<div class="alert-stack">
			<c:if test="${param.registered eq 'true'}">
				<div class="notice success">
					Parent registration successful. Please login to continue.
				</div>
			</c:if>
			<c:if test="${param.autoEnrolled eq 'true'}">
				<div class="notice info">
					Student has been auto-enrolled in an exam-prep course. Login with student credentials to start tests.
				</div>
			</c:if>
			<c:if test="${not empty error}">
				<div class="notice error">
					<strong><c:out value="${error}" /></strong>
					<c:if test="${not empty errorDetail}">
						<br>
						<small><c:out value="${errorDetail}" /></small>
					</c:if>
				</div>
			</c:if>
		</div>

		<div class="login-grid">
			<section class="brand-panel">
				<div class="role-chips">
					<span class="role-chip">Super Admin</span>
					<span class="role-chip">Robo Admin</span>
					<span class="role-chip">Parent</span>
					<span class="role-chip">Student</span>
					<span class="role-chip">Mentor</span>
				</div>
				<h1>Welcome to Robo Dynamics Learning Platform</h1>
				<p>One intelligent workspace for schools, colleges, mentoring centers, and future-ready learners.</p>
				<ul class="feature-list">
					<li>Adaptive student journeys with clear learning progression.</li>
					<li>Mentor and parent visibility with actionable performance insights.</li>
					<li>Competitive-exam and career pathways in one unified system.</li>
				</ul>
				<div class="brand-image">
					<img src="${pageContext.request.contextPath}/images/login_competitions.png" alt="Robo Dynamics Learning Experience">
				</div>
			</section>

			<section class="auth-panel">
				<c:if test="${not empty sessionScope.redirectUrl}">
					<span class="context-pill">Competition registration login</span>
				</c:if>
				<h2 class="auth-title">
					<c:choose>
						<c:when test="${not empty sessionScope.redirectUrl}">
	                        Continue to Competition Registration
	                    </c:when>
						<c:otherwise>
	                        Sign in to continue
	                    </c:otherwise>
					</c:choose>
				</h2>
				<p class="auth-subtitle">Use your assigned student, parent, mentor, or admin credentials.</p>

				<f:form action="${pageContext.request.contextPath}/login"
					method="post" modelAttribute="rdUser" autocomplete="on">

					<c:if test="${not empty sessionScope.redirectUrl}">
						<input type="hidden" name="redirect"
							value="${sessionScope.redirectUrl}" />
					</c:if>

					<div class="field-group">
						<label for="userName">User Name</label>
						<f:input id="userName" path="userName" minlength="4"
							class="field-input" autocomplete="username" />
					</div>

					<div class="field-group" style="margin-top:12px;">
						<label for="password">Password</label>
						<f:password id="password" path="password" minlength="4"
							class="field-input" autocomplete="current-password" />
					</div>

					<button type="submit" class="login-btn">Log in</button>

					<div class="quick-links" style="margin-top:14px;">
						<a
							href="${pageContext.request.contextPath}/registerParentChild?redirect=/competitions/register">
							Create Parent Account</a>
						<a href="${pageContext.request.contextPath}/forgotpassword">
							Forgot password</a>
					</div>
				</f:form>
			</section>

		</div>
	</div>

	<jsp:include page="/WEB-INF/views/footer.jsp" />

</body>
</html>

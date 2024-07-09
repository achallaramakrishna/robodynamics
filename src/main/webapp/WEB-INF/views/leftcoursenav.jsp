<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<c:set var="user" value="${sessionScope.rdUser}" />

<c:set var="userRole" value="${user.profile_id}" />


<c:if test="${userRole eq 5}">
	<div class="bg-warning col-auto col-md-2 min-vh-100">
		<div class="bg-warning p-2">

			<a
				class="d-flex text-decoration-none mt-1 align-items-center text-white">
				<span class="fs-4 d-none d-sm-inline"> Student Dashboard </span>
			</a>
			<ul class="nav nav-pills flex-column mt-4">
				<li class="nav-item"><a href="${pageContext.request.contextPath}/enrollment/listbystudent"
					class="nav-link text-white"> <i class="fs-5 fa-guage"></i> <span
						class="fs-4 d-none d-sm-inline"> Dashboard </span>

				</a></li>
				
				<li class="nav-item"><a href="${pageContext.request.contextPath}/course/slide1"
					class="nav-link text-white"> <i class="fs-5 fa-guage"></i> <span
						class="fs-4 d-none d-sm-inline"> Slide 1</span>
				</a></li>
			</ul>
		</div>
	</div>
</c:if>


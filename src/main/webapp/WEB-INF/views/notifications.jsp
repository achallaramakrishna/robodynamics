<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ page isELIgnored="false" %>

<h5 class="mb-3">Notifications</h5>

<c:forEach var="notification" items="${items}">
  <div class="card mb-2">
    <div class="card-body">
      <h5 class="card-title">${notification.title}</h5>
      <p class="card-text">${notification.body}</p>
      <a href="${notification.linkUrl}" class="btn btn-primary">View</a>
      <form method="post" action="${pageContext.request.contextPath}/manager/notifications/${notification.id}/read">
        <button type="submit" class="btn btn-outline-secondary btn-sm">Mark as read</button>
      </form>
    </div>
  </div>
</c:forEach>

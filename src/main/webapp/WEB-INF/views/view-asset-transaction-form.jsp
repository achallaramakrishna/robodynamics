<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>

<%@ page isELIgnored="false" %>
 
<!DOCTYPE html>
<html>
<head>
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
	crossorigin="anonymous">
<script
	src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
	integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp"
	crossorigin="anonymous"></script>
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
	integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/"
	crossorigin="anonymous"></script>
<meta charset="ISO-8859-1">
<title>Welcome</title>
</head>
<body>
   <jsp:include page="header.jsp" />

<div class="container-fluid">
		<div class="row flex-nowrap">
			<%@ include file="/WEB-INF/views/leftnav.jsp"%>


  <div class="col-md-offset-1 col-md-10">
  <br>
   <h2>View History</h2>
   <hr />
   
       <div class="panel panel-info">
    <div class="panel-heading">
     <div class="panel-title">View History</div>
    </div>
    <div class="panel-body">
     <table class="table table-striped table-bordered">
	 <tr>
			<th>Asset Name</th>
			<th>Asset </th>
			<th>Transaction Start Date</th>
			<th>Status</th>
			<th>Transaction End Date</th>
		</tr>
          	<c:forEach var="tempAssetTransaction" items="${assetTransactionsList}">

							<!-- construct an "update" link with customer id -->
							<c:url var="updateLink" value="/asset/updateForm">
								<c:param name="assetTransactionId" value="${tempAssetTransaction.assetTransactionId}" />
							</c:url>

							<tr>
								<td>${tempAssetTransaction.asset.assetName}</td>
								<td><img alt="Image"
									src="<c:url value="/resources/images/${tempAssetTransaction.asset.assetResources.iterator().next().assetResourceFileName}"/>" />
								</td>

								<td>${tempAssetTransaction.transactionStartDate}</td>
								<td>${tempAssetTransaction.status}</td>
								<td>${tempAssetTransaction.transactionEndDate}</td>
								<td>
									<!-- display the update link --> <a href="${updateLink}">Update</a>
								</td>

							</tr>

						</c:forEach>
     </table>

    </div>
   </div>
  </div>
  </div>

 </div>
<jsp:include page="footer.jsp" />
</body>
</html>

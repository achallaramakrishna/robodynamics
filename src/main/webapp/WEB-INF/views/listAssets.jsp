<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>


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
				<h2>Manage Assets</h2>
				<hr />

				<input type="button" value="Add Asset"
					onclick="window.location.href='showForm'; return false;"
					class="btn btn-primary" /> <br />
				<br />

				<div class="panel panel-info">
					<div class="panel-heading">
						<div class="panel-title">Assets List</div>
					</div>
					<div class="panel-body">
						<table class="table table-striped table-bordered">
							<tr>
								<th>Asset Name</th>
								<th>Asset Category</th>
								<th> Asset Quantity </th>
								<th>Asset Resource Name</th>
							</tr>
							<!-- loop over and print our asset categories -->
							<c:forEach var="tempAsset" items="${assets}">

								<!-- construct an "update" link with customer id -->
								<c:url var="updateLink" value="/asset/updateForm">
									<c:param name="assetId" value="${tempAsset.assetId}" />
								</c:url>

								<!-- construct an "delete" link with customer id -->
								<c:url var="deleteLink" value="/asset/delete">
									<c:param name="assetId" value="${tempAsset.assetId}" />
								</c:url>

								<tr>
									<td>${tempAsset.assetName}</td>
									<td>${tempAsset.assetCategory.assetCategoryName}</td>
									<td>${tempAsset.assetQuantity}</td>
									<td><img alt="Image" class="img-responsive" width="307" height="240"
										src="<c:url value="/resources/images/${tempAsset.assetResources.iterator().next().assetResourceFileName}"/>" />
									</td>
<%-- 									<td>
										<!-- display the update link --> <a href="${updateLink}">Update</a>
										| <a href="${deleteLink}"
										onclick="if (!(confirm('Are you sure you want to delete this asset?'))) return false">Delete</a>
									</td> --%>

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










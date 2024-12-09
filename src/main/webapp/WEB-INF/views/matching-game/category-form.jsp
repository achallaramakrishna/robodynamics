<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>${category.categoryId == null ? 'Add New Category' : 'Edit Category'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">

</head>
<body>
<div class="container-fluid">
	<div class="row flex-nowrap">
		<div class="col-md-offset-1 col-md-10">
			<br>
			<!-- Back button to go back to the dashboard -->
			<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
				Back to Dashboard
			</button>
			<br><br>
			<div class="panel panel-info">
				<div class="panel-heading">
					<br>
					<h2 class="my-4">${category.categoryId == null ? 'Add New Category' : 'Edit Category'}</h2>
				</div>
				<div class="panel-body">
				
								<form:form action="${pageContext.request.contextPath}/matching-game/category/save"
				           method="post"
				           enctype="multipart/form-data"
				           modelAttribute="matchingCategoryForm">
						
						
						    <!-- Hidden field for categoryId -->
						    <form:hidden path="categoryId" />
						
						    <!-- Hidden field for gameId -->
						    <form:hidden path="gameId" />
						
						    <div class="form-group">
						        <label for="categoryName">Category Name</label>
						        <form:input path="categoryName" class="form-control" />
						    </div>
						
						     <!-- Show existing image -->
					        <c:if test="${not empty existingImage}">
					            <div class="mb-3">
					                <label class="form-label">Current Image</label>
					                <div>
					                    <img src="${pageContext.request.contextPath}/resources/${existingImage}" 
					                         alt="Existing Image" class="img-thumbnail" style="max-height: 200px;">
					                </div>
					            </div>
					        </c:if>
					
					        <!-- Upload new image -->
					        <div class="mb-3">
					            <label for="imageFile" class="form-label">Upload New Image</label>
					            <form:input path="imageFile" type="file" class="form-control" />
					        </div>
													
						    <div class="form-group">
						        <button type="submit" class="btn btn-primary">
						            ${matchingCategoryForm.categoryId == 0 ? 'Add Category' : 'Update Category'}
						        </button>
						    </div>
						</form:form>

				</div>
			</div>
		</div>
	</div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>

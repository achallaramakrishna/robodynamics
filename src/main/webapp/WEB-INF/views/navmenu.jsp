<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-success">
	
		<div class="container-fluid">
		
			<a class="navbar-brand" href="#">
			<img src="${pageContext.request.contextPath}/resources/images/rdlogo.jpg"
            width="90" height="80" alt=""> 
			</a>
			<button class="navbar-toggler" type="button"
				data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent" aria-expanded="false"
				aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/register"></c:url>'>Register</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page"
						href='<c:url value="/assetcategory/list"></c:url>'>Manage
							Asset Categories</a></li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/asset/list"></c:url>'>Manage
							Assets</a></li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page"
						href='<c:url value="/coursecategory/list"></c:url>'>Manage
							Course Categories</a></li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/course/list"></c:url>'>Manage
							Courses</a></li>
										<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/courseoffering/list"></c:url>'>Manage
							Course Offerings</a></li>
				</ul>

			</div>
			<ul class="navbar-nav ml-auto ">
				<li class="nav-item"><a class="nav-link  active"
					aria-current="page" href='<c:url value="/login"></c:url>'>Logout</a>
				</li>

			</ul>


		</div>
	</nav>

</body>
</html>
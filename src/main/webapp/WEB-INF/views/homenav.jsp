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
			<img src="resources/images/rdlogo.jpg"
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
						aria-current="page" href='<c:url value="/"></c:url>'>Home</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/aboutus"></c:url>'>About US</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/membership"></c:url>'>Membership</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/enrollment"></c:url>'>Enrollment</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/sessions"></c:url>'>Sessions</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/resources"></c:url>'>Resources</a>
					</li>					
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/parentportal"></c:url>'>Parent Portal</a>
					</li>	
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/studentportal"></c:url>'>Student Portal</a>
					</li>	
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/contactus"></c:url>'>Contact Us</a>
					</li>	
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/blognews"></c:url>'>Blog / News</a>
					</li>	
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/login"></c:url>'>Login</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/register"></c:url>'>Register</a>
					</li>
					<li class="nav-item"><a class="nav-link  active"
						aria-current="page" href='<c:url value="/parent/register"></c:url>'>Signup as Parent</a>
					</li>
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
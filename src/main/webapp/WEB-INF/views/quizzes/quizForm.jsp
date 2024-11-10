<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>Robo Dynamics - Quizzes</title>
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

</head>
<body>
<jsp:include page="/header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<div class="col-md-offset-1 col-md-10">
				<br>
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>				<div class="panel panel-info">
					<div class="panel-heading">
						<br>
						<h2>Add Quiz</h2>
					</div>
					<div class="panel-body">
						<form:form action="saveQuiz" cssClass="form-horizontal"
							method="post" modelAttribute="quiz">

							<!-- need to associate this data with asset category id -->
							<form:hidden path="quizId" />

							<div class="form-group">
								<label for="quizName" class="col-md-3 control-label">Course
									Quiz Name</label>
								<div class="col-md-9">
									<form:input path="quizName" cssClass="form-control" />
								</div>
							</div>
							   <div class="mb-3">
						            <label for="category" class="form-label">Category</label>
						            <form:select path="category" cssClass="form-control">
						                <form:option value="Programming">Programming</form:option>
						                <form:option value="Math">Math</form:option>
						                <form:option value="Physics">Physics</form:option>
						                <form:option value="Physics">Robotics</form:option>
						                <form:option value="Drones">Drones</form:option>
						            </form:select>
						        </div>

							   <div class="mb-3">
						            <label for="difficulty" class="form-label">Difficulty Level</label>
						            <form:select path="difficultyLevel" cssClass="form-control">
						                <form:option value="Beginner">Beginner</form:option>
						                <form:option value="Intermediate">Intermediate</form:option>
						                <form:option value="Advanced">Advanced</form:option>
						            </form:select>
						        </div>
						        
						                                    <!-- New dropdown for grade range -->
                            <div class="mb-3">
                                <label for="gradeRange" class="form-label">Grade Range</label>
                                <form:select path="gradeRange" cssClass="form-control">
                                    <form:option value="ALL_GRADES">ALL GRADES</form:option>
                                    <form:option value="LOWER_PRIMARY_1_3">LOWER PRIMARY (1-3)</form:option>
                                    <form:option value="UPPER_PRIMARY_4_6">UPPER PRIMARY (4-6)</form:option>
                                    <form:option value="MIDDLE_SCHOOL_7_9">MIDDLE SCHOOL (7-9)</form:option>
                                    <form:option value="HIGH_SCHOOL_10_12">HIGH SCHOOL (10-12)</form:option>
                                </form:select>
                            </div>

							<br>
							<center>
									<button type="submit" class="btn btn-primary">Submit</button>
							 </center>


						</form:form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<jsp:include page="/footer.jsp" />
</body>
</html>

<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>

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
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Welcome</title>
<script>
        function copyToClipboard(link) {
            const textarea = document.createElement("textarea");
            textarea.value = link;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Registration link copied to clipboard: " + link);
        }
        function confirmDelete(competitionId) {
            if (confirm("Are you sure you want to delete this competition?")) {
                window.location.href = '/competition/' + competitionId + '/delete';
            }
        }
    </script>
</head>
<body>
	<jsp:include page="header.jsp" />
	<div class="container-fluid">
		<div class="row flex-nowrap">
			<%-- <%@ include file="/WEB-INF/views/leftnav.jsp"%>
 --%>
			<div class="col-md-offset-1 col-md-10">
				<br>
				<!-- Back button to go back to the dashboard -->
				<button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
					Back to Dashboard
				</button>
				<br><br>
				<h2 class="text-center">Manage Competitions</h2>

        <!-- Button to trigger the modal for creating a new competition -->
        <div class="text-right mb-3">
            <button class="btn btn-success" data-toggle="modal" data-target="#createCompetitionModal">Create New Competition</button>
        </div>
        
        <table class="table table-striped mt-4">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="competition" items="${competitions}">
                    <tr>
                        <td>${competition.name}</td>
                        <td>${competition.description}</td>
                        <td>${competition.category}</td>
                        <td>${competition.startDate}</td>
                        <td>${competition.endDate}</td>
                        <td>${competition.status}</td>
                        <td>
                            
                            <a href="${pageContext.request.contextPath}/competition/${competition.competition_id}/registrations" class="btn btn-primary btn-sm">View Registrations</a>
                            
                            <a href="${pageContext.request.contextPath}/competition/${competition.competition_id}/register" class="btn btn-primary btn-sm">Register</a>
                            
                            
                            
                            <button onclick="copyToClipboard('${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/competition/${competition.competition_id}/register')" class="btn btn-secondary btn-sm">Copy Link</button>
                            <button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#updateCompetitionModal${competition.competition_id}">Edit</button>
                            <button onclick="confirmDelete(${competition.competition_id})" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>

                    <!-- Modal for updating a competition -->
                    <div class="modal fade" id="updateCompetitionModal${competition.competition_id}" tabindex="-1" role="dialog" aria-labelledby="updateCompetitionModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="updateCompetitionModalLabel">Update Competition</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form:form action="/competition/update" method="post" modelAttribute="competition">
                                    <div class="modal-body">
                                        <form:hidden path="competition_id" value="${competition.competition_id}"/>
                                        <div class="form-group">
                                            <label for="name">Name</label>
                                            <form:input path="name" class="form-control" value="${competition.name}"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="category">Category</label>
                                            <form:input path="category"  class="form-control" value="${competition.category}"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="startDate">Start Date</label>
                                            <form:input type="date" path="startDate"  class="form-control" value="${competition.startDate}"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="endDate">End Date</label>
                                            <form:input type="date" path="endDate"  class="form-control" value="${competition.endDate}"/>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Update</button>
                                    </div>
                                </form:form>
                            </div>
                        </div>
                    </div>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Modal for creating a new competition -->
    <div class="modal fade" id="createCompetitionModal" tabindex="-1" role="dialog" aria-labelledby="createCompetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createCompetitionModalLabel">Create New Competition</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <form:form action="saveCompetition" method="post" modelAttribute="newCompetition">
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <form:input path="name" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <form:input path="description" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <form:input path="category" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="startDate">Start Date</label>
                            <form:input type="date" path="startDate" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="endDate">End Date</label>
                            <form:input type="date" path="endDate" class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label for="description">Status</label>
                            <form:input path="status" class="form-control"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-success">Create</button>
                    </div>
                </form:form>
            </div>
        </div>
    </div>
    
    		</div>
	</div>
	<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>


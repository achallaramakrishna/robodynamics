<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false"%>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
    integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Manage Projects</title>
</head>
<body>
    <jsp:include page="/header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
                <br>
                <!-- Back to Dashboard Button -->
                <button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                    Back to Dashboard
                </button>
                <br><br>

                <h2>Manage Projects</h2>
                <hr />

                <input type="button" value="Add Project" onclick="window.location.href='showForm'; return false;" class="btn btn-primary" />
                <br /><br />

                <!-- JSON Upload Form -->
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <h4>Upload Projects (JSON)</h4>
                    </div>
                    <div class="panel-body">
                        <form action="${pageContext.request.contextPath}/projects/uploadJson" method="post" enctype="multipart/form-data">
                            <div class="form-group">
                                <label for="file" class="form-label">Upload JSON File</label>
                                <input type="file" class="form-control" id="file" name="file" accept=".json" required>
                            </div>
                            <br>
                            <button type="submit" class="btn btn-info">Upload JSON</button>
                        </form>
                    </div>
                </div>
                <br />

                <div class="panel panel-info">
                    <div class="panel-heading">
                        <br>
                        <h2>Projects List</h2>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered">
                            <tr>
                                <th>Project Name</th>
                                <th>Grade Range</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                            <!-- Loop over and print the project details -->
                            <c:forEach var="tempProject" items="${projects}">
                                <!-- Construct "update" and "delete" links with projectId -->
                                <c:url var="updateLink" value="/projects/updateForm">
                                    <c:param name="projectId" value="${tempProject.projectId}" />
                                </c:url>
                                <c:url var="deleteLink" value="/projects/delete">
                                    <c:param name="projectId" value="${tempProject.projectId}" />
                                </c:url>
                                <tr>
                                    <td>${tempProject.projectName}</td>
                                    <td>${tempProject.gradeRange}</td>
                                    <td>${tempProject.category}</td>
                                    <td>
                                        <a href="${updateLink}">Update</a> |
                                        <a href="${deleteLink}"
                                            onclick="if (!(confirm('Are you sure you want to delete this project?'))) return false">Delete</a> |
                                        <!-- Link to open the modal for details -->
                                        <a href="#" data-bs-toggle="modal" data-bs-target="#detailsModal${tempProject.projectId}">Details</a>
                                    </td>
                                </tr>

                                <!-- Modal for project details -->
                                <div class="modal fade" id="detailsModal${tempProject.projectId}" tabindex="-1" aria-labelledby="detailsModalLabel${tempProject.projectId}" aria-hidden="true">
                                    <div class="modal-dialog modal-lg">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="detailsModalLabel${tempProject.projectId}">Project Details: ${tempProject.projectName}</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body">
                                                <p><strong>Grade Range:</strong> ${tempProject.gradeRange}</p>
                                                <p><strong>Category:</strong> ${tempProject.category}</p>
                                                <p><strong>Short Description:</strong> ${tempProject.shortDescription}</p>
                                                <p><strong>Detailed Description:</strong> ${tempProject.detailedDescription}</p>
                                                <p><strong>Difficulty Level:</strong> ${tempProject.difficultyLevel}</p>
                                                <p><strong>Estimated Duration:</strong> ${tempProject.estimatedDuration}</p>
                                                <p><strong>Materials Required:</strong></p>
                                                <ul>
                                                    <c:forEach var="material" items="${tempProject.materialsRequired.split(',')}">
                                                        <li>${material.trim()}</li>
                                                    </c:forEach>
                                                </ul>
                                                <p><strong>Steps:</strong></p>
                                                <ol>
                                                    <c:forEach var="step" items="${tempProject.steps.split(',')}">
                                                        <li>${step.trim()}</li>
                                                    </c:forEach>
                                                </ol>
                                                <p><strong>Video Link:</strong> <a href="${tempProject.videoLink}" target="_blank">${tempProject.videoLink}</a></p>
                                                <p><strong>Image Link:</strong> <a href="${tempProject.imageLink}" target="_blank">${tempProject.imageLink}</a></p>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </c:forEach>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>

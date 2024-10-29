<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>Quiz Questions Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Header Include -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h2>Manage Quiz Questions</h2>
        <hr/>

		<!-- Success/Error Message Display -->
		<c:if test="${not empty success}">
		    <div class="alert alert-success" role="alert">
		        ${success}
		    </div>
		</c:if>
		
		<c:if test="${not empty error}">
		    <div class="alert alert-danger" role="alert">
		        ${error}
		    </div>
		</c:if>

		<!-- Upload Questions JSON -->
		<div class="row mb-4">
		    <div class="col-md-6">
		        <h4>Upload Questions (JSON)</h4>
		        <form method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/quizquestions/uploadJSON">
		            <div class="mb-3">
		                <label for="jsonFile" class="form-label">Select JSON File</label>
		                <input type="file" id="jsonFile" name="file" class="form-control" required="true" accept=".json"/>
		            </div>
		            <button type="submit" class="btn btn-primary">Upload Questions</button>
		        </form>
		    </div>
		</div>

        <!-- Questions Table -->
        <h4 class="mt-5">All Questions</h4>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Question ID</th>
                    <th>Question Text</th>
                    <th>Type</th>
                    <th>Difficulty Level</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="question" items="${questions}">
                    <tr>
                        <td>${question.questionId}</td>
                        <td>${question.questionText}</td>
                        <td>${question.questionType}</td>
                        <td>${question.difficultyLevel}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/questions/edit?questionId=${question.questionId}" class="btn btn-warning btn-sm">Edit</a>
                            <a href="${pageContext.request.contextPath}/questions/delete?questionId=${question.questionId}" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this question?');">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
        
        <!-- Pagination Controls -->
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <c:if test="${currentPage > 0}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage - 1}&size=${size}" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                </c:if>

                <c:forEach var="i" begin="0" end="${totalPages - 1}">
                    <li class="page-item ${i == currentPage ? 'active' : ''}">
                        <a class="page-link" href="?page=${i}&size=${size}">${i + 1}</a>
                    </li>
                </c:forEach>

                <c:if test="${currentPage < totalPages - 1}">
                    <li class="page-item">
                        <a class="page-link" href="?page=${currentPage + 1}&size=${size}" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </c:if>
            </ul>
        </nav>
        
    </div>

    <!-- Footer Include -->
    <jsp:include page="/footer.jsp" />
</body>
</html>

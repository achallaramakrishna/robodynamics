<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <title>Map Quiz to Questions</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
    <!-- Include Header -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h1>Map Quiz to Questions</h1>
        <hr />

        <!-- Upload JSON Form -->
        <h3>Upload JSON for Quiz to Question Mapping</h3>
        <form id="uploadForm" method="post" enctype="multipart/form-data" action="${pageContext.request.contextPath}/quizzes/mapQuestions">
            <div class="mb-3">
                <label for="jsonFile" class="form-label">Upload JSON File</label>
                <input type="file" id="jsonFile" name="jsonFile" class="form-control" accept=".json" required />
            </div>
            <button type="submit" class="btn btn-primary">Upload Mapping</button>
        </form>
        <br />
        <div id="response" class="alert" style="display:none;"></div>

        <hr />

        <!-- Quizzes and Questions List (Optional Display for reference) -->
        <h3>Available Quizzes</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Quiz ID</th>
                    <th>Quiz Name</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="quiz" items="${quizzes}">
                    <tr>
                        <td>${quiz.quizId}</td>
                        <td>${quiz.quizName}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>

        <h3>Available Questions</h3>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Question ID</th>
                    <th>Question Text</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="question" items="${questions}">
                    <tr>
                        <td>${question.questionId}</td>
                        <td>${question.questionText}</td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Include Footer -->
    <jsp:include page="/footer.jsp" />

    <script>
        document.getElementById('uploadForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const fileInput = document.getElementById('jsonFile');
            if (fileInput.files.length === 0) {
                alert('Please select a JSON file to upload');
                return;
            }

            const formData = new FormData();
            formData.append('jsonFile', fileInput.files[0]);

            try {
                const response = await fetch('${pageContext.request.contextPath}/quizzes/mapQuestions', {
                    method: 'POST',
                    body: formData
                });

                const message = await response.text();
                const alertDiv = document.getElementById('response');
                alertDiv.style.display = 'block';
                alertDiv.className = response.ok ? 'alert alert-success' : 'alert alert-danger';
                alertDiv.textContent = message;
            } catch (error) {
                alert('An error occurred while uploading the file');
            }
        });
    </script>
</body>
</html>

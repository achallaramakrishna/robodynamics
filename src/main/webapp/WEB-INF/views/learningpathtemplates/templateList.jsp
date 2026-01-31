<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Manage Learning Path Templates</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
    .description-row {
        background-color: #f8f9fa;
    }
    .action-buttons {
        white-space: nowrap;
    }
    .template-image {
        max-width: 100px;
        max-height: 100px;
        object-fit: cover;
    }
</style>
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <!-- Display Success Message -->
        <c:if test="${not empty message}">
            <div class="alert alert-success" role="alert">
                ${message}
            </div>
        </c:if>

        <!-- Display Error Message -->
        <c:if test="${not empty error}">
            <div class="alert alert-danger" role="alert">
                ${error}
            </div>
        </c:if>

        <!-- Back to Dashboard Button -->
        <button class="btn btn-secondary mb-3"
            onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
            Back to Dashboard</button>

        <h1>Manage Learning Path Templates</h1>

        <!-- Add New Template Button -->
        <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addTemplateModal">
            Add New Template
        </button>

        <!-- Exam Selection Dropdown -->
        <form action="${pageContext.request.contextPath}/learningpathtemplates/list" method="get" class="mb-4">
            <div class="row">
                <div class="col-md-6">
                    <label for="examId" class="form-label">Select Exam</label>
                    <select id="examId" name="examId" class="form-control" onchange="this.form.submit()">
                        <option value="">-- Select Exam --</option>
                        <c:forEach var="exam" items="${exams}">
                            <option value="${exam.id}" ${param.examId == exam.id ? 'selected' : ''}>
                                ${exam.examName} ${exam.examYear}
                            </option>
                        </c:forEach>
                    </select>
                </div>
            </div>
        </form>

        <!-- Templates Table -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Exam</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Loop Through Templates -->
                <c:forEach var="template" items="${templates}">
                    <tr>
                        <td>${template.templateId}</td>
                        <td>${template.templateName}</td>
                        <td>
                            <!-- Description Toggle Button -->
                            <button class="btn btn-link" type="button" data-bs-toggle="collapse"
                                data-bs-target="#description${template.templateId}" aria-expanded="false"
                                aria-controls="description${template.templateId}">
                                View Description
                            </button>
                            <!-- Collapsible Description -->
                            <div class="collapse" id="description${template.templateId}">
                                <div class="card card-body">
                                    <c:out value="${template.description}" escapeXml="false" />
                                </div>
                            </div>
                        </td>
                        <td>${template.exam.examName}</td>
                        <td>
                            <!-- Display Template Image -->
                            <c:if test="${not empty template.imageUrl}">
                                <img src="${template.imageUrl}" alt="Template Image" class="template-image">
                            </c:if>
                            <c:if test="${empty template.imageUrl}">
                                <span>No Image</span>
                            </c:if>
                        </td>
                        <td class="action-buttons">
                            <!-- Update and Delete Buttons -->
                            <a href="${pageContext.request.contextPath}/learningPathTemplates/edit/${template.templateId}"
                                class="btn btn-sm btn-warning">Edit</a>
                            <a href="${pageContext.request.contextPath}/learningPathTemplates/delete/${template.templateId}"
                                class="btn btn-sm btn-danger"
                                onclick="return confirm('Are you sure you want to delete this template?');">Delete</a>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>

    <!-- Add Template Modal -->
    <div class="modal fade" id="addTemplateModal" tabindex="-1" aria-labelledby="addTemplateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form action="${pageContext.request.contextPath}/learningpathtemplates/save" method="post" enctype="multipart/form-data">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTemplateModalLabel">Add New Template</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!-- Template Name -->
                        <div class="mb-3">
                            <label for="templateName" class="form-label">Template Name</label>
                            <input type="text" class="form-control" id="templateName" name="templateName" required>
                        </div>

                        <!-- Description -->
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="4"></textarea>
                        </div>

                        <!-- Exam Selection -->
                        <div class="mb-3">
                            <label for="examId" class="form-label">Exam</label>
                            <select id="examId" name="exam.id" class="form-control" required>
                                <option value="">-- Select Exam --</option>
                                <c:forEach var="exam" items="${exams}">
                                    <option value="${exam.id}">${exam.examName} ${exam.examYear}</option>
                                </c:forEach>
                            </select>
                        </div>

                        <!-- Image Upload -->
                        <div class="mb-3">
                            <label for="image" class="form-label">Upload Image</label>
                            <input type="file" class="form-control" id="image" name="image" accept="image/*">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save Template</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Include Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Include footer JSP -->
    <jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>

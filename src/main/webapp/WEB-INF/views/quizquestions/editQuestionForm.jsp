<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <title>${question.questionId == null ? 'Create New Question' : 'Edit Question'}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <!-- Header Include -->
    <jsp:include page="/header.jsp" />

    <div class="container mt-5">
        <h2>${question.questionId == null ? 'Create New Question' : 'Edit Question'}</h2>
        <hr/>

        <!-- Form for Creating/Editing Question -->
        <f:form method="post" action="${question.questionId == null ? pageContext.request.contextPath + '/questions/save' : pageContext.request.contextPath + '/questions/update'}" modelAttribute="question">
            <div class="mb-3">
                <label for="questionText" class="form-label">Question Text</label>
                <f:input path="questionText" cssClass="form-control" id="questionText" required="true"/>
            </div>

            <div class="mb-3">
                <label for="questionType" class="form-label">Question Type</label>
                <f:select path="questionType" cssClass="form-control" id="questionType">
                    <f:option value="multiple_choice">Multiple Choice</f:option>
                    <f:option value="true_false">True/False</f:option>
                    <f:option value="fill_in_the_blank">Fill in the Blank</f:option>
                    <f:option value="short_answer">Short Answer</f:option>
                    <f:option value="long_answer">Long Answer</f:option>
                </f:select>
            </div>

            <div class="mb-3">
                <label for="difficultyLevel" class="form-label">Difficulty Level</label>
                <f:select path="difficultyLevel" cssClass="form-control" id="difficultyLevel">
                    <f:option value="Beginner">Beginner</f:option>
                    <f:option value="Intermediate">Intermediate</f:option>
                    <f:option value="Advanced">Advanced</f:option>
                    <f:option value="Expert">Expert</f:option>
                    <f:option value="Master">Master</f:option>
                </f:select>
            </div>

            <!-- Hidden field to retain question ID for editing -->
            <f:hidden path="questionId"/>

            <button type="submit" class="btn btn-success">
                ${question.questionId == null ? 'Create Question' : 'Update Question'}
            </button>
        </f:form>
    </div>

    <!-- Footer Include -->
    <jsp:include page="/footer.jsp" />
</body>
</html>

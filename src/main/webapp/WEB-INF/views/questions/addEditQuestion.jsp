<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
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
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2VinnD/C7E91j9yyk5//jjpt/"
    crossorigin="anonymous"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <!-- Include header JSP -->
    <jsp:include page="/header.jsp" />

<div class="container mt-4">
    <!-- Form for Adding/Editing Question -->
    <h2>${question.questionId == 0 ? 'Add Question' : 'Edit Question'}</h2>

    <form:form action="${pageContext.request.contextPath}/questions/save" modelAttribute="question" method="post">
        <input type="hidden" name="slideId" value="${slideId}">

        <!-- Question Text -->
        <div class="form-group mt-3">
            <label for="questionText">Question Text</label>
            <form:textarea path="questionText" class="form-control" rows="3" required="true"></form:textarea>
        </div>

        <!-- Question Type -->
        <div class="form-group mt-3">
            <label for="questionType">Question Type</label>
            <form:select path="questionType" class="form-control" id="questionType">
                <form:option value="fill_in_the_blank">Fill in the Blank</form:option>
                <form:option value="multiple_choice">Multiple Choice</form:option>
            </form:select>
        </div>

        <!-- Options (For MCQ) -->
        <div id="mcqOptions" class="form-group mt-3" style="display:none;">
            <label>Options (For MCQ)</label>
            <c:forEach var="option" items="${question.options}">
                <div class="form-group">
                    <input type="text" class="form-control" name="options[${option.optionId}].optionText" value="${option.optionText}" placeholder="Option Text" required>
                    <input type="checkbox" name="options[${option.optionId}].isCorrect" ${option.isCorrect ? 'checked' : ''}> Correct Answer
                </div>
            </c:forEach>
            <button type="button" class="btn btn-primary" id="addOption">Add Option</button>
        </div>

        <!-- Correct Answer (For Fill in the Blank) -->
        <div class="form-group mt-3" id="correctAnswerField" style="display:none;">
            <label for="correctAnswer">Correct Answer</label>
            <form:input path="correctAnswer" class="form-control" />
        </div>

        <div class="mt-4">
            <button type="submit" class="btn btn-primary">${question.questionId == 0 ? 'Add Question' : 'Save Changes'}</button>
            <a href="${pageContext.request.contextPath}/questions/list?slideId=${slideId}" class="btn btn-secondary">Cancel</a>
        </div>
    </form:form>
</div>

<script>
    $(document).ready(function () {
        // Show or hide fields based on the selected question type
        $('#questionType').change(function () {
            let questionType = $(this).val();
            if (questionType === 'multiple_choice') {
                $('#mcqOptions').show();
                $('#correctAnswerField').hide();
            } else if (questionType === 'fill_in_the_blank') {
                $('#mcqOptions').hide();
                $('#correctAnswerField').show();
            }
        }).trigger('change'); // Trigger change on page load based on the selected type

        // Add new option for MCQ
        $('#addOption').click(function () {
            let optionHtml = '<div class="form-group">' +
                '<input type="text" class="form-control" name="options[new].optionText" placeholder="Option Text" required>' +
                '<input type="checkbox" name="options[new].isCorrect"> Correct Answer' +
                '</div>';
            $('#mcqOptions').append(optionHtml);
        });
    });
</script>

</body>
</html>

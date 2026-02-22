<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
    
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    

<meta charset="UTF-8">
<title>Assignment Show</title>

<!-- Custom Styles -->
<style>
    body {
        background-color: #f3f4f6;
        font-family: 'Comic Sans MS', cursive, sans-serif;
    }

    .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
        animation: fadeIn 1s;
    }

    h2 {
        color: #ff6f61;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
    }

    .assignment-description {
        font-size: 18px;
        color: #34495e;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    /* Monaco Editor Styling */
    #editor {
        height: 400px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .submit-btn, .run-btn {
        font-size: 18px;
        padding: 10px 20px;
        border-radius: 10px;
        margin: 5px;
    }

    .submit-btn {
        background-color: #2ecc71;
        border-color: #2ecc71;
    }

    .submit-btn:hover {
        background-color: #27ae60;
    }

    .run-btn {
        background-color: #3498db;
        border-color: #3498db;
    }

    .run-btn:hover {
        background-color: #2980b9;
    }

    .output-section {
        margin-top: 20px;
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        display: none;
    }

    .output-section pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .nav-buttons {
        text-align: center;
        margin-top: 20px;
    }

    .nav-buttons button {
        margin: 5px;
        font-size: 18px;
        padding: 10px 20px;
        border-radius: 10px;
    }

    .btn-primary {
        background-color: #3498db;
        border-color: #3498db;
    }

    .btn-primary:disabled {
        background-color: #bdc3c7;
        border-color: #bdc3c7;
    }

</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.js"></script>
</head>
<body>
<div class="container-fluid">
    <h2 class="animated-title">📘 ${assignment.assignmentTitle} 📘</h2>

    <!-- Assignment Description -->
    <div class="assignment-description">
        <p>${assignment.description}</p>
    </div>

    <!-- Monaco Editor -->
    <div id="editor"></div>

	<!-- Run and Submit Buttons -->
	<div class="text-center">
	    <form id="assignmentForm" method="post">
	        <input type="hidden" name="assignmentId" value="${assignment.assignmentId}">
	        <input type="hidden" name="sessionDetailId" value="${sessionDetailId}">
	        <input type="hidden" name="languageId" id="languageId" value="63"> 
	        <textarea id="editor-content" name="code" style="display:none;"></textarea>
	
	        <button type="button" class="run-btn" id="run-code">Run Code</button>
	        <button type="button" class="submit-btn" id="submit-code">Submit Code</button>
	    </form>
	</div>

	<!-- Output Section -->
	<div class="output-section" id="output-section">
	    <h5>Code Output</h5>
	    <pre id="output"></pre>
	</div>
    
    <!-- Navigation Buttons -->
    <div class="nav-buttons">
        <form action="${pageContext.request.contextPath}/sessiondetail/navigateAssignments" method="post" class="d-inline">
            <input type="hidden" name="currentAssignment" value="${currentAssignment}">
            <input type="hidden" name="sessionDetailId" value="${sessionDetailId}">
            <button type="submit" name="direction" value="prev" class="btn btn-primary" ${currentAssignment == 0 ? 'disabled' : ''}>◀ Prev</button>
            <button type="submit" name="direction" value="next" class="btn btn-primary" ${currentAssignment == assignmentCount - 1 ? 'disabled' : ''}>Next ▶</button>
        </form>
    </div>
</div>

<script>
    // Initialize Monaco Editor
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        var editor = monaco.editor.create(document.getElementById('editor'), {
            value: "// Write your code here\nconsole.log('Hello World');",
            language: 'javascript', // Change this to the desired language
            theme: 'vs-dark',  // Set the dark theme
            automaticLayout: true
        });

        // Capture editor content before form submission
        document.getElementById('assignmentForm').addEventListener('submit', function() {
            document.getElementById('editor-content').value = editor.getValue();
        });

        // Run Code Button (unchanged)
        document.getElementById('run-code').addEventListener('click', function() {
            var code = editor.getValue();
            
            $.post('${pageContext.request.contextPath}/sessiondetail/executeCode', 
            { code: code, languageId: $('#languageId').val() }, 
            function(response) {
                document.getElementById('output').textContent = "Running the code...\nOutput: " + response;
            }).fail(function() {
                document.getElementById('output').textContent = "Error: Unable to execute code.";
            });

            document.getElementById('output-section').style.display = 'block';
        });

        // Submit Code Button
     // Submit Code Button
     // Submit Code Button
        document.getElementById('submit-code').addEventListener('click', function() {
            var code = editor.getValue();
            var assignmentId = $('input[name="assignmentId"]').val();
            var sessionDetailId = $('input[name="sessionDetailId"]').val();
            var languageId = $('#languageId').val();

            // AJAX call for code submission
            $.ajax({
                url: '${pageContext.request.contextPath}/sessiondetail/submitAssignment',  // URL for form submission
                type: 'POST',
                data: {
                    code: code,
                    assignmentId: assignmentId,
                    sessionDetailId: sessionDetailId,
                    languageId: languageId
                },
                success: function(response) {
                    // Correctly access the JSON response from the server
                    document.getElementById('output').textContent = "Submission successful: " + response.resultMessage;
                    if (response.output) {
                        document.getElementById('output').textContent += "\nOutput: " + response.output;
                    }
                },
                error: function() {
                    document.getElementById('output').textContent = "Error: Unable to submit code.";
                }
            });

            // Display output section
            document.getElementById('output-section').style.display = 'block';
        });

    });
</script>
</body>
</html>

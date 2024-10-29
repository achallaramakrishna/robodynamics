<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

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
    
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Fun Quiz Time!</title>

<script type="text/javascript">
    // Ensure the DOM is fully loaded before executing this script
    
     $(document).ready(function () {
        console.log("DOM fully loaded and parsed.");

        // Get the current question ID from the hidden input
        let currentQuestionId = $('#currentQuestionId').val();
		
		

        
        // Fetch and render the options dynamically
        fetchMultipleChoiceOptions(currentQuestionId);
        fetchTrueFalseOptions(currentQuestionId);

        // Function to fetch options using AJAX and render them
        function fetchMultipleChoiceOptions(questionId) {
            console.log('Selected question ID:', questionId); // Log the selected question ID for debugging

            // Perform an AJAX GET request to fetch the question options
            $.getJSON('${pageContext.request.contextPath}/quizzes/getQuestionOptions', { questionId: questionId }, function (data) {
                console.log('Received data:', data); // Log the received data to inspect it

                // Build the HTML for the radio buttons
                let radioHtml = '';
                $.each(data.options, function (index, option) {
                    console.log('Option ID:', option.optionId, ', Option Text:', option.optionText); // Log each option for debugging
                    radioHtml += '<li>' +
                    '<label>' +
                    '<input type="radio" name="question_' + questionId + '_answer" value="' + option.optionId + '">' + 
                       ' ' + option.optionText +
                    '</label>' +
                    '</li>';
                });

                // Update the HTML content inside the container
                $('#radioContainer').html(radioHtml);
            }).fail(function (jqxhr, textStatus, error) {
                console.error('Error fetching question options:', textStatus, error); // Log any errors
            });
        }
        
        
        // Function to render True/False radio buttons with values correctly set
        function fetchTrueFalseOptions(questionId) {
            console.log('Selected question ID for True/False:', questionId);
            
            let radioHtml = 
                '<ul id="trueFalseContainer" class="list-unstyled">' +
                    '<li>' +
                        '<label>' +
                            '<input type="radio" name="question_' + questionId + '_answer" value="true"> True' +
                        '</label>' +
                    '</li>' +
                    '<li>' +
                        '<label>' +
                            '<input type="radio" name="question_' + questionId + '_answer" value="false"> False' +
                        '</label>' +
                    '</li>' +
                '</ul>';
            console.log(radioHtml);
            $('#trueFalseContainer').html(radioHtml);
        }

    });
    
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM fully loaded and parsed.");

        // Capture the start time when the page loads
        var startTime = new Date().toISOString();
        document.getElementById("startTime").value = startTime;

        // Clear all form data on page load to prevent browser autocomplete from filling it in
        document.querySelectorAll('input[type="radio"], input[type="text"]').forEach(input => {
            input.checked = false;
            input.value = '';
        });

        // Verify that the element exists before proceeding
        var editorElement = document.getElementById('editor');
        if (!editorElement) {
            console.error("Editor element not found. Please check if the element with ID 'editor' exists in the HTML.");
            return;
        }

        // Initialize Monaco Editor only after confirming the element exists
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs' }});

        require(['vs/editor/editor.main'], function() {
            console.log("Monaco Editor loaded.");
            var editor = monaco.editor.create(editorElement, {
                value: `// Write your code here
class Main {
public static void main(String[] args) {
	System.out.println("hello world");
	}
}`,
                language: 'java', // Set this dynamically based on the question
                theme: 'vs-dark',
                automaticLayout: true
            });

            // Capture editor content before form submission
            document.querySelector('form').addEventListener('submit', function() {
            	var editorContent = editor.getValue();
                console.log("Editor Content Before Submit:", editorContent); // Debugging
                document.getElementById('editor-content').value = editorContent;
            });

            // Run Code Button: Define event listener to execute code
            var runButton = document.getElementById('run-code');
            if (runButton) {
                runButton.addEventListener('click', function() {
                    console.log("Run Code button clicked.");
                    var code = editor.getValue();
                    console.log("Code to execute:", code);

                    // Make an AJAX call to execute the code
					$.ajax({
					   url: '${pageContext.request.contextPath}/quizzes/executeCode',
					   type: 'POST',
					   data: {
					       code: code,
					       languageId: $('#languageId').val()
					   },
					   success: function(response) {
					       console.log("Code execution response:", response);
					       document.getElementById('output').textContent = "Running the code...\nOutput: " + response;
					   },
					   error: function() {
					       console.error("Failed to execute code.");
					       document.getElementById('output').textContent = "Error: Unable to execute code.";
					   }
					});

                    document.getElementById('output-section').style.display = 'block';
                });
            } else {
                console.error("Run Code button not found.");
            }
        });
    });
</script>



<style>
    body {
        font-family: 'Comic Sans MS', cursive, sans-serif;
        background-color: #fdfd96; /* Soft yellow background */
        padding: 20px;
    }

    .quiz-container {
        background-color: #ffebcd; /* Light beige background */
        padding: 30px;
        border-radius: 20px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    }

    h2 {
        color: #FF6347; /* Bright coral color */
        text-align: center;
        font-weight: bold;
    }

    h4 {
        color: #FF4500; /* Vibrant orange-red color */
    }

    .form-group label {
        font-weight: bold;
        color: #008080; /* Teal color */
    }

    .form-control {
        width: 50%; /* Smaller width for the input */
        margin: 10px auto; /* Center the input and give margin for spacing */
    }

    .btn-primary, .btn-secondary, .btn-success {
        font-size: 1.2em;
        font-weight: bold;
        padding: 10px 20px;
        margin: 10px 5px; /* Add margins to separate the buttons */
    }

    .btn-primary:hover, .btn-secondary:hover, .btn-success:hover {
        background-color: #FF4500;
    }

    .list-unstyled {
        list-style: none;
        padding: 0;
    }

    .list-unstyled li {
        background-color: #fff;
        border: 2px solid #fdfd96; /* Match the background */
        border-radius: 10px;
        margin-bottom: 15px;
        padding: 15px;
        transition: background-color 0.3s ease-in-out;
    }

    .list-unstyled li:hover {
        background-color: #d4edda; /* Light green to indicate selection */
    }
    
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
    
</style>
<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.30.1/min/vs/loader.js"></script>

</head>

<body class="container">
    <div class="quiz-container">
        <h2>🎉 Let's Take a Fun Quiz! 🎉</h2>
        <h4 class="mt-5">Quiz: ${quiz.quizName}</h4>

        <form action="${pageContext.request.contextPath}/quizzes/navigate" method="post" autocomplete="off">
            <input type="hidden" name="quizId" value="${quiz.quizId}" />
            <input type="hidden" id="currentQuestionId" name="currentQuestionId" value="${currentQuestion.questionId}" />
            <input type="hidden" name="currentQuestionIndex" value="${currentQuestionIndex}" />
            <input type="hidden" id="startTime" name="startTime" value="" />

            <!-- Render only the current question -->
            <div class="mt-4">
                <h4>Question ${currentQuestion.questionId}: ${currentQuestion.questionText} ❓</h4>

                <!-- Check the question type -->
                <c:choose>
					<c:when test="${currentQuestion.questionType == 'multiple_choice'}">
					    <ul id="radioContainer" class="list-unstyled"></ul>
					</c:when>
					
                    <c:when test="${currentQuestion.questionType == 'true_false'}">
                        <ul id="trueFalseContainer" class="list-unstyled"></ul>
                    </c:when>


						<c:when test="${currentQuestion.questionType == 'fill_in_the_blank'}">
						    <div class="form-group mt-3">
						        <label for="question_${currentQuestion.questionId}_answer">Fill in the blank:</label>
						        <input type="text" class="form-control text-center"
						               name="question_${currentQuestion.questionId}_answer"
						               value="${selectedAnswers[currentQuestion.questionId]}" 
						               placeholder="Type your answer here!" />
						    </div>
						</c:when>
    					<c:when test="${currentQuestion.questionType == 'short_answer'}">
						    <div class="form-group mt-3">
						        <label for="question_${currentQuestion.questionId}_answer">🌟 Short Answer: 🌟</label>
						        <textarea class="form-control text-center"
						                  name="question_${currentQuestion.questionId}_answer" rows="3"
						                  placeholder="Type your short answer here!" autocomplete="off">
						            ${selectedAnswers[currentQuestion.questionId]}
						        </textarea>
						    </div>
						</c:when>

<c:when test="${currentQuestion.questionType == 'long_answer'}">
    <div class="form-group mt-3">
        <div class="text-center">
            <label for="question_${currentQuestion.questionId}_answer">🌟 Long Answer: 🌟</label>
            <textarea class="form-control text-center"
                      name="question_${currentQuestion.questionId}_answer" rows="15"
                      style="width: 90%;"
                      placeholder="Type your detailed answer here!" autocomplete="off">
                ${selectedAnswers[currentQuestion.questionId]}
            </textarea>
        </div>
    </div>
</c:when>
					<c:when test="${currentQuestion.questionType == 'coding'}">
						<div class="form-group mt-3">
							<label for="question_${currentQuestion.questionId}_answer">💻
								Coding Challenge: 💻</label>
							<div id="editor"
								style="height: 400px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 20px;"></div>
							<input type="hidden" name="languageId" id="languageId" value="62"> 
							
							<textarea id="editor-content"
								name="question_${currentQuestion.questionId}_answer"
								style="display: none;"></textarea>
							<button type="button" class="run-btn" id="run-code">Run Code</button>
							
						</div>
						<!-- Output Section -->
							<div class="output-section" id="output-section">
								<h5>Code Output</h5>
								<pre id="output"></pre>
							</div>
					</c:when>


				</c:choose>
            </div>

            <!-- Navigation buttons -->
            <div class="mt-4 text-center">
                <c:if test="${currentQuestionIndex > 0}">
                    <button type="submit" name="action" value="previous" class="btn btn-secondary">⬅️ Go Back</button>
                </c:if>
                
                <c:if test="${currentQuestionIndex < totalQuestions - 1}">
                    <button type="submit" name="action" value="next" class="btn btn-primary">Next ➡️</button>
                </c:if>
                
                <c:if test="${currentQuestionIndex == totalQuestions - 1}">
                    <button type="submit" name="action" value="submit" class="btn btn-success">Finish Quiz 🎯</button>
                </c:if>
            </div>
        </form>
    </div>
</body>
</html>

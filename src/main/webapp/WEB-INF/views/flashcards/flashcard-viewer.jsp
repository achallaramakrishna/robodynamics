<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>

<!DOCTYPE html>
<html>
<head>
    <title>Flashcard Viewer</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            margin: 0;
            overflow-x: hidden;
            background-color: #d1f7c4;
            font-family: Arial, sans-serif;
        }

        /* ===== LEARNING HEADER ===== */
        .learning-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background: #003366;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 1000;
            font-size: 14px;
        }

        .learning-header a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
        }

        /* ===== FLASHCARD WRAPPER ===== */
		.flashcard-wrapper {
		    min-height: calc(100vh - 90px);
		    display: flex;
		    flex-direction: column;
		    align-items: center;
		    justify-content: flex-start;
		
		    margin-top: 50px;      /* ⬅ EXACT HEADER HEIGHT */
		    padding-top: 20px;     /* ⬅ extra breathing space */
		    padding-bottom: 0;
		}




        /* ===== FLASHCARD ===== */
        .flashcard {
            width: 650px;
            max-width: 95%;
            height: 420px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            transform-style: preserve-3d;
            perspective: 1000px;
            transition: transform 0.8s;
            cursor: pointer;
            position: relative;
        }

        .flashcard.is-flipped {
            transform: rotateY(180deg);
        }

        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            backface-visibility: hidden;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .front {
            background: #003366;
            color: #fff;
            font-size: 1.4em;
            font-weight: 600;
        }

        .back {
            background: #f9fafb;
            color: #333;
            transform: rotateY(180deg);
        }

        .question-image,
        .answer-image {
            max-height: 200px;
            max-width: 100%;
            object-fit: contain;
            margin-top: 12px;
            background: #f8f9fa;
            padding: 6px;
            border-radius: 8px;
        }

        .answer-section {
            font-size: 1.3em;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }

        .example {
            background: #e0f2fe;
            color: #1d4ed8;
            padding: 8px;
            border-radius: 8px;
            margin-top: 8px;
            font-weight: bold;
            width: 100%;
        }

        .insight {
            background: #fee2e2;
            color: #dc2626;
            padding: 8px;
            border-radius: 8px;
            margin-top: 8px;
            font-weight: bold;
            width: 100%;
        }

        .flip-text {
            font-size: 0.85em;
            color: #d1d5db;
            margin-top: 8px;
            font-style: italic;
        }

        /* ===== CONTROLS ===== */
        .controls {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            width: 260px;
            font-size: 22px;
        }

        .controls button {
            background: none;
            border: none;
            color: #003366;
            font-weight: bold;
            cursor: pointer;
        }

        .controls button:disabled {
            color: #9ca3af;
        }

        /* ===== FOOTER ===== */
        .learning-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 28px;
            line-height: 28px;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            color: #374151;
        }

        /* ===== MOBILE OPTIMIZATION ===== */
        @media (max-width: 576px) {
            .flashcard {
                height: 440px;
            }
            .front {
                font-size: 1.2em;
            }
            .answer-section {
                font-size: 1.15em;
            }
        }
    </style>
</head>

<body>

<!-- ===== LEARNING HEADER ===== -->
<div class="learning-header">
    <a href="${pageContext.request.contextPath}/dashboard">← Exit</a>
    <div>Flashcards</div>
    <div>${currentFlashcardIndex + 1} / ${totalFlashcards}</div>
</div>

<div class="flashcard-wrapper">

    <c:if test="${not empty error}">
        <div class="alert alert-danger">${error}</div>
    </c:if>

    <c:if test="${currentFlashcard != null}">
        <div class="flashcard" id="flashcard" onclick="toggleFlip()">

            <!-- FRONT -->
            <div class="card-face front">
                <div>${currentFlashcard.question}</div>

                <c:if test="${not empty currentFlashcard.questionImageUrl}">
                    <img src="${pageContext.request.contextPath}${currentFlashcard.questionImageUrl}"
					     class="answer-image"
					     alt="Answer Image">
                </c:if>

                <div class="flip-text">Tap to flip</div>
            </div>

            <!-- BACK -->
            <div class="card-face back">
                <div class="answer-section">
                    ${currentFlashcard.answer}
                </div>

                <c:if test="${not empty currentFlashcard.answerImageUrl}">
                    <img src="${pageContext.request.contextPath}${currentFlashcard.answerImageUrl}"
					     class="answer-image"
					     alt="Answer Image">

                </c:if>

                <c:if test="${not empty currentFlashcard.example}">
                    <div class="example">
                        Example: ${currentFlashcard.example}
                    </div>
                </c:if>

                <c:if test="${not empty currentFlashcard.insight}">
                    <div class="insight">
                        ${currentFlashcard.insightType}: ${currentFlashcard.insight}
                    </div>
                </c:if>
            </div>

        </div>
    </c:if>

    <!-- ARROW CONTROLS -->
    <div class="controls">
        <button onclick="navigateFlashcard('previous')"
                <c:if test="${currentFlashcardIndex == 0}">disabled</c:if>>
            ⬅
        </button>

        <button onclick="navigateFlashcard('next')"
                <c:if test="${currentFlashcardIndex == totalFlashcards - 1}">disabled</c:if>>
            ➡
        </button>
    </div>

</div>

<!-- ===== LEARNING FOOTER ===== -->
<div class="learning-footer">
    Tap = Flip | ⬅ Prev | ➡ Next
</div>

<script>
    function toggleFlip() {
        document.getElementById('flashcard').classList.toggle('is-flipped');
    }

    function navigateFlashcard(direction) {
        const currentIndex = parseInt("${currentFlashcardIndex}");
        const flashcardSetId = "${flashcardSetId}";
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex < 0 || newIndex >= parseInt("${totalFlashcards}")) return;

        window.location.href =
            `${pageContext.request.contextPath}/flashcards/view?index=` +
            newIndex + `&flashcardSetId=${flashcardSetId}`;
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") navigateFlashcard('previous');
        if (e.key === "ArrowRight") navigateFlashcard('next');
        if (e.key === " ") {
            e.preventDefault();
            toggleFlip();
        }
    });
</script>

</body>
</html>

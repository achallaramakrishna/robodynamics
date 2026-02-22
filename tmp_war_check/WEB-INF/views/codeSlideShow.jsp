<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<html>
<head>
<%@ page isELIgnored="false"%>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
        integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
        integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<meta charset="UTF-8">
<title>Slide Show</title>

<!-- Custom Styles -->
<style>
    body {
        background-color: #f3f4f6;
        font-family: 'Comic Sans MS', cursive, sans-serif; /* Playful font */
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

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    h2 {
        color: #ff6f61;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
    }

    .slide-image {
        display: block;
        margin: 0 auto 20px;
        max-width: 100%;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .content-box {
        margin-top: 20px;
        padding: 20px;
        background: linear-gradient(135deg, #f6d365, #fda085); /* Fun gradient background */
        border-radius: 15px;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
    }

    p {
        font-size: 18px;
        line-height: 1.5;
        color: #34495e;
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

    .animated-title {
        font-size: 30px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        color: #FF6347;
        text-align: center;
        text-shadow: 2px 2px #FFD700;
        animation: bounceIn 1s ease-out;
    }
</style>

</head>
<body>
    <div class="container-fluid">
        <h2 class="animated-title">✨ ${slide.title} ✨</h2>

        <!-- Slide Container -->
        <div class="slide-container" style="display: flex; align-items: center; justify-content: center;">
            <!-- Check if the image URL is not empty -->
            <c:if test="${not empty slide.imageUrl}">
                <div class="image-container" style="padding: 20px; border-radius: 10px; margin-right: 20px;">
                    <img src="${pageContext.request.contextPath}/assets/images/${slide.imageUrl}" alt="Slide Image" class="slide-image">
                </div>
            </c:if>

            <!-- Slide Content -->
            <div class="content-box" style="<c:if test='${empty slide.imageUrl}'>width: 100%;</c:if>">
                <p>${slide.content}</p>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="nav-buttons">
            <form action="${pageContext.request.contextPath}/sessiondetail/navigate" method="post" class="d-inline">
                <input type="hidden" name="currentSlide" value="${currentSlide}" />
                <input type="hidden" name="sessionDetailId" value="${sessionDetailId}" />
                <button type="submit" name="direction" value="prev" class="btn btn-primary" ${currentSlide == 0 ? 'disabled' : ''}>◀ Prev</button>
                <button type="submit" name="direction" value="next" class="btn btn-primary" ${currentSlide == slideCount - 1 ? 'disabled' : ''}>Next ▶</button>
            </form>
        </div>
    </div>
</body>
</html>

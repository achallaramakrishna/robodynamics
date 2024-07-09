<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>RoboDynamics | Membership</title>
	<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
	crossorigin="anonymous" />
<link rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
	integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
	crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link href="${pageContext.request.contextPath}/resources/css/membership.css" rel="stylesheet">
</head>
<body>

   <%@ include file="/WEB-INF/views/showHeader.jsp" %>

     <section>
      <center>
        <div class="pricing pricing-palden">
            <div class="pricing-item features-item ja-animate" data-animation="move-from-bottom" data-delay="item-0" style="min-height: 497px;">
                <div class="pricing-deco">
                    <svg class="pricing-deco-img" enable-background="new 0 0 300 100" height="100px" id="Layer_1" preserveAspectRatio="none" version="1.1" viewBox="0 0 300 100" width="300px" x="0px" xml:space="preserve" y="0px">
                        <path class="deco-layer deco-layer--1" d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--2" d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--3" d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z" fill="#FFFFFF" opacity="0.7"></path>
                        <path class="deco-layer deco-layer--4" d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z" fill="#FFFFFF"></path>
                    </svg>
                    <div class="pricing-price"><span class="pricing-currency">Rs.</span>6500
                        <span class="pricing-period">/ mo</span>
                    </div>
                    <h3 class="pricing-title font_sarpanch">Young Innovators</h3>
                </div>
                <ul class="pricing-feature-list">
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>1 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $25/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Limited cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                </ul>
                <button class="pricing-action">Choose plan</button>
            </div>
            <div class="pricing-item features-item ja-animate pricing__item--featured" data-animation="move-from-bottom" data-delay="item-1" style="min-height: 497px;">
                <div class="pricing-deco" style="background: linear-gradient(135deg,#a93bfe,#584efd)">
                    <svg class="pricing-deco-img" enable-background="new 0 0 300 100" height="100px" id="Layer_1" preserveAspectRatio="none" version="1.1" viewBox="0 0 300 100" width="300px" x="0px" xml:space="preserve" y="0px">
                        <path class="deco-layer deco-layer--1" d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--2" d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--3" d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z" fill="#FFFFFF" opacity="0.7"></path>
                        <path class="deco-layer deco-layer--4" d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z" fill="#FFFFFF"></path>
                    </svg>
                    <div class="pricing-price"><span class="pricing-currency">Rs.</span>8500
                        <span class="pricing-period">/ mo</span>
                    </div>
                    <h3 class="pricing-title font_sarpanch">Future Innovators</h3>
                </div>
                <ul class="pricing-feature-list">
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>5 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                </ul>
                <button class="pricing-action">Choose plan</button>
            </div>
            <div class="pricing-item features-item ja-animate" data-animation="move-from-bottom" data-delay="item-2" style="min-height: 497px;">
                <div class="pricing-deco">
                    <svg class="pricing-deco-img" enable-background="new 0 0 300 100" height="100px" id="Layer_1" preserveAspectRatio="none" version="1.1" viewBox="0 0 300 100" width="300px" x="0px" xml:space="preserve" y="0px">
                        <path class="deco-layer deco-layer--1" d="M30.913,43.944c0,0,42.911-34.464,87.51-14.191c77.31,35.14,113.304-1.952,146.638-4.729c48.654-4.056,69.94,16.218,69.94,16.218v54.396H30.913V43.944z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--2" d="M-35.667,44.628c0,0,42.91-34.463,87.51-14.191c77.31,35.141,113.304-1.952,146.639-4.729c48.653-4.055,69.939,16.218,69.939,16.218v54.396H-35.667V44.628z" fill="#FFFFFF" opacity="0.6"></path>
                        <path class="deco-layer deco-layer--3" d="M43.415,98.342c0,0,48.283-68.927,109.133-68.927c65.886,0,97.983,67.914,97.983,67.914v3.716H42.401L43.415,98.342z" fill="#FFFFFF" opacity="0.7"></path>
                        <path class="deco-layer deco-layer--4" d="M-34.667,62.998c0,0,56-45.667,120.316-27.839C167.484,57.842,197,41.332,232.286,30.428c53.07-16.399,104.047,36.903,104.047,36.903l1.333,36.667l-372-2.954L-34.667,62.998z" fill="#FFFFFF"></path>
                    </svg>
                    <div class="pricing-price"><span class="pricing-currency">Rs.</span>8500
                        <span class="pricing-period">/ mo</span>
                    </div>
                    <h3 class="pricing-title font_sarpanch">Programmers Hub</h3>
                </div>
                <ul class="pricing-feature-list">
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>10 GB of space</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Support at $5/hour</li>
                    <li class="pricing-feature"><i class="fa-solid fa-circle-check"></i>Full cloud access</li>
                    
                </ul>
                <button class="pricing-action">Choose plan</button>
            </div>
        </div>
    </section>
    
   <%@ include file="/WEB-INF/views/footer.jsp" %>
   <script
			src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
			integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
			crossorigin="anonymous"></script>

</body>
</html>
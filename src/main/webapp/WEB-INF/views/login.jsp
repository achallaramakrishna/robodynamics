<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE html>
<html>
<head>

<link href="${pageContext.request.contextPath}/resources/css/login.css" rel="stylesheet">
<title>RoboDynamics | Login</title>
</head>
<body>
   <%@ include file="/WEB-INF/views/showHeader.jsp" %>
	 <main>
      <div class="box">
        <div class="inner-box">
          <div class="forms-wrap">
            <f:form action="login" modelAttribute="rdUser" autocomplete="off" class="sign-in-form" method="post">
              <div class="logo">
                <img src="${pageContext.request.contextPath}/resources/images/loginlogo.png" alt="" />
                <h4>Robo<span>Dynamics</span></h4>
              </div>

              <div class="heading">
                <h2>Welcome Back</h2>
                <h6>Not registred yet?</h6>
                <a href="#" class="toggle">Sign up</a>
              </div>

              <div class="actual-form">
                <div class="input-wrap">
                  <f:input
                    type="text" path="userName"
                    minlength="4"
                    class="input-field"
                    autocomplete="off"
                    
                  />
                  <label>Name</label>
                </div>

                <div class="input-wrap">
                  <f:input
                    type="password" path="password"
                    minlength="4"
                    class="input-field"
                    autocomplete="off"
                    
                  />
                  <label>Password</label>
                </div>

                <input type="submit" value="Sign In" class="sign-btn" />

                <p class="text">
                  Forgotten your password or your login details?
                  <a href="#">Get help</a> signing in
                </p>
              </div>
            </f:form>

            <f:form action="login" modelAttribute="rdUser" autocomplete="off" class="sign-up-form">
              <div class="logo">
                <img src="${pageContext.request.contextPath}/resources/images/loginlogo.png" alt="" />
                <h4>RoboDynamics</h4>
              </div>

              <div class="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <a href="#" class="toggle">Sign in</a>
              </div>

              <div class="actual-form">
                <div class="input-wrap">
                  <f:input
                    type="text" path="userName"
                    minlength="4"
                    class="input-field"
                    autocomplete="off"
                    
                  />
                  <label>Name</label>
                </div>

                <div class="input-wrap">
                  <f:input type="text" path="userName" minlength="4" id="userName" class="input-field"  autocomplete="off"  />
                  <label>Password</label>
                </div>

                <input type="submit" value="Sign Up" class="sign-btn" />

                <p class="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </f:form>
          </div>

          <div class="carousel">
            <div class="images-wrapper">
              <img src="${pageContext.request.contextPath}/resources/images/1.png" class="image img-1 show" alt="" />
              <img src="${pageContext.request.contextPath}/resources/images/2.png" class="image img-2" alt="" />
              <img src="${pageContext.request.contextPath}/resources/images/3.png" class="image img-3" alt="" />
            </div>

            <div class="text-slider">
              <div class="text-wrap">
                <div class="text-group">
                  <h2>Create your own courses</h2>
                  <h2>Customize as you like</h2>
                  <h2>Invite students to your class</h2>
                </div>
              </div>

              <div class="bullets">
                <span class="active" data-value="1"></span>
                <span data-value="2"></span>
                <span data-value="3"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
 <script src="${pageContext.request.contextPath}/resources/js/login.js"></script>
</body>
</html>



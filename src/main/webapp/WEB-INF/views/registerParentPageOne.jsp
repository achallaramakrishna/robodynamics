<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="f" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false" %>

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
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
.wrapper{
    background: #ececec;
    padding: 0 20px 0 20px;
    margin-top: 10px;
}
.main{
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
.side-image{
    background-image: url("images/2.jpg");
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 10px 0 0 10px;
    position: relative;
}
.row{
  width:  900px;
  height:550px;
  border-radius: 10px;
  background: #fff;
  padding: 0px;
  box-shadow: 5px 5px 10px 1px rgba(0,0,0,0.2);
}
.text{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.text p{
    color: #fff;
    font-size: 20px; 
}
i{
    font-weight: 400;
    font-size: 15px;
}
.right{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.input-box{
  width: 330px;
  box-sizing: border-box;
}
.sign img{
    width: 35px;
    position: absolute;
    top: 30px;
    left: 30px;
}
.input-box header{
    font-weight: 700;
    text-align: center;
    margin-bottom: 45px;
}
.input-field{
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 0 10px 0 10px;
}
.input{
    height: 45px;
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    outline: none;
    margin-bottom: 20px;
    color: #40414a;
}
.input-box .input-field label{
    position: absolute;
    top: 10px;
    left: 10px;
    pointer-events: none;
    transition: .5s;
}
.input-field input:focus ~ label
   {
    top: -10px;
    font-size: 13px;
  }
  .input-field input:valid ~ label
  {
   top: -10px;
   font-size: 13px;
   color: #5d5076;
 }
 .input-field .input:focus, .input-field .input:valid{
    border-bottom: 1px solid #743ae1;
 }
 .submit{
    border: none;
    outline: none;
    height: 45px;
    background: #ececec;
    border-radius: 5px;
    transition: .4s;
 }
 .submit:hover{
    background: rgba(37, 95, 156, 0.937);
    color: #fff;
 }
 .signin{
    text-align: center;
    font-size: small;
    margin-top: 25px;
}
span a{
    text-decoration: none;
    font-weight: 700;
    color: #000;
    transition: .5s;
}
span a:hover{
    text-decoration: underline;
    color: #000;
}

.bg-custom {
background: rgb(132,156,235);
background: radial-gradient(circle, rgba(132,156,235,1) 0%, rgba(0,76,146,0.6383345574557948) 53%, rgba(0,212,255,1) 100%);
}

@media only screen and (max-width: 768px){
    .side-image{
        border-radius: 10px 10px 0 0;
    }
    .sign img{
        width: 35px;
        position: absolute;
        top: 20px;
        left: 47%;
    }
    .text{
        position: absolute;
        top: 70%;
        text-align: center;
    }
    .text p, i{
        font-size: 16px;
    }
    .row{
        max-width:420px;
        width: 100%;
    }
}

</style>

<title>Welcome</title>

</head>
<body>
	<%@ include file="/WEB-INF/views/showHeader.jsp"%>
	<div class="wrapper">
    <div class="container main">
        <div class="row">
            <div class="col-md-6 side-image bg-custom">
                       
                <img src="${pageContext.request.contextPath}/resources/images/rdlogotransparent.png" width="auto" height="60px" alt="" class="my-3">
                
                <div class="text text-dark">
                    <p>Experienced instructors passionate about STEM education <i>- RoboDynamics</i></p>
                </div>
                
            </div>
            <div class="col-md-6 right">
                
                <div class="input-box">
                   
                   <header>Sign Up As Parent</header>
                <c:if test="${success != null}">
				<div style="color: green; font-size: 20px;" role="alert">
					<c:out value="${success}" />
				</div>
				</c:if>
                <f:form action="registerParentPageOne" modelAttribute="rdUser" method="post">
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Email</label>
						<f:input type="text" path="email" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Cell Phone</label>
						<f:input type="text" path="cellPhone" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					
					<div class="form-group input-field">
						<label for="exampleInputEmail1">First Name</label>
						<f:input type="text" path="firstName" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<div class="form-group input-field">
						<label for="exampleInputEmail1">Last Name</label>
						<f:input type="text" path="lastName" class="form-control input"
							id="exampleInputEmail1" aria-describedby="emailHelp" />
					</div>
					<br>
					<center>
						<button type="submit" class="btn btn-primary">Submit</button>
					</center>
				</f:form> 
            </div>
        </div>
    </div>
</div>
</body>
</html>
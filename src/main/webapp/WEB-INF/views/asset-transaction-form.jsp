<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
 pageEncoding="ISO-8859-1"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt" %>
<!DOCTYPE html>
<html>
<head>
<%@ page isELIgnored="false" %>
<meta charset="ISO-8859-1">
<title>Robo Dynamics - Assets </title>
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
<meta charset="ISO-8859-1">

</head>
<body>
   <%@ include file="/WEB-INF/views/navmenu.jsp" %>

<br/>
 <div class="container">
  <div class="col-md-offset-2 col-md-7">
   <div class="panel panel-info">
    <div class="panel-heading">
     <div class="panel-title">Book Asset</div>
    </div>
    <div class="panel-body">
     <form:form action="saveAssetTransaction" cssClass="form-horizontal"
      method="post" modelAttribute="assetTransactionForm" enctype="multipart/form-data">

      <!-- need to associate this data with asset id -->
      <form:hidden path="assetId" />
      
      <form:hidden path="userID" />
      
      <form:hidden path="status" />

      <div class="form-group">	
       <label for="asset.assetName" class="col-md-3 control-label"> ${asset.assetName} 
        </label>
      </div>

	  <div class="form-group">
       <img alt="Image" src="<c:url value="/resources/images/${asset.assetResources.iterator().next().assetResourceFileName}"/>"/>
      </div>
      
      <div class="form-group">
       <label for="transactionStartDate" class="col-md-3 control-label">Transaction
        Start Date </label>
       <div class="col-md-9">
        <form:input type="date" path="transactionStartDate" cssClass="form-control" />
       </div>
      </div>
      
      <br>
     <div class="form-group">
       <!-- Button -->
       <div class="col-md-offset-3 col-md-9">
        <form:button cssClass="btn btn-primary">Submit</form:button>
       </div>
      </div>

     </form:form>
    </div>
   </div>
  </div>
 </div>
</body>
</html>

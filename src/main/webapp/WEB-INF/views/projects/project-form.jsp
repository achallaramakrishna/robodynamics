<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core_rt"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<%@ page isELIgnored="false"%>

<title>Robo Dynamics - Add Project</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"
    integrity="sha384-eMNCOe7tC1doHpGoWe/6oMVemdAVTMs2xqW4mwXrXsW0L84Iytr2wi5v2QjrP/xp" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.min.js"
    integrity="sha384-cn7l7gDp0eyniUwwAZgrzD06kc/tftFf19TOAs2zVinnD/C7E91j9yyk5//jjpt/" crossorigin="anonymous"></script>
</head>
<body>
<jsp:include page="/header.jsp" />
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <div class="col-md-offset-1 col-md-10">
                <br>
                <!-- Back button to go back to the dashboard -->
                <button class="btn btn-secondary" onclick="window.location.href='${pageContext.request.contextPath}/dashboard';">
                    Back to Dashboard
                </button>
                <br><br>
                <div class="panel panel-info">
                    <div class="panel-heading">
                        <br>
                        <h2>Add Project</h2>
                    </div>
                    <div class="panel-body">
                        <form:form action="saveProject" cssClass="form-horizontal" method="post" modelAttribute="project" enctype="multipart/form-data"> 

                            <!-- Section 1: Basic Information -->
                            <fieldset>
                                <legend>Basic Information</legend>
                                <form:hidden path="projectId" />

                                <div class="form-group">
                                    <label for="projectName" class="col-md-3 control-label">Project Name</label>
                                    <div class="col-md-9">
                                        <form:input path="projectName" cssClass="form-control" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="category" class="col-md-3 control-label">Category</label>
                                    <div class="col-md-9">
                                        <form:select path="category" cssClass="form-control">
                                            <form:option value="" label="-- Select Category --" />
                                            <form:option value="Science" label="Science" />
                                            <form:option value="Technology" label="Technology" />
                                            <form:option value="Engineering" label="Engineering" />
                                            <form:option value="Arts" label="Arts" />
                                            <form:option value="Humanities" label="Humanities" />
                                            <form:option value="Mathematics" label="Mathematics" />
                                            <form:option value="Environmental Studies" label="Environmental Studies" />
                                            <form:option value="Social Sciences" label="Social Sciences" />
                                            <form:option value="Physical Education" label="Physical Education" />
                                            <form:option value="Literature" label="Literature" />
                                        </form:select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="gradeRange" class="col-md-3 control-label">Grade Range</label>
                                    <div class="col-md-9">
                                        <form:select path="gradeRange" cssClass="form-control">
                                            <form:option value="" label="-- Select Grade Range --" />
                                            <form:option value="LOWER_PRIMARY_1_3" label="Lower Primary (1-3)" />
                                            <form:option value="UPPER_PRIMARY_4_6" label="Upper Primary (4-6)" />
                                            <form:option value="MIDDLE_SCHOOL_7_9" label="Middle School (7-9)" />
                                            <form:option value="HIGH_SCHOOL_10_12" label="High School (10-12)" />
                                        </form:select>
                                    </div>
                                </div>
                            </fieldset>

                            <!-- Section 2: Project Details -->
                            <fieldset>
                                <legend>Project Details</legend>

                                <div class="form-group">
                                    <label for="shortDescription" class="col-md-3 control-label">Short Description</label>
                                    <div class="col-md-9">
                                        <form:textarea path="shortDescription" cssClass="form-control" rows="3" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="detailedDescription" class="col-md-3 control-label">Detailed Description</label>
                                    <div class="col-md-9">
                                        <form:textarea path="detailedDescription" cssClass="form-control" rows="5" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="estimatedDuration" class="col-md-3 control-label">Estimated Duration</label>
                                    <div class="col-md-9">
                                        <form:input path="estimatedDuration" cssClass="form-control" />
                                    </div>
                                </div>
                            </fieldset>

                            <!-- Section 3: Technical Information -->
                            <fieldset>
                                <legend>Technical Information</legend>

                                <div class="form-group">
                                    <label for="difficultyLevel" class="col-md-3 control-label">Difficulty Level</label>
                                    <div class="col-md-9">
                                        <form:select path="difficultyLevel" cssClass="form-control">
                                            <form:option value="" label="-- Select Difficulty Level --" />
                                            <form:option value="Easy" label="Easy" />
                                            <form:option value="Medium" label="Medium" />
                                            <form:option value="Hard" label="Hard" />
                                        </form:select>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="materialsRequired" class="col-md-3 control-label">Materials Required</label>
                                    <div class="col-md-9">
                                        <form:textarea path="materialsRequired" cssClass="form-control" rows="4" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="steps" class="col-md-3 control-label">Steps</label>
                                    <div class="col-md-9">
                                        <form:textarea path="steps" cssClass="form-control" rows="6" />
                                    </div>
                                </div>
                            </fieldset>

                            <!-- Section 4: Media Links -->
                            <fieldset>
                                <legend>Media Links</legend>

                                <div class="form-group">
                                    <label for="videoLink" class="col-md-3 control-label">Video Link</label>
                                    <div class="col-md-9">
                                        <form:input path="videoLink" cssClass="form-control" />
                                    </div>
                                </div>

								<div class="form-group">
						            <label for="imageFile" class="col-md-3 control-label">Upload Image</label>
						            <div class="col-md-9">
						                <input type="file" name="imageFile" class="form-control" />
						            </div>
						        </div>
                            </fieldset>

                            <br>
                            <center>
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </center>
                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <jsp:include page="/footer.jsp" />
</body>
</html>

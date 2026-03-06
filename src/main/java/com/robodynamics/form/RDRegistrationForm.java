package com.robodynamics.form;

public class RDRegistrationForm {
	
	private Parent parent;
    private Child child;

    // Getters and Setters

    public static class Parent {
        private String email;
        private String phone;
        private String firstName;
        private String lastName;
        private String address;
        private String city;
        private String state;
        private String userName;  // New field for username
        private String password;  // New field for password
        private String aptiGoal;
        private String aptiSupportLevel;
        private String aptiStrength;
        private String aptiChallenge;
        private String aptiBudget;
        private String aptiGeography;
        private String aptiLanguage;
        private String aptiCoachingTolerance;
        private String aptiLearningModel;
        private String aptiTimeline;
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public String getPhone() {
			return phone;
		}
		public void setPhone(String phone) {
			this.phone = phone;
		}
		public String getFirstName() {
			return firstName;
		}
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}
		public String getLastName() {
			return lastName;
		}
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public String getCity() {
			return city;
		}
		public void setCity(String city) {
			this.city = city;
		}
		public String getState() {
			return state;
		}
		public void setState(String state) {
			this.state = state;
		}
		public String getUserName() {
			return userName;
		}
		public void setUserName(String userName) {
			this.userName = userName;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getAptiGoal() {
			return aptiGoal;
		}
		public void setAptiGoal(String aptiGoal) {
			this.aptiGoal = aptiGoal;
		}
		public String getAptiSupportLevel() {
			return aptiSupportLevel;
		}
		public void setAptiSupportLevel(String aptiSupportLevel) {
			this.aptiSupportLevel = aptiSupportLevel;
		}
		public String getAptiStrength() {
			return aptiStrength;
		}
		public void setAptiStrength(String aptiStrength) {
			this.aptiStrength = aptiStrength;
		}
		public String getAptiChallenge() {
			return aptiChallenge;
		}
		public void setAptiChallenge(String aptiChallenge) {
			this.aptiChallenge = aptiChallenge;
		}
		public String getAptiBudget() {
			return aptiBudget;
		}
		public void setAptiBudget(String aptiBudget) {
			this.aptiBudget = aptiBudget;
		}
		public String getAptiGeography() {
			return aptiGeography;
		}
		public void setAptiGeography(String aptiGeography) {
			this.aptiGeography = aptiGeography;
		}
		public String getAptiLanguage() {
			return aptiLanguage;
		}
		public void setAptiLanguage(String aptiLanguage) {
			this.aptiLanguage = aptiLanguage;
		}
		public String getAptiCoachingTolerance() {
			return aptiCoachingTolerance;
		}
		public void setAptiCoachingTolerance(String aptiCoachingTolerance) {
			this.aptiCoachingTolerance = aptiCoachingTolerance;
		}
		public String getAptiLearningModel() {
			return aptiLearningModel;
		}
		public void setAptiLearningModel(String aptiLearningModel) {
			this.aptiLearningModel = aptiLearningModel;
		}
		public String getAptiTimeline() {
			return aptiTimeline;
		}
		public void setAptiTimeline(String aptiTimeline) {
			this.aptiTimeline = aptiTimeline;
		}

        
    }

    public static class Child {
        private String firstName;
        private String lastName;
        private Integer age;
        private String grade;
        private String school;
        private String city;
        private String state;
        private String userName;  // New field for username
        private String password;  // New field for password
        private String boardCode;
        private String streamCode;
        private String subjectsCode;
        private String programCode;
        private String yearsLeftCode;
		public String getUserName() {
			return userName;
		}
		public void setUserName(String userName) {
			this.userName = userName;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getFirstName() {
			return firstName;
		}
		public void setFirstName(String firstName) {
			this.firstName = firstName;
		}
		public String getLastName() {
			return lastName;
		}
		public void setLastName(String lastName) {
			this.lastName = lastName;
		}
		public Integer getAge() {
			return age;
		}
		public void setAge(Integer age) {
			this.age = age;
		}
		public String getSchool() {
			return school;
		}
		public void setSchool(String school) {
			this.school = school;
		}
		public String getGrade() {
			return grade;
		}
		public void setGrade(String grade) {
			this.grade = grade;
		}
		public String getCity() {
			return city;
		}
		public void setCity(String city) {
			this.city = city;
		}
		public String getState() {
			return state;
		}
		public void setState(String state) {
			this.state = state;
		}
		public String getBoardCode() {
			return boardCode;
		}
		public void setBoardCode(String boardCode) {
			this.boardCode = boardCode;
		}
		public String getStreamCode() {
			return streamCode;
		}
		public void setStreamCode(String streamCode) {
			this.streamCode = streamCode;
		}
		public String getSubjectsCode() {
			return subjectsCode;
		}
		public void setSubjectsCode(String subjectsCode) {
			this.subjectsCode = subjectsCode;
		}
		public String getProgramCode() {
			return programCode;
		}
		public void setProgramCode(String programCode) {
			this.programCode = programCode;
		}
		public String getYearsLeftCode() {
			return yearsLeftCode;
		}
		public void setYearsLeftCode(String yearsLeftCode) {
			this.yearsLeftCode = yearsLeftCode;
		}

        
    }

	public Parent getParent() {
		return parent;
	}

	public void setParent(Parent parent) {
		this.parent = parent;
	}

	public Child getChild() {
		return child;
	}

	public void setChild(Child child) {
		this.child = child;
	}
    
    

}

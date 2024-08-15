package com.robodynamics.form;

public class RDNewUserForm {
	
	 private String firstName;
	    private String lastName;
	    private int age;
	    private String email;
	    private String userName;
	    private String password;
	    private String cellPhone;
	    private String city;
	    private String state;
	    private String address;
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
		public int getAge() {
			return age;
		}
		public void setAge(int age) {
			this.age = age;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
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
		public String getCellPhone() {
			return cellPhone;
		}
		public void setCellPhone(String cellPhone) {
			this.cellPhone = cellPhone;
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
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		@Override
		public String toString() {
			return "RDNewUserForm [firstName=" + firstName + ", lastName=" + lastName + ", age=" + age + ", email="
					+ email + ", userName=" + userName + ", password=" + password + ", cellPhone=" + cellPhone
					+ ", city=" + city + ", state=" + state + ", address=" + address + "]";
		}
	    
	    	

}

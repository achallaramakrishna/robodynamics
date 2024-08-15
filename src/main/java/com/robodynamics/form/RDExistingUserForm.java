package com.robodynamics.form;

public class RDExistingUserForm {

	private String userName;
    private String password;
    // Getters and Setters
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
	@Override
	public String toString() {
		return "RDExistingUserForm [userName=" + userName + ", password=" + password + "]";
	}
    
    
}

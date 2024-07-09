package com.robodynamics.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_users")
public class RDUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private int userID;
	
	@Column(name = "first_name")
	private String firstName;
	
	@Column(name = "last_name")
	private String lastName;
	
	@Column(name = "user_name")
	private String userName;

	@Column(name = "age")
	private int age;
	
	@Column(name = "city")
	private String city;
	
	@Column(name = "state")
	private String state;
	
	@Column(name = "email")
	private String email;
	
	@Column(name = "address")
	private String address;
	
	@Column(name = "password")
	private String password;
	
	@Column(name = "profile_id")
	private int profile_id;

	@Column(name = "cell_phone")
	private String cellPhone;
	
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "mom_user_id")
    private RDUser mom;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dad_user_id")
    private RDUser dad;
    
	public RDUser() {
		
	}
	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
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
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public int getProfile_id() {
		return profile_id;
	}
	public void setProfile_id(int profile_id) {
		this.profile_id = profile_id;
	}

	
	public String getCellPhone() {
		return cellPhone;
	}
	public void setCellPhone(String cellPhone) {
		this.cellPhone = cellPhone;
	}


	public static enum profileType {
		SUPER_ADMIN(1, "SUPER_ADMIN"), ROBO_ADMIN(2, "ROBO_ADMIN"), ROBO_MENTOR(3, "ROBO_MENTOR"), ROBO_PARENT(4, "ROBO_PARENT"), ROBO_STUDENT(5, "ROBO_STUDENT");
		 
		private int value;
		private String label;
		 
		private profileType(int value, String label) {
			this.value = value;
			this.label = label;
		}
		 
		public int getValue() {
		  return value;
		}
		
		public String getLabel() {
			return label;
		}
		
		public static Map<Integer, String> getMap() {
			Map<Integer, String> map  = new LinkedHashMap<Integer, String>();
			for (profileType type: profileType.values()) {				
				map.put(type.getValue(), type.getLabel());
			}
			return map;
		}
	}


	
	public RDUser getMom() {
		return mom;
	}
	public void setMom(RDUser mom) {
		this.mom = mom;
	}
	public RDUser getDad() {
		return dad;
	}
	public void setDad(RDUser dad) {
		this.dad = dad;
	}
	@Override
	public String toString() {
		return "RDUser [userID=" + userID + ", firstName=" + firstName + ", lastName=" + lastName + ", userName="
				+ userName + ", age=" + age + ", city=" + city + ", state=" + state + ", email=" + email + ", address="
				+ address + ", password=" + password + ", profile_id=" + profile_id + ", cellPhone=" + cellPhone
				+ ", mom=" + mom + ", dad=" + dad + "]";
	}

	
	
	
	
}

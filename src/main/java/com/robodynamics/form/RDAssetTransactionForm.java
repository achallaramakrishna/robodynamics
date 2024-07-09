package com.robodynamics.form;

import java.util.Date;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

public class RDAssetTransactionForm {

	private int assetTransactionId;
	private int assetId;
	private String assetName;
	private int userID;
	private String userName;
	private String status;

    private String transactionDate;
    private String transactionStartDate;
    private String transactionEndDate;
    
    

    public int getAssetTransactionId() {
		return assetTransactionId;
	}



	public void setAssetTransactionId(int assetTransactionId) {
		this.assetTransactionId = assetTransactionId;
	}



	public int getAssetId() {
		return assetId;
	}



	public void setAssetId(int assetId) {
		this.assetId = assetId;
	}







	public int getUserID() {
		return userID;
	}



	public void setUserID(int userID) {
		this.userID = userID;
	}



	public String getStatus() {
		return status;
	}



	public void setStatus(String status) {
		this.status = status;
	}



	public String getTransactionDate() {
		return transactionDate;
	}



	public void setTransactionDate(String transactionDate) {
		this.transactionDate = transactionDate;
	}



	public String getTransactionStartDate() {
		return transactionStartDate;
	}



	public void setTransactionStartDate(String transactionStartDate) {
		this.transactionStartDate = transactionStartDate;
	}



	public String getTransactionEndDate() {
		return transactionEndDate;
	}



	public void setTransactionEndDate(String transactionEndDate) {
		this.transactionEndDate = transactionEndDate;
	}

	public String getAssetName() {
		return assetName;
	}



	public void setAssetName(String assetName) {
		this.assetName = assetName;
	}



	public String getUserName() {
		return userName;
	}



	public void setUserName(String userName) {
		this.userName = userName;
	}



	public RDAssetTransactionForm() {
    	
    }



	@Override
	public String toString() {
		return "RDAssetTransactionForm [assetTransactionId=" + assetTransactionId + ", assetId=" + assetId
				+ ", assetName=" + assetName + ", userID=" + userID + ", userName=" + userName + ", status=" + status
				+ ", transactionDate=" + transactionDate + ", transactionStartDate=" + transactionStartDate
				+ ", transactionEndDate=" + transactionEndDate + "]";
	}


}

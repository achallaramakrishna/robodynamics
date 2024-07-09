package com.robodynamics.model;

import java.beans.Transient;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "rd_asset_transactions")
public class RDAssetTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "asset_transaction_id")
	private int assetTransactionId;

	@ManyToOne
	@JoinColumn(name = "asset_id")
	private RDAsset asset;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private RDUser user;

	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "transaction_date")
	private Date transactionDate;

	@Column(name = "status")
	private String status;

	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "transaction_start_date")
	private Date transactionStartDate;

	@Temporal(TemporalType.DATE)
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Column(name = "transaction_end_date")
	private Date transactionEndDate;

	public RDAssetTransaction() {

	}

	public int getAssetTransactionId() {
		return assetTransactionId;
	}

	public void setAssetTransactionId(int assetTransactionId) {
		this.assetTransactionId = assetTransactionId;
	}

	public RDAsset getAsset() {
		return asset;
	}

	public void setAsset(RDAsset asset) {
		this.asset = asset;
	}

	public RDUser getUser() {
		return user;
	}

	public void setUser(RDUser user) {
		this.user = user;
	}

	public Date getTransactionDate() {
		return transactionDate;
	}

	public void setTransactionDate(Date transactionDate) {
		this.transactionDate = transactionDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getTransactionStartDate() {
		return transactionStartDate;
	}

	public void setTransactionStartDate(Date transactionStartDate) {
		this.transactionStartDate = transactionStartDate;
	}

	public Date getTransactionEndDate() {
		return transactionEndDate;
	}

	public void setTransactionEndDate(Date transactionEndDate) {
		this.transactionEndDate = transactionEndDate;
	}

	@Override
	public String toString() {
		return "RDAssetTransaction [assetTransactionId=" + assetTransactionId + ", asset=" + asset + ", user=" + user
				+ ", transactionDate=" + transactionDate + ", status=" + status + ", transactionStartDate="
				+ transactionStartDate + ", transactionEndDate=" + transactionEndDate + "]";
	}

	
}

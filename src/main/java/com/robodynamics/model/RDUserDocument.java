package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_user_documents")
public class RDUserDocument {

  public enum DocType { RESUME, AADHAAR, PAN, DEGREE, CERTIFICATE, PHOTO, OTHER }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "doc_id")
  private Integer docId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private RDUser user;

  @Enumerated(EnumType.STRING)
  @Column(name = "doc_type", nullable = false, length = 16)
  private DocType docType;

  @Column(name = "file_name", nullable = false)
  private String fileName;

  @Column(name = "storage_path", nullable = false, length = 600)
  private String storagePath;

  @Column(name = "mime_type")
  private String mimeType;

  @Column(name = "file_size")
  private Integer fileSize;

  @Column(name = "is_public")
  private Boolean isPublic = false;

  // --- getters/setters ---
  public Integer getDocId() { return docId; }
  public void setDocId(Integer docId) { this.docId = docId; }
  public RDUser getUser() { return user; }
  public void setUser(RDUser user) { this.user = user; }
  public DocType getDocType() { return docType; }
  public void setDocType(DocType docType) { this.docType = docType; }
  public String getFileName() { return fileName; }
  public void setFileName(String fileName) { this.fileName = fileName; }
  public String getStoragePath() { return storagePath; }
  public void setStoragePath(String storagePath) { this.storagePath = storagePath; }
  public String getMimeType() { return mimeType; }
  public void setMimeType(String mimeType) { this.mimeType = mimeType; }
  public Integer getFileSize() { return fileSize; }
  public void setFileSize(Integer fileSize) { this.fileSize = fileSize; }
  public Boolean getIsPublic() { return isPublic; }
  public void setIsPublic(Boolean aPublic) { isPublic = aPublic; }
}

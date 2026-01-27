package com.robodynamics.wrapper;

public class RDMatchPairJson {

    /* ================= BASIC CONTENT ================= */

    private String leftText;
    private String rightText;

    /* ================= TYPE CONTROL ================= */
    // TEXT / IMAGE (future: BOTH)

    private String leftType = "TEXT";
    private String rightType = "TEXT";

    /* ================= IMAGE PATHS ================= */
    // Optional – can be null in JSON

    private String leftImage;
    private String rightImage;

    /* ================= ORDERING ================= */

    private Integer displayOrder;

    /* ================= GETTERS & SETTERS ================= */

    public String getLeftText() {
        return leftText;
    }

    public void setLeftText(String leftText) {
        this.leftText = leftText;
    }

    public String getRightText() {
        return rightText;
    }

    public void setRightText(String rightText) {
        this.rightText = rightText;
    }

    public String getLeftType() {
        return leftType;
    }

    public void setLeftType(String leftType) {
        this.leftType = leftType;
    }

    public String getRightType() {
        return rightType;
    }

    public void setRightType(String rightType) {
        this.rightType = rightType;
    }

    public String getLeftImage() {
        return leftImage;
    }

    public void setLeftImage(String leftImage) {
        this.leftImage = leftImage;
    }

    public String getRightImage() {
        return rightImage;
    }

    public void setRightImage(String rightImage) {
        this.rightImage = rightImage;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}

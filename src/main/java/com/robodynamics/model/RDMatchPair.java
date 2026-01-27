package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_match_pair")
public class RDMatchPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_pair_id")
    private int matchPairId;

    /* ===================== TEXT ===================== */

    @Column(name = "left_text", nullable = false)
    private String leftText;

    @Column(name = "right_text", nullable = false)
    private String rightText;

    /* ===================== ORDER ===================== */

    @Column(name = "display_order")
    private Integer displayOrder;

    /* ===================== TYPE ===================== */
    // TEXT / IMAGE (future: BOTH)

    @Column(name = "left_type", length = 10)
    private String leftType = "TEXT";

    @Column(name = "right_type", length = 10)
    private String rightType = "TEXT";

    /* ===================== IMAGES ===================== */

    @Column(name = "left_image", length = 255)
    private String leftImage;

    @Column(name = "right_image", length = 255)
    private String rightImage;

    /* ===================== RELATION ===================== */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_question_id", nullable = false)
    private RDMatchQuestion matchQuestion;

    /* ===================== GETTERS / SETTERS ===================== */

    public int getMatchPairId() {
        return matchPairId;
    }

    public void setMatchPairId(int matchPairId) {
        this.matchPairId = matchPairId;
    }

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

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
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

    public RDMatchQuestion getMatchQuestion() {
        return matchQuestion;
    }

    public void setMatchQuestion(RDMatchQuestion matchQuestion) {
        this.matchQuestion = matchQuestion;
    }
}

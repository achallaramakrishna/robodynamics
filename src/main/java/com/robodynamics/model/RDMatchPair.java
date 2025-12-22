package com.robodynamics.model;

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

import org.springframework.web.multipart.MultipartFile;


@Entity
@Table(name = "rd_match_pair")
public class RDMatchPair {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_pair_id")
    private int matchPairId;

    @Column(name = "left_text")
    private String leftText;

    @Column(name = "right_text")
    private String rightText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_question_id")
    private RDMatchQuestion matchQuestion;

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

	public RDMatchQuestion getMatchQuestion() {
		return matchQuestion;
	}

	public void setMatchQuestion(RDMatchQuestion matchQuestion) {
		this.matchQuestion = matchQuestion;
	}

    
}

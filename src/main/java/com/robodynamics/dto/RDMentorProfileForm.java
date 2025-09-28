package com.robodynamics.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public class RDMentorProfileForm {

    // RDUser fields
    @NotBlank private String userName;
    @Email @NotBlank private String email;
    @NotBlank private String password;
    @NotBlank private String confirmPassword;

    @Pattern(regexp="\\d{10}", message="Enter 10 digit mobile")
    private String cellPhone;

    private String firstName;
    private String lastName;
    private String city;
    private String state;
    private String address;

    // RDMentor fields
    @NotBlank private String fullName;
    private String bio;
    private Integer experienceYears;
    private String subjects;          // CSV
    private String gradeRange;        // e.g., "6–10"
    private String boardsSupported;   // CSV
    private String modes;             // Online/Offline/Both
    private String linkedinUrl;
    private String availability;      // free-text or "Weekdays 6–9 PM"
    private BigDecimal hourlyRate;    // optional

    // Uploads
    private MultipartFile resume;     // PDF only
    private MultipartFile photo;      // image

    // getters/setters...
}

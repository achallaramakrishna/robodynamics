<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <title>Competition FAQs | Robo Dynamics</title>

  <meta name="description"
        content="Frequently Asked Questions about Robo Dynamics 2025 Competitions including registration, pricing, dates, online/offline format, certificates and scholarships." />

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"/>

  <!-- Reuse existing site look -->
  <style>
    body { background:#f7fafc; color:#1b1f23; }
  </style>
</head>
<body>

<jsp:include page="header.jsp"/>

<!-- FAQ HERO -->
<section class="py-4" style="background:linear-gradient(135deg,#0d47a1,#1b5e20); color:#fff;">
  <div class="container text-center">
    <span class="badge bg-warning text-dark mb-2 px-3 py-1 fs-6">
      Robo Dynamics 2025
    </span>
    <h2 class="fw-bold mb-1">Competition FAQs</h2>
    <p class="fw-semibold mb-0">
      Everything parents need to know before registering
    </p>
  </div>
</section>

<!-- FAQ CONTENT -->
<section class="py-5 bg-white">
  <div class="container">

    <div class="accordion accordion-flush" id="competitionFaq">

      <!-- Q1 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq1">
            Who can participate in Robo Dynamics 2025 Competitions?
          </button>
        </h2>
        <div id="faq1" class="accordion-collapse collapse">
          <div class="accordion-body">
            Students from <strong>Grades 3 to 10</strong> are eligible.
            <ul>
              <li><strong>Junior:</strong> Grades 3–6</li>
              <li><strong>Senior:</strong> Grades 7–10</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Q2 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq2">
            How do I register my child for a competition?
          </button>
        </h2>
        <div id="faq2" class="accordion-collapse collapse">
          <div class="accordion-body">
            Registration follows a simple process:
            <ol>
              <li>Signup as a <strong>Parent</strong></li>
              <li>Login to Parent Dashboard</li>
              <li>Click <strong>View Competitions</strong></li>
              <li>Select competition(s) and complete payment</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- Q3 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq3">
            What is the registration fee?
          </button>
        </h2>
        <div id="faq3" class="accordion-collapse collapse">
          <div class="accordion-body">
            <ul>
              <li><strong>Junior (Grades 3–6):</strong> ₹750 per competition</li>
              <li><strong>Senior (Grades 7–10):</strong> ₹1,250 per competition</li>
            </ul>
            Parents may register for multiple competitions.
          </div>
        </div>
      </div>

      <!-- Q4 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq4">
            When are the competitions conducted?
          </button>
        </h2>
        <div id="faq4" class="accordion-collapse collapse">
          <div class="accordion-body">
            Competitions will be held on:
            <br/>
            <strong>January 31 & February 1, 2026</strong>
          </div>
        </div>
      </div>

      <!-- Q5 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq5">
            Are competitions online or offline?
          </button>
        </h2>
        <div id="faq5" class="accordion-collapse collapse">
          <div class="accordion-body">
            <ul>
              <li><strong>Online:</strong> Spelling Bee, Python Coding, Impromptu Speaking</li>
              <li><strong>Offline:</strong> Math Contest, Robotics Contest</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Q6 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq6">
            Will students receive certificates?
          </button>
        </h2>
        <div id="faq6" class="accordion-collapse collapse">
          <div class="accordion-body">
            Yes. All participants receive a Participation Certificate.
            Winners and finalists receive Merit Certificates.
          </div>
        </div>
      </div>

      <!-- Q7 -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold"
                  type="button" data-bs-toggle="collapse"
                  data-bs-target="#faq7">
            How are proceeds used?
          </button>
        </h2>
        <div id="faq7" class="accordion-collapse collapse">
          <div class="accordion-body">
            <strong>100% of competition proceeds</strong> are used to provide
            scholarships for <strong>merit students from Government Schools</strong>
            to support their academic fees.
          </div>
        </div>
      </div>

    </div>

  </div>
</section>

<jsp:include page="footer.jsp"/>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

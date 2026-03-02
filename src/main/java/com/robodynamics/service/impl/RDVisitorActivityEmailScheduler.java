package com.robodynamics.service.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.robodynamics.service.EmailService;
import com.robodynamics.service.RDVisitorLogService;

@Service
public class RDVisitorActivityEmailScheduler {

    private static final Logger log = LoggerFactory.getLogger(RDVisitorActivityEmailScheduler.class);
    private static final DateTimeFormatter TS_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss", Locale.ENGLISH);
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    @Autowired
    private RDVisitorLogService visitorLogService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SessionFactory sessionFactory;

    @Value("${rd.activity.report.enabled:true}")
    private boolean reportEnabled;

    @Value("${rd.activity.report.to:achallaramakrishna@gmail.com}")
    private String reportTo;

    @Value("${rd.activity.report.hours:3}")
    private int reportHours;

    @Value("${rd.activity.report.maxTopUrls:10}")
    private int maxTopUrls;

    @Value("${rd.activity.report.sendWhenNoActivity:false}")
    private boolean sendWhenNoActivity;

    @Value("${rd.visitor.cleanup.enabled:false}")
    private boolean cleanupEnabled;

    @Value("${rd.visitor.cleanup.keepDays:30}")
    private int cleanupKeepDays;

    @Scheduled(cron = "${rd.activity.report.cron:0 0 */3 * * *}")
    public void sendVisitorActivityReport() {
        if (!reportEnabled) {
            return;
        }

        int hours = Math.max(1, reportHours);
        LocalDateTime toTime = LocalDateTime.now(IST);
        LocalDateTime fromTime = toTime.minusHours(hours);

        long totalVisits = safeVisitorCount(() -> visitorLogService.countVisitsSince(fromTime));
        long uniqueIps = safeVisitorCount(() -> visitorLogService.countDistinctIpsSince(fromTime));
        long uniqueUrls = safeVisitorCount(() -> visitorLogService.countDistinctUrlsSince(fromTime));
        long loggedInVisits = safeVisitorCount(() -> visitorLogService.countLoggedInVisitsSince(fromTime));
        long anonymousVisits = safeVisitorCount(() -> visitorLogService.countAnonymousVisitsSince(fromTime));
        long distinctLoggedInUsers = safeVisitorCount(() -> visitorLogService.countDistinctLoggedInUsersSince(fromTime));

        long checkoutVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/plans/checkout%"));
        long paymentSuccessVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/plans/success%"));
        long registrationVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/registerParentChild%"));
        long loginVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/login%"));
        long demoVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/parents/demo%"));
        long aptiParentVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/aptipath/parent/home%"));
        long aptiStudentVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/aptipath/student/home%"));
        long aptiTestVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/aptipath/student/test%"));
        long aptiResultVisits = safeVisitorCount(() -> visitorLogService.countVisitsByUrlPatternSince(fromTime, "%/aptipath/student/result%"));
        boolean visitorDataAvailable = totalVisits >= 0
                && uniqueIps >= 0
                && uniqueUrls >= 0
                && loggedInVisits >= 0
                && anonymousVisits >= 0
                && distinctLoggedInUsers >= 0
                && checkoutVisits >= 0
                && paymentSuccessVisits >= 0
                && registrationVisits >= 0
                && loginVisits >= 0
                && demoVisits >= 0
                && aptiParentVisits >= 0
                && aptiStudentVisits >= 0
                && aptiTestVisits >= 0
                && aptiResultVisits >= 0;

        totalVisits = normalizeCount(totalVisits);
        uniqueIps = normalizeCount(uniqueIps);
        uniqueUrls = normalizeCount(uniqueUrls);
        loggedInVisits = normalizeCount(loggedInVisits);
        anonymousVisits = normalizeCount(anonymousVisits);
        distinctLoggedInUsers = normalizeCount(distinctLoggedInUsers);
        checkoutVisits = normalizeCount(checkoutVisits);
        paymentSuccessVisits = normalizeCount(paymentSuccessVisits);
        registrationVisits = normalizeCount(registrationVisits);
        loginVisits = normalizeCount(loginVisits);
        demoVisits = normalizeCount(demoVisits);
        aptiParentVisits = normalizeCount(aptiParentVisits);
        aptiStudentVisits = normalizeCount(aptiStudentVisits);
        aptiTestVisits = normalizeCount(aptiTestVisits);
        aptiResultVisits = normalizeCount(aptiResultVisits);

        long leadsCreated = safeEntityCount("select count(l.id) from RDLead l where l.createdAt >= :fromTime", fromTime, true);
        long usersCreated = safeEntityCount("select count(u.userID) from RDUser u where u.createdDate >= :fromTime", fromTime, false);
        long subscriptionsCreated = safeEntityCount("select count(s.ciSubscriptionId) from RDCISubscription s where s.createdAt >= :fromTime", fromTime, false);
        long assessmentsCreated = safeEntityCount("select count(a.ciAssessmentSessionId) from RDCIAssessmentSession a where a.createdAt >= :fromTime", fromTime, false);
        leadsCreated = normalizeCount(leadsCreated);
        usersCreated = normalizeCount(usersCreated);
        subscriptionsCreated = normalizeCount(subscriptionsCreated);
        assessmentsCreated = normalizeCount(assessmentsCreated);

        if (totalVisits == 0 && !sendWhenNoActivity) {
            return;
        }

        List<Object[]> topUrlRows = safeTopUrls(fromTime, Math.max(3, maxTopUrls));
        List<Object[]> topUserRows = safeTopUsers(fromTime, Math.max(3, maxTopUrls));
        List<Object[]> topCountryRows = safeTopCountries(fromTime, Math.max(3, maxTopUrls));
        String subject = "Robo Dynamics activity report | " + fromTime.format(TS_FMT) + " to " + toTime.format(TS_FMT) + " IST";
        String body = buildBody(
                fromTime,
                toTime,
                totalVisits,
                uniqueIps,
                uniqueUrls,
                loggedInVisits,
                anonymousVisits,
                distinctLoggedInUsers,
                checkoutVisits,
                paymentSuccessVisits,
                registrationVisits,
                loginVisits,
                demoVisits,
                aptiParentVisits,
                aptiStudentVisits,
                aptiTestVisits,
                aptiResultVisits,
                leadsCreated,
                usersCreated,
                subscriptionsCreated,
                assessmentsCreated,
                visitorDataAvailable,
                topUrlRows,
                topUserRows,
                topCountryRows);

        for (String recipient : parseRecipients(reportTo)) {
            try {
                emailService.sendEmail(recipient, subject, body);
            } catch (Exception ex) {
                log.warn("Failed to send activity report email to {}", recipient, ex);
            }
        }
    }

    private long safeVisitorCount(CountSupplier supplier) {
        try {
            return supplier.get();
        } catch (Exception ex) {
            log.warn("Visitor count query failed: {}", ex.getMessage());
            return -1L;
        }
    }

    private long safeEntityCount(String hql, LocalDateTime fromTime, boolean timestampParam) {
        try (Session session = sessionFactory.openSession()) {
            Query<Long> query = session.createQuery(hql, Long.class);
            if (timestampParam) {
                query.setParameter("fromTime", Timestamp.valueOf(fromTime));
            } else {
                query.setParameter("fromTime", fromTime);
            }
            Long value = query.uniqueResult();
            return value == null ? 0L : value;
        } catch (Exception ex) {
            log.warn("Entity count query failed for hql: {}", hql);
            return -1L;
        }
    }

    private List<Object[]> safeTopUrls(LocalDateTime fromTime, int maxRows) {
        try {
            return visitorLogService.topUrlsSince(fromTime, maxRows);
        } catch (Exception ex) {
            log.warn("Top URL query failed: {}", ex.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Object[]> safeTopUsers(LocalDateTime fromTime, int maxRows) {
        try {
            return visitorLogService.topLoggedInUsersSince(fromTime, maxRows);
        } catch (Exception ex) {
            log.warn("Top user query failed: {}", ex.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Object[]> safeTopCountries(LocalDateTime fromTime, int maxRows) {
        try {
            return visitorLogService.topCountriesSince(fromTime, maxRows);
        } catch (Exception ex) {
            log.warn("Top country query failed: {}", ex.getMessage());
            return new ArrayList<>();
        }
    }

    private List<String> parseRecipients(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return Arrays.asList("achallaramakrishna@gmail.com");
        }
        return Arrays.stream(raw.split("[,;\\s]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }

    private String buildBody(
            LocalDateTime fromTime,
            LocalDateTime toTime,
            long totalVisits,
            long uniqueIps,
            long uniqueUrls,
            long loggedInVisits,
            long anonymousVisits,
            long distinctLoggedInUsers,
            long checkoutVisits,
            long paymentSuccessVisits,
            long registrationVisits,
            long loginVisits,
            long demoVisits,
            long aptiParentVisits,
            long aptiStudentVisits,
            long aptiTestVisits,
            long aptiResultVisits,
            long leadsCreated,
            long usersCreated,
            long subscriptionsCreated,
            long assessmentsCreated,
            boolean visitorDataAvailable,
            List<Object[]> topUrlRows,
            List<Object[]> topUserRows,
            List<Object[]> topCountryRows) {

        StringBuilder sb = new StringBuilder();
        sb.append("Robo Dynamics visitor activity summary").append('\n');
        sb.append("Window: ").append(fromTime.format(TS_FMT)).append(" to ").append(toTime.format(TS_FMT)).append(" IST").append('\n');
        sb.append('\n');

        sb.append("Traffic").append('\n');
        sb.append("- Total visits: ").append(totalVisits).append('\n');
        sb.append("- Unique IPs: ").append(uniqueIps).append('\n');
        sb.append("- Unique URLs: ").append(uniqueUrls).append('\n');
        sb.append("- Logged-in visits: ").append(loggedInVisits).append('\n');
        sb.append("- Anonymous visits: ").append(anonymousVisits).append('\n');
        sb.append("- Distinct logged-in users: ").append(distinctLoggedInUsers).append('\n');
        sb.append('\n');

        sb.append("Key activity URLs").append('\n');
        sb.append("- Checkout page visits: ").append(checkoutVisits).append('\n');
        sb.append("- Payment success page visits: ").append(paymentSuccessVisits).append('\n');
        sb.append("- Registration page visits: ").append(registrationVisits).append('\n');
        sb.append("- Login page visits: ").append(loginVisits).append('\n');
        sb.append("- Demo page visits: ").append(demoVisits).append('\n');
        sb.append("- AptiPath parent home visits: ").append(aptiParentVisits).append('\n');
        sb.append("- AptiPath student home visits: ").append(aptiStudentVisits).append('\n');
        sb.append("- AptiPath test page visits: ").append(aptiTestVisits).append('\n');
        sb.append("- AptiPath result page visits: ").append(aptiResultVisits).append('\n');
        sb.append('\n');

        sb.append("Growth signals from DB").append('\n');
        sb.append("- New leads created: ").append(leadsCreated).append('\n');
        sb.append("- New users created: ").append(usersCreated).append('\n');
        sb.append("- New subscriptions created: ").append(subscriptionsCreated).append('\n');
        sb.append("- New assessment sessions created: ").append(assessmentsCreated).append('\n');
        sb.append('\n');

        if (!visitorDataAvailable) {
            sb.append("Note: visitor URL metrics were unavailable in this window. ")
              .append("Check rd_visitor_logs table availability and DB permissions.")
              .append('\n')
              .append('\n');
        }

        sb.append("Top visited URLs").append('\n');
        if (topUrlRows == null || topUrlRows.isEmpty()) {
            sb.append("- No URL activity captured in this window.").append('\n');
        } else {
            int rank = 1;
            for (Object[] row : topUrlRows) {
                String url = row != null && row.length > 0 && row[0] != null ? String.valueOf(row[0]) : "(unknown)";
                long count = 0L;
                if (row != null && row.length > 1 && row[1] instanceof Number) {
                    count = ((Number) row[1]).longValue();
                }
                sb.append(rank).append(". ").append(url).append(" -> ").append(count).append('\n');
                rank++;
            }
        }
        sb.append('\n');
        sb.append("Top logged-in users").append('\n');
        if (topUserRows == null || topUserRows.isEmpty()) {
            sb.append("- No logged-in user activity captured in this window.").append('\n');
        } else {
            int rank = 1;
            for (Object[] row : topUserRows) {
                String userId = row != null && row.length > 0 && row[0] != null ? String.valueOf(row[0]) : "-";
                String userName = row != null && row.length > 1 && row[1] != null ? String.valueOf(row[1]) : "(unknown)";
                long count = 0L;
                if (row != null && row.length > 2 && row[2] instanceof Number) {
                    count = ((Number) row[2]).longValue();
                }
                sb.append(rank).append(". ").append(userName).append(" [").append(userId).append("] -> ").append(count).append('\n');
                rank++;
            }
        }
        sb.append('\n');

        sb.append("Top visitor countries (header-derived)").append('\n');
        if (topCountryRows == null || topCountryRows.isEmpty()) {
            sb.append("- No country information captured in this window.").append('\n');
        } else {
            int rank = 1;
            for (Object[] row : topCountryRows) {
                String country = row != null && row.length > 0 && row[0] != null ? String.valueOf(row[0]) : "(unknown)";
                long count = 0L;
                if (row != null && row.length > 1 && row[1] instanceof Number) {
                    count = ((Number) row[1]).longValue();
                }
                sb.append(rank).append(". ").append(country).append(" -> ").append(count).append('\n');
                rank++;
            }
        }
        sb.append('\n');
        sb.append("Generated automatically by scheduler: rd.activity.report.cron");
        return sb.toString();
    }

    private long normalizeCount(long count) {
        return count < 0 ? 0L : count;
    }

    @Scheduled(cron = "${rd.visitor.cleanup.cron:0 15 3 * * *}")
    public void cleanupOldVisitorLogs() {
        if (!cleanupEnabled) {
            return;
        }
        int keepDays = Math.max(1, cleanupKeepDays);
        LocalDateTime cutoff = LocalDateTime.now(IST).minusDays(keepDays);
        try {
            int deleted = visitorLogService.deleteLogsBefore(cutoff);
            log.info("Visitor log cleanup completed. Deleted {} rows older than {}", deleted, cutoff.format(TS_FMT));
        } catch (Exception ex) {
            log.warn("Visitor log cleanup failed: {}", ex.getMessage());
        }
    }

    @FunctionalInterface
    private interface CountSupplier {
        long get();
    }
}

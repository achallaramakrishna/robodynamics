package com.robodynamics.util;

import javax.servlet.http.HttpServletRequest;

public final class RDVisitorContextUtil {

    private RDVisitorContextUtil() {
    }

    public static String normalizedPath(HttpServletRequest request) {
        if (request == null) {
            return "/";
        }
        String uri = safe(request.getRequestURI());
        String ctx = safe(request.getContextPath());
        if (!ctx.isEmpty() && uri.startsWith(ctx)) {
            uri = uri.substring(ctx.length());
        }
        if (uri.isEmpty()) {
            uri = "/";
        }
        return uri;
    }

    public static String limit(String value, int maxLen) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.length() <= maxLen) {
            return trimmed;
        }
        return trimmed.substring(0, maxLen);
    }

    public static String deviceTypeFromUserAgent(String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return "UNKNOWN";
        }
        String ua = userAgent.toLowerCase();
        if (ua.contains("bot") || ua.contains("crawler") || ua.contains("spider") || ua.contains("curl")) {
            return "BOT";
        }
        if (ua.contains("tablet") || ua.contains("ipad")) {
            return "TABLET";
        }
        if (ua.contains("mobile") || ua.contains("android") || ua.contains("iphone")) {
            return "MOBILE";
        }
        return "DESKTOP";
    }

    public static VisitorGeo resolveGeoFromHeaders(HttpServletRequest request) {
        String country = firstHeader(
                request,
                "CF-IPCountry",
                "CloudFront-Viewer-Country",
                "X-AppEngine-Country",
                "X-Country-Code",
                "X-Geo-Country");

        String region = firstHeader(
                request,
                "X-AppEngine-Region",
                "X-Region",
                "X-Geo-Region");

        String city = firstHeader(
                request,
                "X-AppEngine-City",
                "CloudFront-Viewer-City",
                "X-City",
                "X-Geo-City");

        return new VisitorGeo(limit(country, 16), limit(region, 100), limit(city, 100));
    }

    public static String firstHeader(HttpServletRequest request, String... headerNames) {
        if (request == null || headerNames == null) {
            return null;
        }
        for (String name : headerNames) {
            String value = request.getHeader(name);
            if (value != null) {
                String trimmed = value.trim();
                if (!trimmed.isEmpty() && !"unknown".equalsIgnoreCase(trimmed)) {
                    return trimmed;
                }
            }
        }
        return null;
    }

    private static String safe(String value) {
        return value == null ? "" : value;
    }

    public static final class VisitorGeo {
        private final String countryCode;
        private final String region;
        private final String city;

        public VisitorGeo(String countryCode, String region, String city) {
            this.countryCode = countryCode;
            this.region = region;
            this.city = city;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public String getRegion() {
            return region;
        }

        public String getCity() {
            return city;
        }
    }
}

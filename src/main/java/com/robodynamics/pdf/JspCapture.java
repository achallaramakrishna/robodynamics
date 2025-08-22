package com.robodynamics.pdf;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;

public final class JspCapture {

    private JspCapture() {}

    /** Render a JSP/MVC path to HTML, with extra params merged into the request. */
    public static String renderToHtml(HttpServletRequest req,
                                      HttpServletResponse resp,
                                      String path,
                                      Map<String, String[]> extraParams) {
        try {
            // 1) Wrap request to inject/override params
            HttpServletRequest wrappedReq = new ParamRequestWrapper(req, extraParams);

            // 2) Wrap response to capture output
            CharResponseWrapper wrappedResp = new CharResponseWrapper(resp);

            // 3) Server-side include/forward
            RequestDispatcher rd = req.getRequestDispatcher(path);
            rd.include(wrappedReq, wrappedResp);

            return wrappedResp.toString();
        } catch (IOException | ServletException e) {
            throw new RuntimeException("Failed to render JSP path: " + path, e);
        }
    }

    /* --------- helpers --------- */

    public static final class ParamRequestWrapper extends HttpServletRequestWrapper {
        private final Map<String, String[]> merged;

        public ParamRequestWrapper(HttpServletRequest request, Map<String, String[]> extras) {
            super(request);
            merged = new HashMap<>(request.getParameterMap());
            if (extras != null) extras.forEach((k, v) -> merged.put(k, v));
        }
        @Override public String getParameter(String name) {
            String[] v = merged.get(name);
            return (v != null && v.length > 0) ? v[0] : super.getParameter(name);
        }
        @Override public Map<String, String[]> getParameterMap() { return Collections.unmodifiableMap(merged); }
        @Override public Enumeration<String> getParameterNames() { return Collections.enumeration(merged.keySet()); }
        @Override public String[] getParameterValues(String name) { return merged.get(name); }
    }

    public static final class CharResponseWrapper extends HttpServletResponseWrapper {
        private final StringWriter sw = new StringWriter();
        private final PrintWriter pw = new PrintWriter(sw);
        public CharResponseWrapper(HttpServletResponse response) { super(response); }
        @Override public PrintWriter getWriter() { return pw; }
        @Override public String toString() { pw.flush(); return sw.toString(); }
    }
}

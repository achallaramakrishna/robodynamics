package com.robodynamics.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class UploadProbeFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        if (req.getRequestURI().contains("/flashcards/media/upload")
            || req.getRequestURI().contains("/quiz")) {

            System.out.println("=== UPLOAD FILTER HIT ===");
            System.out.println("URI: " + req.getRequestURI());
            System.out.println("Method: " + req.getMethod());
            System.out.println("Content-Type: " + req.getContentType());
            System.out.println("Content-Length: " + req.getContentLength());
        }

        chain.doFilter(request, response);
    }
}

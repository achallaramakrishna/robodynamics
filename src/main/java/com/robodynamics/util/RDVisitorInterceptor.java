package com.robodynamics.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.robodynamics.service.RDVisitorLogService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class RDVisitorInterceptor implements HandlerInterceptor {
	
    @Autowired
    private RDVisitorLogService visitorLogService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {

        // Skip multipart uploads entirely
        if ("POST".equalsIgnoreCase(request.getMethod())
            && request.getContentType() != null
            && request.getContentType().startsWith("multipart/")) {
            return true;
        }

        try {
            String clientIP = IPAddressUtil.getClientIP(request);
            String url = request.getRequestURI();
            visitorLogService.logVisitAsync(clientIP, url);
        } catch (Exception e) {
            // Never block request
            e.printStackTrace();
        }

        return true;
    }


}

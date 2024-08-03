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
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String ipAddress = request.getRemoteAddr();
        String url = request.getRequestURI();
        visitorLogService.logVisit(ipAddress, url);
        return true;
    }
}

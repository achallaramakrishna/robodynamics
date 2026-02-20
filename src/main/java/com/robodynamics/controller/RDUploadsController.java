package com.robodynamics.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class RDUploadsController {

    @Value("${file.storage.disk-root:/opt/robodynamics}")
    private String diskRoot;

    @GetMapping("/uploads/**")
    public void serveUploads(HttpServletRequest request,
                             HttpServletResponse response) throws Exception {

        String uri = request.getRequestURI();      // /robodynamics/uploads/...
        String ctx = request.getContextPath();     // /robodynamics

        String relativePath = uri.substring(ctx.length()); // /uploads/...

        Path file = Paths.get(diskRoot).resolve(relativePath.substring(1));

        if (!Files.exists(file)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        response.setContentType(Files.probeContentType(file));
        response.setHeader("Cache-Control", "max-age=86400");
        Files.copy(file, response.getOutputStream());
    }
}

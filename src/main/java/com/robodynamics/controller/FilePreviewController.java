package com.robodynamics.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

@Controller
public class FilePreviewController {

    private final String uploadBasePath = "/opt/robodynamics/uploads";  // Adjust path to your actual uploads root

    @GetMapping("/preview")
    public void previewFile(@RequestParam("path") String path, HttpServletResponse response) throws IOException {
        // Ensure safe relative paths only
        File file = new File(uploadBasePath, path.replace("\\", "/")); // normalize slashes

        if (!file.exists() || !file.isFile()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "File not found");
            return;
        }

        String mimeType = Files.probeContentType(file.toPath());
        if (mimeType == null) {
            mimeType = "application/octet-stream";
        }

        response.setContentType(mimeType);
        response.setHeader("Content-Disposition", "inline; filename=\"" + file.getName() + "\"");
        response.setContentLengthLong(file.length());

        try (InputStream inputStream = new FileInputStream(file);
             OutputStream outStream = response.getOutputStream()) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outStream.write(buffer, 0, bytesRead);
            }
        }
    }
}

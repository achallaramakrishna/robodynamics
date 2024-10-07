package com.robodynamics.controller;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@Controller
public class FileUploadController {

    private static final String UPLOAD_DIRECTORY = "uploads"; // Relative to the server's root directory

    @GetMapping("/uploadForm")
    public String uploadForm() {
        return "uploadForm"; // Return the JSP form view
    }

    @PostMapping("/uploadFile")
    public String uploadFile(@RequestParam("file") MultipartFile file, HttpServletRequest request, RedirectAttributes redirectAttributes) {
        // Check if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("message", "Please select a file to upload.");
            return "redirect:/uploadForm";
        }

        // Define the upload path
        String uploadPath = request.getServletContext().getRealPath("") + File.separator + UPLOAD_DIRECTORY;
        System.out.println(uploadPath);
        // Create the directory if it doesn't exist
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }

        // Save the file to the server
        try {
            File destFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(destFile);
            redirectAttributes.addFlashAttribute("message", "You successfully uploaded '" + file.getOriginalFilename() + "'");
        } catch (IOException e) {
            redirectAttributes.addFlashAttribute("message", "File upload failed: " + e.getMessage());
            e.printStackTrace();
        }

        return "redirect:/uploadForm";
    }
}

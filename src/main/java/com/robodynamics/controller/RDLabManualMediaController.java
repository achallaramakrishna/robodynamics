package com.robodynamics.controller;

import java.io.File;
import java.nio.file.Files;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.service.RDLabManualMediaService;

@Controller
@RequestMapping("/admin/labmanual/media")
public class RDLabManualMediaController {

    @Autowired
    private RDLabManualMediaService mediaService;

    // Upload Image
    @PostMapping("/upload")
    @ResponseBody
    public String uploadImage(
            @RequestParam Integer labManualId,
            @RequestParam(required = false) Integer stepId,
            @RequestParam MultipartFile file
    ) {
        try {
            mediaService.uploadMedia(labManualId, stepId, file);
            return "SUCCESS";
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }

    // Delete Media
    @PostMapping("/delete")
    @ResponseBody
    public String delete(@RequestParam Integer mediaId) {
        mediaService.delete(mediaId);
        return "DELETED";
    }

    // Serve Media
    @GetMapping("/view/{mediaId}")
    public void serve(@PathVariable Integer mediaId,
                      HttpServletResponse response) {
        try {
            File file = mediaService.getFile(mediaId);

            response.setContentType(Files.probeContentType(file.toPath()));
            Files.copy(file.toPath(), response.getOutputStream());
            response.flushBuffer();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}

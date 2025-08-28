// src/main/java/com/robodynamics/storage/TestFileStorage.java
package com.robodynamics.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class TestFileStorage {

    private final Path baseDir;

    public TestFileStorage(@Value("${robodynamics.uploads.tests-dir}") String base) {
        this.baseDir = Paths.get(base).toAbsolutePath().normalize();
    }

    /** Save a file, enforcing PDF. Returns metadata of the stored file (absolute path, size, etc). */
    public StoredFile savePdf(MultipartFile file, Integer testId) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String ct = String.valueOf(file.getContentType());
        String name = String.valueOf(file.getOriginalFilename());
        boolean looksPdf = "application/pdf".equalsIgnoreCase(ct) || name.toLowerCase().endsWith(".pdf");
        if (!looksPdf) {
            throw new IOException("Only PDF files are allowed.");
        }

        String datePath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        Path targetDir = baseDir.resolve(datePath);
        Files.createDirectories(targetDir);

        String clean = StringUtils.cleanPath(name == null ? "schedule.pdf" : name).replaceAll("[\\r\\n]", "_");
        String unique = (testId != null ? "t" + testId + "_" : "") + UUID.randomUUID() + "_" + clean;

        Path dest = targetDir.resolve(unique).normalize();
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);

        StoredFile sf = new StoredFile();
        sf.absolutePath = dest.toString();
        sf.originalName = clean;
        sf.contentType  = "application/pdf";
        sf.size         = file.getSize();
        return sf;
    }

    public byte[] read(String absolutePath) throws IOException {
        return Files.readAllBytes(Paths.get(absolutePath));
    }

    public boolean deleteIfExists(String absolutePath) {
        try { return Files.deleteIfExists(Paths.get(absolutePath)); } catch (Exception e) { return false; }
    }

    public static class StoredFile {
        public String absolutePath;
        public String originalName;
        public String contentType;
        public long   size;
    }
}

package com.robodynamics.service.impl;

import java.io.IOException;
import java.nio.file.*;
import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.service.RDFileStorage;

@Service
public class RDFileStorageImpl implements RDFileStorage {

    /** 
     * Base folder for all uploads.
     * By default set to /opt/robodynamics/uploads
     * Can still be overridden via application.properties:
     * rd.uploads.root=/some/other/path
     */
    private final Path root;

    public RDFileStorageImpl(@Value("${rd.uploads.root:/opt/robodynamics/uploads}") String rootDir) {
        this.root = Paths.get(rootDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(root);
    }

    @Override
    public String storeTestSchedulePdf(Integer testId, MultipartFile file) {
        if (testId == null) throw new IllegalArgumentException("testId is required");
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is empty");

        String original = sanitize(file.getOriginalFilename() == null ? "school.pdf" : file.getOriginalFilename());
        String filename = "schedule-" + System.currentTimeMillis() + "_" + original;

        Path dir  = resolveSafe(Paths.get("tests", String.valueOf(testId)));
        Path dest = dir.resolve(filename);

        write(file, dir, dest);
        return root.relativize(dest).toString().replace('\\', '/');
    }

    @Override
    public String storeTestAttemptAttachment(Integer testId, Integer enrollmentId, MultipartFile file) {
        if (testId == null || enrollmentId == null) throw new IllegalArgumentException("testId and enrollmentId are required");
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is empty");

        String original = sanitize(file.getOriginalFilename() == null ? "proof" : file.getOriginalFilename());
        String filename = System.currentTimeMillis() + "_" + original;

        Path dir  = resolveSafe(Paths.get("tests", String.valueOf(testId), "attempts", String.valueOf(enrollmentId)));
        Path dest = dir.resolve(filename);

        write(file, dir, dest);
        return root.relativize(dest).toString().replace('\\', '/');
    }

    public String storeDetailFile(Integer detailId, MultipartFile file) {
        if (detailId == null) throw new IllegalArgumentException("detailId is required");
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("file is empty");

        String original = sanitize(file.getOriginalFilename() == null ? "resource" : file.getOriginalFilename());
        String filename = System.currentTimeMillis() + "_" + original;

        Path dir  = resolveSafe(Paths.get("details", String.valueOf(detailId)));
        Path dest = dir.resolve(filename);

        write(file, dir, dest);
        return root.relativize(dest).toString().replace('\\', '/');
    }

    @Override
    public void deleteIfExists(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return;
        try {
            Path p = resolveSafe(Paths.get(relativePath));
            Files.deleteIfExists(p);
        } catch (IOException ignored) { }
    }

    /* ---------------- helpers ---------------- */

    private void write(MultipartFile file, Path dir, Path dest) {
        try {
            Files.createDirectories(dir);
            file.transferTo(dest.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private Path resolveSafe(Path child) {
        Path p = root.resolve(child).normalize();
        if (!p.startsWith(root)) throw new SecurityException("Invalid path");
        return p;
    }

    private String sanitize(String name) {
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}

package com.robodynamics.service;
import java.io.File;

import org.springframework.web.multipart.MultipartFile;

public interface RDLabManualMediaService {

    void uploadMedia(Integer labManualId,
                     Integer stepId,
                     MultipartFile file) throws Exception;

    void delete(Integer mediaId);

    File getFile(Integer mediaId);
}

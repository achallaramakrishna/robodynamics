package com.robodynamics.service.impl;

import java.io.File;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDLabManual;
import com.robodynamics.model.RDLabManualMedia;
import com.robodynamics.model.RDLabStep;
import com.robodynamics.service.RDLabManualMediaService;


@Service
@Transactional
public class RDLabManualMediaServiceImpl
        implements RDLabManualMediaService {

    @Autowired
    private SessionFactory sessionFactory;

    private final String ROOT = "C:/robodynamics_uploads/labmanual";

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void uploadMedia(Integer labManualId,
                            Integer stepId,
                            MultipartFile file) throws Exception {

        String storedName =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();

        File folder = new File(ROOT + "/" + labManualId);
        if (!folder.exists()) folder.mkdirs();

        File target = new File(folder, storedName);
        file.transferTo(target);

        RDLabManualMedia media = new RDLabManualMedia();
        media.setLabManual(
                getSession().get(RDLabManual.class, labManualId)
        );

        if (stepId != null) {
            media.setLabStep(
                    getSession().get(RDLabStep.class, stepId)
            );
        }

        media.setOriginalFileName(file.getOriginalFilename());
        media.setStoredFileName(storedName);
        media.setStoragePath(target.getAbsolutePath());
        media.setMimeType(file.getContentType());
        media.setFileSize((int) file.getSize());
        media.setMediaType("IMAGE");

        getSession().save(media);
    }

    @Override
    public void delete(Integer mediaId) {
        RDLabManualMedia media =
                getSession().get(RDLabManualMedia.class, mediaId);

        if (media != null) {
            new File(media.getStoragePath()).delete();
            getSession().delete(media);
        }
    }

    @Override
    public File getFile(Integer mediaId) {
        RDLabManualMedia media =
                getSession().get(RDLabManualMedia.class, mediaId);

        return new File(media.getStoragePath());
    }
}

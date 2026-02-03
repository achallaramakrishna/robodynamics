package com.robodynamics.service;

import java.io.OutputStream;

public interface RDExamResultPdfService {

    void generateResultPdf(Integer submissionId, OutputStream outputStream)
            throws Exception;
}

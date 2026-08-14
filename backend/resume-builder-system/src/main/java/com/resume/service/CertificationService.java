package com.resume.service;

import com.resume.entity.Certification;
import java.util.List;

public interface CertificationService {

    Certification saveCertification(Certification certification);

    List<Certification> getByPersonalId(Long personalId);

    void deleteCertification(Long id);
}
package com.resume.service.impl;

import com.resume.entity.Certification;
import com.resume.entity.Personal;
import com.resume.repository.CertificationRepository;
import com.resume.repository.PersonalRepository;
import com.resume.service.CertificationService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificationServiceImpl
        implements CertificationService {

    private final CertificationRepository repository;

    private final PersonalRepository personalRepository;

    public CertificationServiceImpl(
            CertificationRepository repository,
            PersonalRepository personalRepository) {

        this.repository = repository;

        this.personalRepository = personalRepository;
    }

    @Override
    public Certification saveCertification(
            Certification certification) {

        /*
         * Get Personal ID sent from React/Postman
         */
        if (certification.getPersonal() != null
                && certification.getPersonal().getId() != null) {

            Long personalId =
                    certification.getPersonal().getId();

            /*
             * Find actual Personal record
             */
            Personal personal =
                    personalRepository.findById(personalId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Personal not found with id: "
                                                    + personalId
                                    )
                            );

            /*
             * Attach actual Personal entity
             */
            certification.setPersonal(personal);
        }

        /*
         * Save Certification
         */
        return repository.save(certification);
    }

    @Override
    public List<Certification> getByPersonalId(
            Long personalId) {

        return repository.findByPersonalId(personalId);
    }

    @Override
    public void deleteCertification(Long id) {

        repository.deleteById(id);
    }
}
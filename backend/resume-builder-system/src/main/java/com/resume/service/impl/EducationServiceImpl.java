package com.resume.service.impl;

import com.resume.entity.Education;
import com.resume.entity.Personal;
import com.resume.repository.EducationRepository;
import com.resume.repository.PersonalRepository;
import com.resume.service.EducationService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;

    private final PersonalRepository personalRepository;


    public EducationServiceImpl(
            EducationRepository educationRepository,
            PersonalRepository personalRepository) {

        this.educationRepository = educationRepository;

        this.personalRepository = personalRepository;
    }


    // =====================================================
    // SAVE / CREATE / UPDATE
    // =====================================================

    @Override
    public Education save(Education education) {

        /*
         * Get Personal ID sent from React/Postman
         */

        if (education.getPersonal() != null
                && education.getPersonal().getId() != null) {

            Long personalId =
                    education.getPersonal().getId();


            /*
             * Find actual Personal record
             */

            Personal personal =
                    personalRepository
                            .findById(personalId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Personal record not found with ID: "
                                                    + personalId
                                    )
                            );


            /*
             * IMPORTANT
             *
             * Set the actual Personal entity.
             *
             * This will make Hibernate save:
             *
             * education.personal_id = personalId
             */

            education.setPersonal(personal);

        } else {

            throw new RuntimeException(
                    "Personal ID is required for education."
            );

        }


        /*
         * Save education
         */

        return educationRepository.save(education);
    }


    // =====================================================
    // GET EDUCATION BY PERSONAL ID
    // =====================================================

    @Override
    public List<Education> getByPersonalId(Long personalId) {

        return educationRepository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // GET ONE EDUCATION
    // =====================================================

    @Override
    public Education getById(Long id) {

        return educationRepository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void delete(Long id) {

        educationRepository.deleteById(id);
    }
}
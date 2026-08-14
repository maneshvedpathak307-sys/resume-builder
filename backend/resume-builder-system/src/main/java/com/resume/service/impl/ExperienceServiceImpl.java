package com.resume.service.impl;

import com.resume.entity.Experience;
import com.resume.entity.Personal;
import com.resume.repository.ExperienceRepository;
import com.resume.repository.PersonalRepository;
import com.resume.service.ExperienceService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceServiceImpl
        implements ExperienceService {

    private final ExperienceRepository repository;

    private final PersonalRepository personalRepository;


    public ExperienceServiceImpl(
            ExperienceRepository repository,
            PersonalRepository personalRepository) {

        this.repository = repository;

        this.personalRepository = personalRepository;
    }


    // =====================================================
    // SAVE / UPDATE EXPERIENCE
    // =====================================================

    @Override
    public Experience saveExperience(
            Experience experience) {


        // Check Personal object

        if (experience.getPersonal() == null
                || experience.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for experience."
            );
        }


        // Get Personal ID

        Long personalId =
                experience.getPersonal().getId();


        // Find Personal from database

        Personal personal =
                personalRepository.findById(personalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal not found with ID: "
                                                + personalId
                                )
                        );


        // Attach actual Personal entity

        experience.setPersonal(personal);


        // Save experience

        return repository.save(experience);
    }


    // =====================================================
    // GET EXPERIENCE BY PERSONAL ID
    // =====================================================

    @Override
    public List<Experience> getByPersonalId(
            Long personalId) {

        return repository.findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE EXPERIENCE
    // =====================================================

    @Override
    public void deleteExperience(Long id) {

        repository.deleteById(id);
    }
}
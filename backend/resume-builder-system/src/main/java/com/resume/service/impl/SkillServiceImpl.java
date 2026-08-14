package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.Skill;
import com.resume.repository.PersonalRepository;
import com.resume.repository.SkillRepository;
import com.resume.service.SkillService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository repository;

    private final PersonalRepository personalRepository;


    public SkillServiceImpl(
            SkillRepository repository,
            PersonalRepository personalRepository) {

        this.repository = repository;

        this.personalRepository = personalRepository;
    }


    // =====================================================
    // SAVE / UPDATE SKILL
    // =====================================================

    @Override
    public Skill saveSkill(Skill skill) {

        if (skill.getPersonal() == null
                || skill.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for skill."
            );
        }


        Long personalId =
                skill.getPersonal().getId();


        Personal personal =
                personalRepository.findById(personalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal not found with ID: "
                                                + personalId
                                )
                        );


        // Attach actual Personal entity

        skill.setPersonal(personal);


        return repository.save(skill);
    }


    // =====================================================
    // GET SKILLS BY PERSONAL ID
    // =====================================================

    @Override
    public List<Skill> getByPersonalId(Long personalId) {

        return repository.findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE SKILL
    // =====================================================

    @Override
    public void deleteSkill(Long id) {

        repository.deleteById(id);
    }
}
package com.resume.service;

import com.resume.entity.Experience;

import java.util.List;

public interface ExperienceService {

    Experience saveExperience(Experience experience);

    List<Experience> getByPersonalId(Long personalId);

    void deleteExperience(Long id);

}
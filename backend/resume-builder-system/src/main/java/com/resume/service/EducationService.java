package com.resume.service;

import com.resume.entity.Education;

import java.util.List;

public interface EducationService {

    Education save(Education education);

    List<Education> getByPersonalId(Long personalId);

    Education getById(Long id);

    void delete(Long id);
}
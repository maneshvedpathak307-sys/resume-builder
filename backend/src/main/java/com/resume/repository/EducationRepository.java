package com.resume.repository;

import com.resume.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EducationRepository
        extends JpaRepository<Education, Long> {

    List<Education> findByPersonalId(Long personalId);
}
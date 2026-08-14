package com.resume.repository;

import com.resume.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonalRepository extends JpaRepository<Personal, Long> {

    List<Personal> findByUserId(Long userId);

    Optional<Personal> findFirstByUserId(Long userId);
}
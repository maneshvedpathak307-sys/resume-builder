package com.resume.service;

import com.resume.entity.Skill;
import java.util.List;

public interface SkillService {

    Skill saveSkill(Skill skill);

    List<Skill> getByPersonalId(Long personalId);

    void deleteSkill(Long id);
}
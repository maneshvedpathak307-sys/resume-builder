package com.resume.controller;

import com.resume.entity.Skill;
import com.resume.service.SkillService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:3000")
public class SkillController {

    private final SkillService service;

    public SkillController(SkillService service) {
        this.service = service;
    }

    @PostMapping
    public Skill save(@RequestBody Skill skill) {
        return service.saveSkill(skill);
    }
    
    @PutMapping("/{id}")
    public Skill update(@PathVariable Long id,
                        @RequestBody Skill skill) {

        skill.setId(id);

        return service.saveSkill(skill);
    }

    @GetMapping("/personal/{id}")
    public ResponseEntity<List<Skill>> getByPersonalId(@PathVariable Long id) {
        return ResponseEntity.ok(
                service.getByPersonalId(id)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteSkill(id);
    }
}
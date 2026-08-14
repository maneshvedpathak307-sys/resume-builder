package com.resume.controller;

import com.resume.entity.Project;
import com.resume.service.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project save(@RequestBody Project project) {
        return service.saveProject(project);
    }
    
    @PutMapping("/{id}")
    public Project update(@PathVariable Long id,
                          @RequestBody Project project) {

        project.setId(id);

        return service.saveProject(project);
    }

    @GetMapping("/personal/{id}")
    public ResponseEntity<List<Project>> getByPersonalId(@PathVariable Long id) {
        return ResponseEntity.ok(
                service.getByPersonalId(id)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteProject(id);
    }
}
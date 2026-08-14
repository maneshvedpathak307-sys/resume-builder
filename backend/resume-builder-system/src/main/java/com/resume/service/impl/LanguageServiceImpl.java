package com.resume.service.impl;

import com.resume.entity.Language;
import com.resume.repository.LanguageRepository;
import com.resume.service.LanguageService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageServiceImpl implements LanguageService {

    private final LanguageRepository repository;

    public LanguageServiceImpl(LanguageRepository repository) {
        this.repository = repository;
    }

    @Override
    public Language saveLanguage(Language language) {
        return repository.save(language);
    }

    @Override
    public List<Language> getByPersonalId(Long personalId) {
        return repository.findByPersonalId(personalId);
    }

    @Override
    public void deleteLanguage(Long id) {
        repository.deleteById(id);
    }
}
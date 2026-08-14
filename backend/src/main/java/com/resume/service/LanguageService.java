package com.resume.service;

import com.resume.entity.Language;

import java.util.List;

public interface LanguageService {

    Language saveLanguage(Language language);

    List<Language> getByPersonalId(Long personalId);

    void deleteLanguage(Long id);

}
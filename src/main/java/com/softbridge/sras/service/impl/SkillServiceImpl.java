package com.softbridge.sras.service.impl;

import com.softbridge.sras.model.Skill;
import com.softbridge.sras.repository.SkillRepository;
import com.softbridge.sras.service.SkillService;
import org.springframework.stereotype.Service;
import com.softbridge.sras.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
    }

    @Override
    public Skill updateSkill(Long id, Skill skill) {

        Skill existingSkill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        existingSkill.setSkillName(skill.getSkillName());
        existingSkill.setSkillCategory(skill.getSkillCategory());

        return skillRepository.save(existingSkill);
    }

    @Override
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
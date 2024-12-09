package com.robodynamics.service.impl;

import com.robodynamics.dao.RDGoalDao;
import com.robodynamics.model.RDExam;
import com.robodynamics.model.RDGoal;
import com.robodynamics.model.RDGoalTemplate;
import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDPrepTest;
import com.robodynamics.service.RDExamService;
import com.robodynamics.service.RDGoalService;
import com.robodynamics.service.RDGoalTemplateService;
import com.robodynamics.service.RDPrepTestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import java.util.List;

@Service
public class RDGoalServiceImpl implements RDGoalService {

    @Autowired
    private RDGoalDao goalDao;
    
    @Autowired
    private RDExamService examService;
    
    @Autowired
    private RDGoalTemplateService goalTemplateService;
    
    @Autowired
    private RDPrepTestService prepTestService;
    

    private String getExamType(int examId) {
        RDExam exam = examService.getExamById(examId);
        if (exam != null) {
            return exam.getExamType();
        }
        throw new IllegalArgumentException("Invalid examId: " + examId);
    }


    @Override
    public void saveGoal(RDGoal goal) {
        goalDao.save(goal);
    }

    @Override
    public RDGoal getGoalById(int id) {
        return goalDao.findById(id);
    }

    @Override
    public List<RDGoal> getGoalsByLearningPathId(int learningPathId) {
        return goalDao.findByLearningPathId(learningPathId);
    }

    @Override
    public List<RDGoal> getAllGoals() {
        return goalDao.findAll();
    }

    @Override
    public void updateGoal(RDGoal goal) {
        goalDao.update(goal);
    }

    @Override
    public void deleteGoalById(int id) {
        goalDao.deleteById(id);
    }
    
    private Date calculateDueDate(RDGoalTemplate template, Date targetDate) {
        if (template == null || targetDate == null) {
            throw new IllegalArgumentException("Template or target date cannot be null.");
        }

        // Get the target duration in days from the template
        int targetDurationDays = template.getTargetDurationDays();

        // Use Calendar to subtract days from the target date
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(targetDate);
        calendar.add(Calendar.DAY_OF_YEAR, -targetDurationDays);

        // Return the calculated due date
        return calendar.getTime();
    }
    
    public boolean generateGoalsForLearningPath(RDLearningPath learningPath) {
        List<RDGoal> existingGoals = getGoalsByLearningPathId(learningPath.getId());
        if (!existingGoals.isEmpty()) {
            return false; // Goals already exist, no action needed
        }

        // Logic to generate goals
        List<RDGoal> newGoals = new ArrayList<>();
        // Add goal generation logic here
        // Example:
     //   newGoals.add(new RDGoal("Complete Chapter 1", learningPath));
     //   newGoals.add(new RDGoal("Complete Chapter 2", learningPath));

        // Save new goals
        for (RDGoal goal : newGoals) {
            saveGoal(goal);
        }
        return true; // Goals successfully generated
    }




}

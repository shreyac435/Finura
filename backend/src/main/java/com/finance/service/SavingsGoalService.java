package com.finance.service;

import com.finance.entity.SavingsGoal;
import com.finance.repository.SavingsGoalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavingsGoalService {

@Autowired
private SavingsGoalRepository savingsGoalRepository;

public List<SavingsGoal> getAllGoals() {
    return savingsGoalRepository.findAll();
}

public SavingsGoal getGoalById(Integer id) {
    return savingsGoalRepository.findById(id).orElse(null);
}

public SavingsGoal addGoal(SavingsGoal goal) {
    return savingsGoalRepository.save(goal);
}

public SavingsGoal updateGoal(Integer id, SavingsGoal updatedGoal) {

    SavingsGoal goal = savingsGoalRepository.findById(id).orElse(null);

    if (goal == null) {
        return null;
    }

    goal.setUser(updatedGoal.getUser());
    goal.setGoalName(updatedGoal.getGoalName());
    goal.setTargetAmount(updatedGoal.getTargetAmount());
    goal.setCurrentAmount(updatedGoal.getCurrentAmount());
    goal.setDeadline(updatedGoal.getDeadline());
    goal.setStatus(updatedGoal.getStatus());

    return savingsGoalRepository.save(goal);
}

public void deleteGoal(Integer id) {
    savingsGoalRepository.deleteById(id);
}

}


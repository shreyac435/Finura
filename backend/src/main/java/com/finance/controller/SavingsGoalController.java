package com.finance.controller;

import com.finance.entity.SavingsGoal;
import com.finance.service.SavingsGoalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class SavingsGoalController {

@Autowired
private SavingsGoalService savingsGoalService;

@GetMapping
public List<SavingsGoal> getAllGoals() {
    return savingsGoalService.getAllGoals();
}

@GetMapping("/{id}")
public SavingsGoal getGoalById(@PathVariable Integer id) {
    return savingsGoalService.getGoalById(id);
}

@PostMapping
public SavingsGoal addGoal(@RequestBody SavingsGoal goal) {
    return savingsGoalService.addGoal(goal);
}

@PutMapping("/{id}")
public SavingsGoal updateGoal(
        @PathVariable Integer id,
        @RequestBody SavingsGoal goal) {

    return savingsGoalService.updateGoal(id, goal);
}

@DeleteMapping("/{id}")
public String deleteGoal(@PathVariable Integer id) {

    savingsGoalService.deleteGoal(id);

    return "Goal deleted successfully";
}


}

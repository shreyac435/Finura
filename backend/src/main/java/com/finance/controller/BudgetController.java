package com.finance.controller;

import com.finance.dto.BudgetDTO;
import com.finance.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public List<BudgetDTO> getAllBudgets() {
        return budgetService.getAllBudgets();
    }
}

package com.finance.controller;

import com.finance.entity.Income;
import com.finance.service.IncomeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
@CrossOrigin(origins = "*")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping
    public List<Income> getAllIncome() {
        return incomeService.getAllIncome();
    }

    @GetMapping("/{id}")
    public Income getIncomeById(@PathVariable Integer id) {
        return incomeService.getIncomeById(id);
    }

    @PostMapping
    public Income addIncome(@RequestBody Income income) {
        return incomeService.addIncome(income);
    }

    @PutMapping("/{id}")
    public Income updateIncome(
            @PathVariable Integer id,
            @RequestBody Income income) {

        return incomeService.updateIncome(id, income);
    }

    @DeleteMapping("/{id}")
    public String deleteIncome(@PathVariable Integer id) {

        incomeService.deleteIncome(id);

        return "Income deleted successfully";
    }
}

package com.finance.controller;

import com.finance.entity.Expense;
import com.finance.service.ExpenseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable Integer id) {
        return expenseService.getExpenseById(id);
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(
            @PathVariable Integer id,
            @RequestBody Expense expense) {

        return expenseService.updateExpense(id, expense);
    }

    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Integer id) {

        expenseService.deleteExpense(id);

        return "Expense deleted successfully";
    }
}

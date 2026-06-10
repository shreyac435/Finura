package com.finance.service;

import com.finance.entity.Expense;
import com.finance.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Integer id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Integer id, Expense updatedExpense) {

        Expense expense = expenseRepository.findById(id).orElse(null);

        if (expense == null) {
            return null;
        }

        expense.setUser(updatedExpense.getUser());
        expense.setCategory(updatedExpense.getCategory());
        expense.setAmount(updatedExpense.getAmount());
        expense.setExpenseDate(updatedExpense.getExpenseDate());
        expense.setNotes(updatedExpense.getNotes());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Integer id) {
        expenseRepository.deleteById(id);
    }
}
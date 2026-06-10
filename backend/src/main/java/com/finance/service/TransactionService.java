package com.finance.service;

import com.finance.dto.TransactionDTO;
import com.finance.entity.Expense;
import com.finance.entity.Income;
import com.finance.repository.ExpenseRepository;
import com.finance.repository.IncomeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<TransactionDTO> getAllTransactions() {

        List<TransactionDTO> transactions = new ArrayList<>();

        for (Income income : incomeRepository.findAll()) {

            transactions.add(
                new TransactionDTO(
                    income.getIncomeId(),
                    "income",
                    income.getAmount(),
                    income.getSource(),
                    income.getIncomeDate(),
                    income.getDescription()
                )
            );
        }

        for (Expense expense : expenseRepository.findAll()) {

            transactions.add(
                new TransactionDTO(
                    expense.getExpenseId(),
                    "expense",
                    expense.getAmount(),
                    expense.getCategory().getCategoryName(),
                    expense.getExpenseDate(),
                    expense.getNotes()
                )
            );
        }

        transactions.sort(
            Comparator.comparing(TransactionDTO::getDate)
                      .reversed()
        );

        return transactions;
    }
}

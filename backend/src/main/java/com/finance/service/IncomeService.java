package com.finance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.finance.entity.Income;
import com.finance.repository.IncomeRepository;

import java.util.List;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    public Income getIncomeById(Integer id) {
        return incomeRepository.findById(id).orElse(null);
    }

    public Income addIncome(Income income) {
        return incomeRepository.save(income);
    }

    public Income updateIncome(Integer id, Income updatedIncome) {

        Income income = incomeRepository.findById(id).orElse(null);

        if (income == null) {
            return null;
        }

        income.setUser(updatedIncome.getUser());
        income.setAmount(updatedIncome.getAmount());
        income.setSource(updatedIncome.getSource());
        income.setIncomeDate(updatedIncome.getIncomeDate());
        income.setDescription(updatedIncome.getDescription());

        return incomeRepository.save(income);
    }

    public void deleteIncome(Integer id) {
        incomeRepository.deleteById(id);
    }
}
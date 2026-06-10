package com.finance.service;

import com.finance.dto.BudgetDTO;
import com.finance.entity.BudgetCategory;
import com.finance.repository.BudgetCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    @Autowired
    private BudgetCategoryRepository budgetCategoryRepository;

    public List<BudgetDTO> getAllBudgets() {

        return budgetCategoryRepository.findAll()
                .stream()
                .map(bc -> new BudgetDTO(
                        bc.getBudgetCategoryId(),
                        bc.getCategory().getCategoryName(),
                        bc.getLimitAmount()
                ))
                .toList();
    }
}
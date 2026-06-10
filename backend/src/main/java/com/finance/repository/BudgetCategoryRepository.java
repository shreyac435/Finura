package com.finance.repository;

import com.finance.entity.BudgetCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetCategoryRepository extends JpaRepository<BudgetCategory, Integer> {
}
package com.finance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "budget_categories")
public class BudgetCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_category_id")
    private Integer budgetCategoryId;

    @ManyToOne
    @JoinColumn(name = "budget_id")
    private Budget budget;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ExpenseCategory category;

    @Column(name = "limit_amount", nullable = false)
    private BigDecimal limitAmount;

    public Integer getBudgetCategoryId() {
        return budgetCategoryId;
    }

    public void setBudgetCategoryId(Integer budgetCategoryId) {
        this.budgetCategoryId = budgetCategoryId;
    }

    public Budget getBudget() {
        return budget;
    }

    public void setBudget(Budget budget) {
        this.budget = budget;
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }
}
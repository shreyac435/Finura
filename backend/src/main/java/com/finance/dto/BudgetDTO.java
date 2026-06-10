package com.finance.dto;

import java.math.BigDecimal;

public class BudgetDTO {

    private Integer id;
    private String category;
    private BigDecimal limit;

    public BudgetDTO() {}

    public BudgetDTO(Integer id, String category, BigDecimal limit) {
        this.id = id;
        this.category = category;
        this.limit = limit;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getLimit() {
        return limit;
    }

    public void setLimit(BigDecimal limit) {
        this.limit = limit;
    }
}
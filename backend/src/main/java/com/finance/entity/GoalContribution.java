package com.finance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "goal_contributions")
public class GoalContribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contribution_id")
    private Integer contributionId;

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private SavingsGoal goal;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "contribution_date", nullable = false)
    private LocalDate contributionDate;
}

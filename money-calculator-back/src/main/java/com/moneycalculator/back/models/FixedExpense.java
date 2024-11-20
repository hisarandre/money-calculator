package com.moneycalculator.back.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "fixed_expenses")
public class FixedExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "_id")
    private Integer id;

    @NotNull(message = "Label is required")
    @Size(min = 1, message = "Label cannot be empty")
    private String label;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount must be zero or greater")
    private Double amount;

    @NotNull(message = "Frequency is required")
    @DecimalMin(value = "1", inclusive = true, message = "Frequency must be one or greater")
    private int frequency;

    @ManyToOne
    @JoinColumn(name = "budget_id", referencedColumnName = "_id", nullable = false)
    private Budget budget;
}

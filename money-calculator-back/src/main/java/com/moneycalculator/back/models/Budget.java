package com.moneycalculator.back.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "_id")
    private Integer id;

    @NotNull(message = "label is required")
    @Size(min = 1, message = "Label cannot be empty")
    private String label;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @NotNull(message = "Amount is required")
    private Double amount;

    @NotNull(message = "Conversion status is required")
    private Boolean conversion;

    @NotNull(message = "Main currency is required")
    @Column(name = "main_currency", nullable = false)
    private String mainCurrency;

    @Column(name = "secondary_currency")
    private String secondaryCurrency;

}

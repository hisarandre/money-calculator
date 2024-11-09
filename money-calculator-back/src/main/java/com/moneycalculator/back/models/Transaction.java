package com.moneycalculator.back.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "_id")
    private Integer id;

    private String label;

    private Double amount;

    @Column(name = "type", insertable = false, updatable = false)
    private String type;

    @ManyToOne
    @JoinColumn(name = "account_id", referencedColumnName = "_id", nullable = false)
    private Account account;
}

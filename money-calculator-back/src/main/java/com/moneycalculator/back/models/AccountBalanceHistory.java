package com.moneycalculator.back.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account_balance_histories")
public class AccountBalanceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "sent", nullable = false)
    private java.util.Date date;

    @Column(name = "total", nullable = false)
    private Double total;

    @Column(name = "earning", nullable = false)
    private Double earning;

    @OneToMany(mappedBy = "accountBalanceHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccountBalance> accountBalances;

}


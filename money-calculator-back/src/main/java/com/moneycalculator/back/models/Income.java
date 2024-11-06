package com.moneycalculator.back.models;

import com.moneycalculator.back.models.Transaction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("income")
public class Income extends Transaction {

}

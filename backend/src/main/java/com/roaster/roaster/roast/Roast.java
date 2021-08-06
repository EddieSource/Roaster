package com.roaster.roaster.roast;

import java.util.Date;
import java.util.function.IntPredicate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;

@Data
@Entity
public class Roast {
	@Id
	@GeneratedValue
	private long id; 
	
	private String content;
	
	@Temporal(TemporalType.TIMESTAMP)
	private Date timestamp; 

	
}

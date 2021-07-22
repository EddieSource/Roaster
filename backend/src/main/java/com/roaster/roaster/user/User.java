package com.roaster.roaster.user;

import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Entity
@Data	//create template for setters,getters,equal,hashcode
//@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {
	
	@Id
	@GeneratedValue
	private long id; 
	
	// set constraint
	@NotNull(message = "{roaster.constraints.username.NotNull.message}")
	@Size(min = 4, max=255)
	@UniqueUsername
	private String username; 
	
	@NotNull
	@Size(min = 4, max=255)
	private String displayName; 
	
	@NotNull(message = "{roaster.constraints.password.NotNull.message}")
	@Size(min = 8, max=255)
	private String password; 
}

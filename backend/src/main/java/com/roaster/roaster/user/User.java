package com.roaster.roaster.user;

import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Entity
@Data	//create template for setters,getters,equal,hashcode
public class User {
	
	@Id
	@GeneratedValue
	private long id; 
	
	// set constraint
	@NotNull
	@Size(min = 4, max=255)
	private String username; 
	
	@NotNull
	@Size(min = 4, max=255)
	private String displayName; 
	
	@NotNull
	@Size(min = 8, max=255)
	private String password; 
}

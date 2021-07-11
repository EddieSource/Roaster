package com.roaster.roaster.user;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;

@Entity
@Data	//create template for setters,getters,equal,hashcode
public class User {
	
	@Id
	@GeneratedValue
	private long id; 
	
	private String username; 
	private String displayName; 
	private String password; 
}

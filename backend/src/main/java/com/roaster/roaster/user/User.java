package com.roaster.roaster.user;

import lombok.Data;

@Data	//create template for setters,getters,equal,hashcode
public class User {
	private String username; 
	private String displayName; 
	private String password; 
}

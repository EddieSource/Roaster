package com.roaster.roaster.user.vm;

import lombok.Data;

@Data
public class UserUpdateVM {
	// no need to pass password to server for info update, use this class instead
	private String displayName; 
	private String image; 
}

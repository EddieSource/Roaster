package com.roaster.roaster;

import com.roaster.roaster.user.User;

public class TestUtil {
	public static User createValidUser() {
		User user = new User(); 
		user.setDisplayName("test-display"); 
		user.setUsername("test-user");
		user.setPassword("P4ssword");
		return user; 
	}
}

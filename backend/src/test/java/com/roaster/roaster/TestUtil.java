package com.roaster.roaster;

import com.roaster.roaster.user.User;

public class TestUtil {
	public static User createValidUser() {
		User user = new User(); 
		user.setDisplayName("test-display"); 
		user.setUsername("test-user");
		user.setPassword("P4ssword");
		user.setImage("profile-image.png");
		return user; 
	}
	
	public static User createValidUser(String username) {
		User user = createValidUser(); 
		user.setUsername(username);
		return user; 
	}
}

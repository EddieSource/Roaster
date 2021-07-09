package com.roaster.roaster.user;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

// handling for HTTP requests
@RestController
public class UserController {
	
	@PostMapping("/api/1.0/users")
	void createUser() {
		
	}
}

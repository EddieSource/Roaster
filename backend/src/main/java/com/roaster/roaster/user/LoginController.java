package com.roaster.roaster.user;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	@CrossOrigin(origins = "http://localhost:3000")
	void handleLogin() {
		
	}

}

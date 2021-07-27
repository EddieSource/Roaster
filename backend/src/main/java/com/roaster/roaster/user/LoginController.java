package com.roaster.roaster.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	@CrossOrigin(origins = "http://localhost:3000")
	void handleLogin() {
		
	}
	
	// request is not at the stage of being passed to controller so use internal error forwarding mechanisms
	

}

package com.roaster.roaster.user;

import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roaster.roaster.shared.CurrentUser;

@RestController
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	@CrossOrigin(origins = "http://localhost:3000")
	Map<String, Object> handleLogin(@CurrentUser User loggedInUser) {
		return Collections.singletonMap("id", loggedInUser.getId()); 
	}
	
	// request is not at the stage of being passed to controller so use internal error forwarding mechanisms
	

}

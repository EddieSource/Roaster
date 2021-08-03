package com.roaster.roaster.user;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.annotation.JsonView;
import com.roaster.roaster.shared.CurrentUser;
import com.roaster.roaster.user.vm.UserVM;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
	
	@PostMapping("/api/1.0/login")
	UserVM handleLogin(@CurrentUser User loggedInUser) {
		return new UserVM(loggedInUser); 
	}
	
	// request is not at the stage of being passed to controller so use internal error forwarding mechanisms
	

}

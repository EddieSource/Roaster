package com.roaster.roaster.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.roaster.roaster.shared.GenericResponse;

// handling for HTTP requests
@RestController
public class UserController {
	
	@Autowired
	UserService userService; 
	
	@PostMapping("/api/1.0/users")
	GenericResponse createUser(@RequestBody User user) {
		userService.save(user); 
		return new GenericResponse("User saved"); // finally convert to json by the library, require no args constructor 
	}
	
	
	
}
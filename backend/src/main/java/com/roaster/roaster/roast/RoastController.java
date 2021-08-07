package com.roaster.roaster.roast;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roaster.roaster.shared.CurrentUser;
import com.roaster.roaster.user.User;

@RestController
@RequestMapping("api/1.0")
@CrossOrigin(origins = "http://localhost:3000")
public class RoastController {
	
	@Autowired
	RoastService roastService; 
	
	@PostMapping("/roasts")
	void createRoast(@Valid @RequestBody Roast roast, @CurrentUser User user) {
		roastService.save(user, roast);
	}

	
}

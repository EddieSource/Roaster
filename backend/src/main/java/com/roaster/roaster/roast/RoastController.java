package com.roaster.roaster.roast;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/1.0")
public class RoastController {
	
	@Autowired
	RoastService roastService; 
	
	@PostMapping("/roasts")
	void createRoast(@RequestBody Roast roast) {
		roastService.save(roast);
	}

}

package com.roaster.roaster.roast;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.roaster.roaster.roast.vm.RoastVM;
import com.roaster.roaster.shared.CurrentUser;
import com.roaster.roaster.user.User;

@RestController
@RequestMapping("api/1.0")
@CrossOrigin(origins = "http://localhost:3000")
public class RoastController {
	
	@Autowired
	RoastService roastService; 
	
	@PostMapping("/roasts")
	RoastVM createRoast(@Valid @RequestBody Roast roast, @CurrentUser User user) {
		return new RoastVM(roastService.save(user, roast));
	}

	@GetMapping("/roasts")
	Page<RoastVM> getAllRoasts(Pageable pageable) {
		return roastService.getAllRoasts(pageable).map(RoastVM::new); 
	}
}

package com.roaster.roaster.roast;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.roaster.roaster.roast.vm.RoastVM;
import com.roaster.roaster.shared.CurrentUser;
import com.roaster.roaster.shared.GenericResponse;
import com.roaster.roaster.user.User;

@RestController
@RequestMapping("/api/1.0")
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
	
	@GetMapping("/users/{username}/roasts")
	Page<RoastVM> getRoastsOfUser(@PathVariable String username, Pageable pageable) {
		return roastService.getRoastsOfUser(username, pageable).map(RoastVM::new); 
	}
	
	@GetMapping({"/roasts/{id:[0-9]+}", "/users/{username}/roasts/{id:[0-9]+}"}) 
	ResponseEntity<?> getRoastsRelative(@PathVariable long id,
			@PathVariable(required=false) String username,
			Pageable pageable,
			@RequestParam(name="direction", defaultValue="after") String direction,
			@RequestParam(name="count", defaultValue="false", required=false) boolean count
			) {
		if(!direction.equalsIgnoreCase("after")) {			
			return ResponseEntity.ok(roastService.getOldRoasts(id, username, pageable).map(RoastVM::new));
		}
		
		if(count == true) {
			long newRoastCount = roastService.getNewRoastsCount(id, username);
			return ResponseEntity.ok(Collections.singletonMap("count", newRoastCount));
		}
		
		List<RoastVM> newRoasts = roastService.getNewRoasts(id, username, pageable).stream()
				.map(RoastVM::new).collect(Collectors.toList());
		return ResponseEntity.ok(newRoasts);
	}
	
	@DeleteMapping("/roasts/{id:[0-9]+}")
	@PreAuthorize("@roastSecurityService.isAllowedToDelete(#id, principal)")
	GenericResponse deleteRoast(@PathVariable long id) {
		roastService.deleteRoast(id);
		return new GenericResponse("Roast is removed"); 
	}
	
	
}

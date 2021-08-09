package com.roaster.roaster.shared;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.roaster.roaster.roast.Roast;
import com.roaster.roaster.roast.RoastRepository;
import com.roaster.roaster.user.User;

@Service
public class RoastSecurityService {
	RoastRepository roastRepository; 
	
	
	public RoastSecurityService(RoastRepository roastRepository) {
		super();
		this.roastRepository = roastRepository;
	}


	public boolean isAllowedToDelete(long roastId, User loggedInUser) {
		Optional<Roast> optionalRoast = roastRepository.findById(roastId); 
		if(optionalRoast.isPresent()) {
			Roast inDB = optionalRoast.get(); 
			return inDB.getUser().getId() == loggedInUser.getId(); 
		}
		return false; 
	}
}

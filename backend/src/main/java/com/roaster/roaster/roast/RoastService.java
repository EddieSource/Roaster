package com.roaster.roaster.roast;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserService;

@Service
public class RoastService {
	RoastRepository roastRepository;
	UserService userService; 
	public RoastService(RoastRepository roastRepository, UserService userService) {
		super();
		this.roastRepository = roastRepository;
		this.userService = userService; 
	} 
	
	public Roast save(User user, Roast roast) {
		roast.setTimestamp(new Date());
		roast.setUser(user);
		return roastRepository.save(roast); 
	}

	public Page<Roast> getAllRoasts(Pageable pageable) {
		return roastRepository.findAll(pageable);
	}

	public Page<Roast> getRoastsOfUser(String username, Pageable pageable) {
		User inDB = userService.getByUsername(username); 
		return roastRepository.findByUser(inDB, pageable); 
	}
}

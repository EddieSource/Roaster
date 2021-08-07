package com.roaster.roaster.roast;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.roaster.roaster.user.User;

@Service
public class RoastService {
	RoastRepository roastRepository;

	public RoastService(RoastRepository roastRepository) {
		super();
		this.roastRepository = roastRepository;
	} 
	
	public void save(User user, Roast roast) {
		roast.setTimestamp(new Date());
		roast.setUser(user);
		roastRepository.save(roast); 
	}
}

package com.roaster.roaster.roast;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.roaster.roaster.user.User;

@Service
public class RoastService {
	RoastRepository roastRepository;

	public RoastService(RoastRepository roastRepository) {
		super();
		this.roastRepository = roastRepository;
	} 
	
	public Roast save(User user, Roast roast) {
		roast.setTimestamp(new Date());
		roast.setUser(user);
		return roastRepository.save(roast); 
	}

	public Page<Roast> getAllRoasts(Pageable pageable) {
		return roastRepository.findAll(pageable);
	}
}

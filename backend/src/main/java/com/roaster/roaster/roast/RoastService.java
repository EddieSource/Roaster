package com.roaster.roaster.roast;

import java.util.Date;

import org.springframework.stereotype.Service;

@Service
public class RoastService {
	RoastRepository roastRepository;

	public RoastService(RoastRepository roastRepository) {
		super();
		this.roastRepository = roastRepository;
	} 
	
	public void save(Roast roast) {
		roast.setTimestamp(new Date());
		roastRepository.save(roast); 
	}
}

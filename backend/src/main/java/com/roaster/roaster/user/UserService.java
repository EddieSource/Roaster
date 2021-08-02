package com.roaster.roaster.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service	
public class UserService {
	
	
	UserRepository userRepository;
	PasswordEncoder passwordEncoder; 
	
	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = new BCryptPasswordEncoder(); 
	} 
	
	
	public User save(User user) {
		// check if we have user in db with this username
		
		// not optimal since userservice should not be reponsibly for validation
		// user class should do that
//		User inDB = userRepository.findByUsername(user.getUsername()); 
//		if(inDB != null) {
//			throw new DuplicateUsernameException(); 
//		}  
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepository.save(user); 
	}


	public Page<?> getUsers() {
		// TODO Auto-generated method stub
		Pageable pageable = PageRequest.of(0, 10); // set each page with 10 items
		return userRepository.findAll(pageable); 
	}
	
}

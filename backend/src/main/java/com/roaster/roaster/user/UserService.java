package com.roaster.roaster.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.roaster.roaster.error.NotFoundException;

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


	public Page<User> getUsers(User loggedInUser, Pageable pageable) {
		// TODO Auto-generated method stub
		if(loggedInUser != null) {
			return userRepository.findByUsernameNot(loggedInUser.getUsername(), pageable); 
		}
		return userRepository.findAll(pageable); 
	}


	public User getByUsername(String username) {
		// TODO Auto-generated method stub
		User inDB = userRepository.findByUsername(username); 
		if(inDB == null){
			throw new NotFoundException(username + " not found"); 
		}
		return inDB; 
	}
	
}

package com.roaster.roaster.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{
	//spring is creating proxy class of definition of the interface
	//spring data jpa will handling all the queries and responding table and convert it to objects we want
	
	User findByUsername(String username); 
	
	Page<User> findByUsernameNot(String username, Pageable page); 
	
	
}

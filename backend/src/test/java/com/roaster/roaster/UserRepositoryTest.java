package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;


import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserRepository;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepositoryTest {
	
	@Autowired
	TestEntityManager testEntityManager; 
	
	@Autowired
	UserRepository userRepository; 
	
	@BeforeEach
	public void cleanup() {
		userRepository.deleteAll(); 	// delete all entries of users in database
	}
	
	@Test
	public void findByUsername_whenUserExists_returnsUser() {
		User user = new User();  
		
		user.setUsername("test-user");
		user.setDisplayName("test-display"); 
		user.setPassword("P4ssword");
		testEntityManager.persist(user); 
		
		User inDB = userRepository.findByUsername("test-user"); 
		assertThat(inDB).isNotNull(); 
	}
	
	@Test
	public void findByUsername_whenUserDoesNotExist_returnsNull() {
		User inDB = userRepository.findByUsername("nonexistinguser"); 
		assertThat(inDB).isNull(); 
	}
	
}

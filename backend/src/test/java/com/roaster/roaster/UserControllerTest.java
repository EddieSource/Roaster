package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.shared.GenericResponse;
import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserRepository;

// integration test

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment
@FixMethodOrder(MethodSorters.NAME_ASCENDING) // run tests in a specific order
public class UserControllerTest {
	// schema: methodName_condition_expectedBehavior
	
	private static final String API_1_0_USERS = "/api/1.0/users";
	
	@Autowired //field injection
	TestRestTemplate testRestTemplate; // spring will create an instance of this when running test
	
	@Autowired
	UserRepository userRepository; 
	
	@Before
	public void cleanup() {
		userRepository.deleteAll(); 	// delete all entries of users in database
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveOk() {
		User user = createValidUser(); 
		
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); 
	}

	
	@Test 
	public void postUser_whenUserIsValid_userSavedToDatabase() {
		User user = createValidUser(); 
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class); 
		assertThat(userRepository.count()).isEqualTo(1); 
		
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveSuccessMessage() {
		User user = createValidUser(); 	
		ResponseEntity<GenericResponse> response = postSignup(user, GenericResponse.class); 
		assertThat(response.getBody().getMessage()).isNotNull();  
	}
	
	@Test
	public void postUser_whenUserIsValid_passwordIsHashedInDatabase() {
		User user = createValidUser(); 
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class); 
		List<User> users = userRepository.findAll(); // retrieve all user in db
		User inDB = users.get(0); // get the 1st and the only one
		assertThat(inDB.getPassword()).isNotEqualTo(user.getPassword()); 
		
	}
	
	@Test
	public void postUser_whenUserHasNullUsername_receiveBadRequest() {
		User user = createValidUser(); 
		user.setUsername(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasNullDisplayName_receiveBadRequest() {
		User user = createValidUser(); 
		user.setDisplayName(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasNullPassword_receiveBadRequest() {
		User user = createValidUser(); 
		user.setPassword(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasUsernameWithLessThanRequired_receiveBadRequest() {
		User user = createValidUser(); 
		user.setUsername("abc"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasDisplayNameWithLessThanRequired_receiveBadRequest() {
		User user = createValidUser(); 
		user.setDisplayName("abc"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasPasswordWithLessThanRequired_receiveBadRequest() {
		User user = createValidUser(); 
		user.setPassword("abcdefg"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	
	public <T> ResponseEntity<T> postSignup(Object request, Class<T> response){
		return testRestTemplate.postForEntity(API_1_0_USERS, request, response); 
	}
	
	
	private User createValidUser() {
		User user = new User(); 
		user.setUsername("test-username"); 
		user.setDisplayName("test-name"); 
		user.setPassword("test-password");
		return user;
	}
}

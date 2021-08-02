package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;


import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.junit.FixMethodOrder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.error.ApiError;
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
	
	@BeforeEach
	public void cleanup() {
		userRepository.deleteAll(); 	// delete all entries of users in database
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveOk() {
		User user = TestUtil.createValidUser(); 
		
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); 
	}

	
	@Test 
	public void postUser_whenUserIsValid_userSavedToDatabase() {
		User user = TestUtil.createValidUser(); 
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class); 
		assertThat(userRepository.count()).isEqualTo(1); 
		
	}
	
	@Test
	public void postUser_whenUserIsValid_receiveSuccessMessage() {
		User user = TestUtil.createValidUser(); 	
		ResponseEntity<GenericResponse> response = postSignup(user, GenericResponse.class); 
		assertThat(response.getBody().getMessage()).isNotNull();  
	}
	
	@Test
	public void postUser_whenUserIsValid_passwordIsHashedInDatabase() {
		User user = TestUtil.createValidUser(); 
		testRestTemplate.postForEntity(API_1_0_USERS, user, Object.class); 
		List<User> users = userRepository.findAll(); // retrieve all user in db
		User inDB = users.get(0); // get the 1st and the only one
		assertThat(inDB.getPassword()).isNotEqualTo(user.getPassword()); 
		
	}
	
	@Test
	public void postUser_whenUserHasNullUsername_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setUsername(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasNullDisplayName_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setDisplayName(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasNullPassword_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setPassword(null); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasUsernameWithLessThanRequired_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setUsername("abc"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasDisplayNameWithLessThanRequired_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setDisplayName("abc"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserHasPasswordWithLessThanRequired_receiveBadRequest() {
		User user = TestUtil.createValidUser(); 
		user.setPassword("abcdefg"); 
		ResponseEntity<Object> response = postSignup(user, Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenUserIsInvalid_receiveApiError() {
		User user = new User(); 
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class); 
		assertThat(response.getBody().getUrl()).isEqualTo(API_1_0_USERS); 
	}
	
	
	@Test
	public void postUser_whenUserIsInvalid_receiveApiErrorWithValidationErrors() {
		User user = new User(); 
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class); 
		assertThat(response.getBody().getValidationErrors().size()).isEqualTo(3); 
	}
	
	@Test
	public void postUser_whenUserHasNullUsername_receiveMessageOfNullErrorForUsername() {
		User user = TestUtil.createValidUser(); 
		user.setUsername(null);
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class); 
		Map<String, String> validationErrors = response.getBody().getValidationErrors(); 
		assertThat(validationErrors.get("username")).isEqualTo("Username cannot be null"); 
	}
	
	@Test
	public void postUser_whenUserHasNullPassword_receiveMessageOfNullErrorForPassword() {
		User user = TestUtil.createValidUser(); 
		user.setPassword(null);
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class); 
		Map<String, String> validationErrors = response.getBody().getValidationErrors(); 
		assertThat(validationErrors.get("password")).isEqualTo("Password cannot be null"); 
	}
	
	@Test
	public void postUser_whenUserHasInvalidLengthUsername_receiveGenericMessageOfSizeError() {
		User user = TestUtil.createValidUser(); 
		user.setUsername("abc");
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class); 
		Map<String, String> validationErrors = response.getBody().getValidationErrors(); 
		assertThat(validationErrors.get("username")).isEqualTo("size must be between 4 and 255"); 
	}
	
	
	
	@Test
	public void postUser_whenAnotherUserHasSameUsername_receiveBadRequest() {
		userRepository.save(TestUtil.createValidUser()); 
		
		User user = TestUtil.createValidUser(); 
		ResponseEntity<Object> response = postSignup(user,Object.class); 
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST); 
	}
	
	@Test
	public void postUser_whenAnotherUserHasSameUsername_receiveMessageOfDuplicateUsernamet() {
		userRepository.save(TestUtil.createValidUser());
		
		User user = TestUtil.createValidUser();
		ResponseEntity<ApiError> response = postSignup(user, ApiError.class);
		Map<String, String> validationErrors = response.getBody().getValidationErrors();
		assertThat(validationErrors.get("username")).isEqualTo("This name is in use");
	}
	
	@Test
	public void getUsers_whenThereAreNoUsersInDB_receiveOK() {
		ResponseEntity<Object> response = getUsers(new ParameterizedTypeReference<Object>() {});
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
	}
	
	@Test
	public void getUsers_whenThereAreNoUsersInDB_receivePageWithZeroItems() {
		ResponseEntity<TestPage<Object>> response = getUsers(new ParameterizedTypeReference<TestPage<Object>>() {});
		assertThat(response.getBody().getTotalElements()).isEqualTo(0);
	}	
	
	@Test
	public void getUsers_whenThereIsAUserInDB_receiveUserWithoutPassword() {
		userRepository.save(TestUtil.createValidUser());
		ResponseEntity<TestPage<Map<String, Object>>> response = getUsers(new ParameterizedTypeReference<TestPage<Map<String, Object>>>() {});
		Map<String, Object> entity = response.getBody().getContent().get(0);
		assertThat(entity.containsKey("password")).isFalse();
	}
	
	
	public <T> ResponseEntity<T> postSignup(Object request, Class<T> response){
		return testRestTemplate.postForEntity(API_1_0_USERS, request, response); 
	}
	
	public <T> ResponseEntity<T> getUsers(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_USERS, HttpMethod.GET, null, responseType);
	}
	
}

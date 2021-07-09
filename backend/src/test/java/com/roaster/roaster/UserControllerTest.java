package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.user.User;

// integration test

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment
public class UserControllerTest {
	// schema: methodName_condition_expectedBehavior
	
	@Autowired //field injection
	TestRestTemplate testRestTemplate; // spring will create an instance of this when running test
	
	
	@Test
	public void postUser_whenUserIsValid_receiveOk() {
		User user = new User(); 
		user.setUsername("test-username"); 
		user.setDisplayName("test-name"); 
		user.setPassword("test-password"); 
		
		ResponseEntity<Object> response = testRestTemplate.postForEntity("/api/1.0/users", user, Object.class); 
		
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); 
	}
}

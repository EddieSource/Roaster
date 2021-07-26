package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment
@FixMethodOrder(MethodSorters.NAME_ASCENDING) // run tests in a specific order

public class LoginControllerTest {
	private static final String API_1_0_USERS = "/api/1.0/login";
	
	@Autowired //field injection
	TestRestTemplate testRestTemplate; // spring will create an instance of this when running test
	
	@Test
	public void postLogin_withoutUser_Credentials_receiveUnauthorized() {
		ResponseEntity<Object> response = login(Object.class) ;
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 
	}
	
	@Test
	public void postLogin_withInCorrectCredentials_receiveUnauthorized() {
		authenticate(); 
		ResponseEntity<Object> response = login(Object.class) ;
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED); 
	}
	
	public void authenticate() {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor("test-user", "P4ssword")); 
	}
	
	public <T> ResponseEntity<T> login(Class<T> responseType){
		return testRestTemplate.postForEntity(API_1_0_USERS, null, responseType); 
		
	}
}

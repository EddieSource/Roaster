package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.FixMethodOrder;
import org.junit.jupiter.api.BeforeEach;
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

import com.roaster.roaster.error.ApiError;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment

public class LoginControllerTest {
	private static final String API_1_0_LOGIN = "/api/1.0/login";
	
	
	@Autowired //field injection
	TestRestTemplate testRestTemplate; // spring will create an instance of this when running test
	
	@BeforeEach
	public void cleanup() {
		testRestTemplate.getRestTemplate().getInterceptors().clear();
	}
	
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
	
	@Test
	public void postLogin_withoutUserCredentials_receiveApiError() {
		ResponseEntity<String> response = login(String.class);
		assertThat(response.getBody().contains("validationErrors")).isFalse();
	}
	
	@Test
	public void postLogin_withoutUserCredentials_receiveApiErrorWithoutValidationErrors() {
		ResponseEntity<ApiError> response = login(ApiError.class);
		assertThat(response.getBody().getUrl()).isEqualTo(API_1_0_LOGIN);
	}
	
	
	public void authenticate() {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor("test-user", "P4ssword")); 
	}
	
	@Test
	public void postLogin_withInCorrectCredentials_receiveUnauthorizedWithoutValidationError() {
		authenticate(); 
		ResponseEntity<Object> response = login(Object.class) ;
		assertThat(response.getHeaders().containsKey("WWW-Authenticate")).isFalse();
		
	}
	
	
	public <T> ResponseEntity<T> login(Class<T> responseType){
		return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType); 
		
	}
}
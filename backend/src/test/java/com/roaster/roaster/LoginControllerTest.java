package com.roaster.roaster;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.FixMethodOrder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.support.BasicAuthenticationInterceptor;
import org.springframework.test.context.ActiveProfiles;

import com.roaster.roaster.error.ApiError;
import com.roaster.roaster.user.User;
import com.roaster.roaster.user.UserRepository;
import com.roaster.roaster.user.UserService;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")	// define the profile to run in a controlled environment

public class LoginControllerTest {
	private static final String API_1_0_LOGIN = "/api/1.0/login";
	
	
	@Autowired //field injection
	TestRestTemplate testRestTemplate; // spring will create an instance of this when running test
	
	@Autowired
	UserRepository userRepository; 
	
	@Autowired
	UserService userService; 
	
	@BeforeEach
	public void cleanup() {
		userRepository.deleteAll(); 
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
	
	@Test
	public void postLogin_withInCorrectCredentials_receiveUnauthorizedWithoutValidationError() {
		authenticate(); 
		ResponseEntity<Object> response = login(Object.class) ;
		assertThat(response.getHeaders().containsKey("WWW-Authenticate")).isFalse();
	}
	
	@Test
	public void postLogin_withValidCredentials_receiveOk() {
		userService.save(TestUtil.createValidUser()); 
		authenticate(); 
		ResponseEntity<Object> response = login(Object.class) ;
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK); 
	}
	
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUserId() {
		User inDB = userService.save(TestUtil.createValidUser());
		authenticate(); 
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		Map<String, Object> body = response.getBody(); 
		String image = (String) body.get("image"); 
		assertThat(image).isEqualTo(inDB.getImage());
	}
	
	
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUserDisplayName() {
		User inDB = userService.save(TestUtil.createValidUser());
		authenticate(); 
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		Map<String, Object> body = response.getBody(); 
		String displayName = (String) body.get("displayName"); 
		assertThat(displayName).isEqualTo(inDB.getDisplayName());
	}
	
	@Test
	public void postLogin_withValidCredentials_receiveLoggedInUserUserName() {
		User inDB = userService.save(TestUtil.createValidUser());
		authenticate(); 
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		Map<String, Object> body = response.getBody(); 
		String username = (String) body.get("username"); 
		assertThat(username).isEqualTo(inDB.getUsername());
	}
	
	
	public void postLogin_withValidCredentials_receiveLoggedInUserImage() {
		User inDB = userService.save(TestUtil.createValidUser());
		authenticate(); 
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		Map<String, Object> body = response.getBody(); 
		Integer id = (Integer) body.get("id"); 
		assertThat(id).isEqualTo(inDB.getId());
	}
	
	public void postLogin_withValidCredentials_notReceiveLoggedInUserPassword() {
		userService.save(TestUtil.createValidUser());
		authenticate(); 
		ResponseEntity<Map<String, Object>> response = login(new ParameterizedTypeReference<Map<String, Object>>(){});
		Map<String, Object> body = response.getBody(); 
		assertThat(body.containsKey("password")).isFalse(); 
	}
	
	
	public void authenticate() {
		testRestTemplate.getRestTemplate()
			.getInterceptors().add(new BasicAuthenticationInterceptor("test-user", "P4ssword")); 
	}
	
	public <T> ResponseEntity<T> login(Class<T> responseType){
		return testRestTemplate.postForEntity(API_1_0_LOGIN, null, responseType); 
	}
	
	public <T> ResponseEntity<T> login(ParameterizedTypeReference<T> responseType){
		return testRestTemplate.exchange(API_1_0_LOGIN, HttpMethod.POST, null, responseType); 
	}
}
